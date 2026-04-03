"use server"

import { db } from "@/drizzle/db/db";
import { Client, clientActivities, clientNotes, clients, ClientWithRelations } from "@/drizzle/schema";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ActionResult, requirePermission, requireUserContext, safeAction } from "@/lib/helpers";
import { createClientActivity } from "./client-activities";
import { AddNotesInput, CreateClientInput, UpdateClientInput, UpdateNoteInput } from "@/lib/types/clients";

export async function getClients(orgId?: string): Promise<ClientWithRelations[]> {
  const { org } = await requireUserContext(orgId)
  try {
    const allClients = await db.query.clients.findMany({
      where: eq(clients.organizationId, org.id),
      with: {
        organization: true
      },
      orderBy: [desc(clients.createdAt)],
    });
    if(allClients.length === 0) return []

    return allClients
  } catch (error) {
    console.error("Échec récupération clients:", error);
    return [];
  }
}

export async function getClient(clientId: string, orgId?: string): Promise<ActionResult<Client>> {
  return safeAction(async () => {
    const { org } = await requireUserContext(orgId)
    const client = await db.query.clients.findFirst({
      where: and(
        eq(clients.id, clientId),
        eq(clients.organizationId, org.id)
      )
    })

    if (!client) {
      throw new Error("Aucun client trouvé")
    }

    return client
  }, {
    errorMessage: "Erreur serveur"
  })
}

export async function createClient(data: CreateClientInput) {
  return safeAction(async () => {
    const { org, member } = await requirePermission("clients.manage")
    if (!data.name || !data.email || !org.id) {
      throw new Error("Champs requis manquants")
    }

    const existingClient = await db.query.clients.findFirst({
      where: and(eq(clients.email, data.email),
        eq(clients.organizationId, org.id))
    })
    if(existingClient) {
      throw new Error(`${existingClient.name} existe déjà`)
    }

    const [newClient] = await db
      .insert(clients)
      .values({
        name: data.name,
        email: data.email,
        organizationId: org.id
      })
      .returning();

    await createClientActivity({
      clientId: newClient.id,
      organizationId: org.id,
      memberId: member.id,
      event: "client_created",
      message: `Client créé: ${newClient.name}`,
    })

    revalidatePath(`/organization/${org.id}/clients`);
    return newClient
  }, {
    errorMessage: "Erreur lors de la création du client",
  })
}

export async function updateClient(data: UpdateClientInput) {
  return safeAction(async () => {
    const { org, member } = await requirePermission("clients.manage")

    const { id, ...updateFields } = data

    if (!id) {
      throw new Error("ID du client requis")
    }

    const fieldsToUpdate = Object.fromEntries(
      Object.entries(updateFields).filter(([_, value]) => value !== undefined)
    )

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("Aucun champ à mettre à jour")
    }

    if (data.email) {
      const existingClient = await db.query.clients.findFirst({
        where: and(
          eq(clients.email, data.email),
          eq(clients.organizationId, org.id)
        )
      })

      if (existingClient && existingClient.id !== id) {
        throw new Error("Un client avec ce courriel existe déjà")
      }
    }

    const [updatedClient] = await db
      .update(clients)
      .set(fieldsToUpdate)
      .where(
        and(
          eq(clients.id, id),
          eq(clients.organizationId, org.id)
        )
      )
      .returning()

    if (!updatedClient) {
      throw new Error("Client non trouvé ou accès non autorisé")
    }

    await createClientActivity({
      clientId: updatedClient.id,
      organizationId: org.id,
      memberId: member.id,
      event: "client_updated",
      message: `Client modifié`,
    })

    revalidatePath(`/organization/${org.id}/clients`)

    return updatedClient
  }, {
    errorMessage: "Erreur lors de la mise à jour du client"
  })
}

