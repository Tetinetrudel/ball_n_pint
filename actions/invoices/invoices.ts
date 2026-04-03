"use server"

import { db } from "@/drizzle/db/db"
import { clients, invoices, invoiceItems, products, clientCards } from "@/drizzle/schema"
import { requirePermission, requireUserContext, safeAction } from "@/lib/helpers"
import { revalidatePath } from "next/cache"
import { and, eq, inArray } from "drizzle-orm";
import { InvoiceWithItems } from "@/lib/types"
import { createClientActivity } from "../clients/client-activities";

type CreateInvoiceInput = {
  clientId: string
  items: {
    productId: string
    quantity: number
    price: number
  }[]
}

export async function createInvoice(input: CreateInvoiceInput) {
  return safeAction(async () => {
    const { org, member } = await requirePermission("invoices.manage")
    const client = await db.query.clients.findFirst({
      where: and(
        eq(clients.id, input.clientId),
        eq(clients.organizationId, org.id)
      ),
    })

    if (!client) {
      throw new Error("Client introuvable")
    }

    if (input.items.length === 0) {
      throw new Error("Aucun item dans la facture")
    }

    const total = input.items.reduce(
        (acc, item) => acc + item.price * item.quantity, 0
    )

    const lastInvoice = await db.query.invoices.findFirst({
      orderBy: (i, { desc }) => [desc(i.createdAt)],
    })

    const lastNumber = lastInvoice?.invoiceNumber
      ? parseInt(lastInvoice.invoiceNumber.split("-")[1])
      : 0

    const newNumber = `INV-${String(lastNumber + 1).padStart(5, "0")}`

    const [invoice] = await db
    .insert(invoices)
    .values({
        clientId: input.clientId,
        organizationId: org.id,
        total: total.toString(), 
        invoiceNumber: newNumber,
    })
    .returning()

    await db.insert(invoiceItems).values(
      input.items.map((item) => ({
        invoiceId: invoice.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price.toString(),
      }))
    )

    const productIds = input.items.map((item) => item.productId);

    const allProducts = await db.query.products.findMany({
      where: and(
        inArray(products.id, productIds),
        eq(products.organizationId, org.id)
      ),
    });

    if (allProducts.length !== productIds.length) {
      throw new Error("Un ou plusieurs produits sont introuvables")
    }

    const cardProducts = allProducts.filter((p) =>
      p.name.toLowerCase().includes("carte")
    );

    const cardItems = input.items.filter((item) =>
      cardProducts.some((p) => p.id === item.productId)
    );

    if (cardItems.length > 0) {
      await db.insert(clientCards).values(
        cardItems.map((item) => ({
          organizationId: org.id,
          clientId: input.clientId,
          productId: item.productId,
          memberId: member.id,
          initialCount: 10,
          remainingCount: 10,
        }))
      );
    }

    await createClientActivity({
      clientId: input.clientId,
      organizationId: org.id,
      memberId: member.id,
      event: "invoice_created",
      message: `Facture ${invoice.invoiceNumber} créée (${input.items.length} item(s))`,
    })

    if (cardItems.length > 0) {
      await createClientActivity({
        clientId: input.clientId,
        organizationId: org.id,
        memberId: member.id,
        event: "card_created_from_invoice",
        message: `${cardItems.length} carte(s) ajoutée(s) suite à la facture`,
      })
    }

    revalidatePath(`/organization/${org.id}/clients/${input.clientId}`)

    return invoice
  })
}

export async function getClientInvoices(clientId: string) {
  const { org } = await requirePermission("invoices.manage")
  return db.query.invoices.findMany({
    where: and(
      eq(invoices.clientId, clientId),
      eq(invoices.organizationId, org.id)
    ),
    with: {
      items: {
        with: {
          product: true
        }
      }
    },
    orderBy: (i, { desc }) => [desc(i.createdAt)],
  }) as Promise<InvoiceWithItems[]>; 
}

export async function payInvoice(invoiceId: string) {
  const { org, member } = await requirePermission("invoices.manage")
  return safeAction(async () => {

    const invoice = await db.query.invoices.findFirst({
      where: and(
        eq(invoices.id, invoiceId),
        eq(invoices.organizationId, org.id)
      ),
    })

    if (!invoice) {
      throw new Error("Facture introuvable")
    }

    await db.update(invoiceItems)
      .set({ paid: true })
      .where(eq(invoiceItems.invoiceId, invoiceId));

    const [updatedInvoice] = await db.update(invoices)
      .set({ status: "payee" })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.organizationId, org.id)))
      .returning()

    await createClientActivity({
      clientId: updatedInvoice.clientId,
      organizationId: org.id,
      memberId: member.id,
      event: "invoice_paid",
      message: `Facture ${updatedInvoice.invoiceNumber} payée`,
    })

    revalidatePath(`/organization/${org.id}/clients/${updatedInvoice.clientId}`)

    return updatedInvoice;
  }, { errorMessage: "Erreur lors du paiement de la facture" });
}

export async function payInvoiceItem(itemId: string) {
  return safeAction(async () => {
    const { org, member } = await requirePermission("invoices.manage")

    const [item] = await db.select().from(invoiceItems).where(eq(invoiceItems.id, itemId));
    if (!item) throw new Error("Article non trouvé")

    if (item.paid) throw new Error("Article déjà payé")

    const parentInvoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, item.invoiceId), eq(invoices.organizationId, org.id)),
    })
    if (!parentInvoice) throw new Error("Facture non autorisée")

    const [updated] = await db
      .update(invoiceItems)
      .set({ paid: true })
      .where(eq(invoiceItems.id, itemId))
      .returning();

    const lastUpdate = await db.query.invoiceItems.findMany({
      where: and(eq(invoiceItems.invoiceId, updated.invoiceId), eq(invoiceItems.paid, false))
    })

    if(lastUpdate.length === 0) {
      const [fullyPaidInvoice] = await db.update(invoices)
      .set({ status: "payee"})
      .where(and(eq(invoices.id, updated.invoiceId), eq(invoices.organizationId, org.id)))
      .returning()

      await createClientActivity({
        clientId: fullyPaidInvoice.clientId,
        organizationId: org.id,
        memberId: member.id,
        event: "invoice_paid",
        message: `Facture ${fullyPaidInvoice.invoiceNumber} payée en totalité`,
      })
    }

    const invoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, updated.invoiceId), eq(invoices.organizationId, org.id)),
    })

    if (invoice) {
      await createClientActivity({
        clientId: invoice.clientId,
        organizationId: org.id,
        memberId: member.id,
        event: "invoice_item_paid",
        message: `Un item de la facture ${invoice.invoiceNumber} a été payé`,
      })

      revalidatePath(`/organization/${org.id}/clients/${invoice.clientId}`)
    }

    return updated
  }, { errorMessage: "Erreur serveur" })
}

export async function deleteInvoice(id: string) {
  return safeAction(async () => {
    const { org } = await requirePermission("invoices.manage")
    const invoice = await db.query.invoices.findFirst({
      where: and(eq(invoices.id, id), eq(invoices.organizationId, org.id)),
    })

    if (!invoice) {
      throw new Error("Facture non trouvée")
    }

    if (invoice.status === "payee") {
      throw new Error("Vous ne pouvez pas supprimer une facture déjà payée")
    }

    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

    const deleted = await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.organizationId, org.id)))
      .returning()

    if (!deleted.length) {
      throw new Error("Erreur lors de la suppression de la facture")
    }

    revalidatePath(`/organization/${org.id}/clients/${invoice.clientId}`)
    return deleted[0]
  }, { errorMessage: "Erreur serveur" })
}