export async function deleteClient(id: string) {
  return safeAction(async () => {
    const { org } = await requirePermission("clients.manage")
    const deleted = await db
      .delete(clients)
      .where(and(eq(clients.id, id), eq(clients.organizationId, org.id)))
      .returning()

    if (!deleted.length) {
      throw new Error("Client non trouvé ou accès refusé")
    }

    revalidatePath(`/organization/${org.id}/clients`)
    return deleted[0]
  }, {
    errorMessage: "Erreur serveur",
  })
}

export async function addNotes(data: AddNotesInput, clientId: string) {
  return safeAction(async () => {
    const { member, org } = await requirePermission("clients.manage")
    const client = await db.query.clients.findFirst({
      where: and(
        eq(clients.id, clientId),
        eq(clients.organizationId, org.id)
      ),
    })

    if (!client) {
      throw new Error("Client introuvable")
    }

    const [note] = await db
      .insert(clientNotes)
      .values({
        clientId,
        organizationId: org.id,
        notes: data.notes,
        memberId: member.id,
      })
      .returning()

    await createClientActivity({
      clientId: note.clientId,
      organizationId: note.organizationId,
      memberId: member.id,
      event: "note_added",
      message: "Note ajoutée au dossier client",
    })

    revalidatePath(`/organization/${note.organizationId}/clients/${note.clientId}`)
    return note 
  })
}

export async function getClientActivities(clientId: string, orgId?: string) {
  return safeAction(async () => {
    const { org } = await requireUserContext(orgId)

    if (!clientId) {
      throw new Error("Client ID requis")
    }

    const activities = await db.query.clientActivities.findMany({
      where: and(
        eq(clientActivities.clientId, clientId),
        eq(clientActivities.organizationId, org.id)
      ),
      with: {
        memberships: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (activity, { desc }) => [desc(activity.createdAt)],
    })

    return activities
  }, {
    errorMessage: "Erreur lors de la récupération des activités",
  })
}

export async function getClientNotes(clientId: string, orgId?: string) {
  return safeAction(async () => {
    const { org } = await requireUserContext(orgId)

    if (!clientId) {
      throw new Error("Client ID requis")
    }

    const notes = await db.query.clientNotes.findMany({
      where: and(
        eq(clientNotes.clientId, clientId),
        eq(clientNotes.organizationId, org.id)
      ),
      with: {
        memberships: {
          with: {
            user: true
          }
        }
      },
      orderBy: (notes, { desc }) => [desc(notes.createdAt)]
    })

    return notes
  }, {
    errorMessage: "Erreur lors de la récupération des notes"
  })
}

export async function updateNote({ notes, noteId }: UpdateNoteInput) {
  return safeAction(async () => {
    const { member, org } = await requirePermission("clients.manage")
    const [updated] = await db.update(clientNotes)
      .set({
        notes,
        memberId: member.id,
      })
      .where(
        and(
          eq(clientNotes.id, noteId),
          eq(clientNotes.organizationId, org.id)
        )
      )
      .returning()

    if (!updated) {
      throw new Error("Note non trouvée")
    }

    await createClientActivity({
      clientId: updated.clientId,
      organizationId: updated.organizationId,
      memberId: member.id,
      event: "note_updated",
      message: "Note modifiée",
    })

    revalidatePath(`/organization/${updated.organizationId}/clients/${updated.clientId}`)
    return updated
  }, {
    errorMessage: "Erreur serveur",
  })
}

export async function deleteNote(noteId: string) {
  return safeAction(async () => {
    const { member, org } = await requirePermission("clients.manage")
    const deleted = await db.delete(clientNotes)
      .where(
        and(
          eq(clientNotes.id, noteId),
          eq(clientNotes.organizationId, org.id)
        )
      )
      .returning()

    if (!deleted.length) {
      throw new Error("Note non trouvée ou suppression impossible")
    }

    await createClientActivity({
      clientId: deleted[0].clientId,
      organizationId: deleted[0].organizationId,
      memberId: member.id,
      event: "note_deleted",
      message: "Note supprimée",
    })

    revalidatePath(`/organization/${deleted[0].organizationId}/clients/${deleted[0].clientId}`)
    return deleted[0]
  }, {
    errorMessage: "Erreur serveur",
  })
}
