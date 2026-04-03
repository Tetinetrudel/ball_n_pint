"use server"

import { db } from "@/drizzle/db/db"
import { invitations, InvitationWithOrg, memberships, organizations, MembershipsWithUserAndOrg, users } from "@/drizzle/schema"
import { and, eq, ilike } from "drizzle-orm"
import { getCurrentUser } from "../users/users";
import { requirePermission, requireUserContext, safeAction } from "@/lib/helpers";
import { inviteMemberFormSchema, InviteMemberFormType } from "@/lib/schemas/organization";
import { sendEmailWithResend } from "@/lib/resend/client";
import { organizationInviteEmailTemplate } from "@/lib/resend/templates/organization-invite";
import { AppRole, canAssignRole } from "@/lib/permissions";

export async function getInvitationForUser(userEmail: string): Promise<InvitationWithOrg | null> {
    try {
        const invitation = await db.query.invitations.findFirst({
          where: and(ilike(invitations.userEmail, userEmail), 
        eq(invitations.status, "pending")
      ),
      with: { organization: true },
    });

        if(!invitation) return null

        return invitation ?? null
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getOrgMembership(
  orgId: string
): Promise<MembershipsWithUserAndOrg[] | null> {
  try {
    const orgMemberships = await db.query.memberships.findMany({
      where: eq(memberships.organizationId, orgId),
      with: { organization: true, user: true },
    });

    return orgMemberships.length ? orgMemberships : null
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createOrg(data: { name: string; }) {
  try {
    const user = await getCurrentUser()
    if(!user) {
      return { success: false, message: "Utilisateur non connecté" }
    }
    const { name } = data

    const existingOrg = await db.query.organizations.findFirst({
      where: eq(organizations.name, name),
    });

    if (existingOrg) {
      return { success: false, message: "Une organisation avec ce nom existe déjà" };
    }

    const [newOrg] = await db.insert(organizations).values({
      name,
      ownerId: user.id,
    }).returning();

    await db.insert(memberships).values({
      userId: newOrg.ownerId,
      organizationId: newOrg.id,
      role: "owner"
    })

    return { success: true, message: `${data.name} créé avec succès`, newOrg };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors de la création de votre organisation"
    return {
      success: false,
      message,
    };
  }
}

export async function getCurrentOrg(orgId: string) {
  try {
    const org = await db.query.organizations.findFirst({
      where: eq(organizations.id, orgId)
    });
    
    if(!org) {
      return null
    }

    return org
  } catch (error) {
    console.error(error)
  }

}

export async function checkUserMembership(userId: string, orgId: string) {
  const membership = await db.query.memberships.findFirst({
    where: and(
      eq(memberships.userId, userId),
      eq(memberships.organizationId, orgId)
    ),
  });

  return !!membership; 
}

function buildSignupInviteUrl(email: string) {
  const baseUrl = process.env.APP_URL || "http://localhost:3000"
  return `${baseUrl}/auth/signup?email=${encodeURIComponent(email)}`
}

export async function inviteMember(data: InviteMemberFormType) {
  return safeAction(async () => {
    const parsed = inviteMemberFormSchema.parse(data)
    const { org } = await requirePermission("members.invite")

    const existing = await db.query.invitations.findFirst({
      where: and(
        ilike(invitations.userEmail, parsed.email),
        eq(invitations.orgId, org.id),
        eq(invitations.status, "pending")
      ),
    })

    if (existing) {
      throw new Error("Une invitation en attente existe déjà pour ce courriel")
    }

    const userWithSameEmail = await db.query.users.findFirst({
      where: ilike(users.email, parsed.email),
    })

    if (userWithSameEmail) {
      const alreadyMember = await db.query.memberships.findFirst({
        where: and(
          eq(memberships.userId, userWithSameEmail.id),
          eq(memberships.organizationId, org.id)
        ),
      })

      if (alreadyMember) {
        throw new Error("Ce membre fait déjà partie de l'organisation")
      }
    }

    const [invitation] = await db.insert(invitations).values({
      userEmail: parsed.email,
      orgId: org.id,
      status: "pending",
    }).returning()

    const signupUrl = buildSignupInviteUrl(parsed.email)

    await sendEmailWithResend({
      to: parsed.email,
      subject: `Invitation à rejoindre ${org.name}`,
      html: organizationInviteEmailTemplate({
        organizationName: org.name,
        signupUrl,
      }),
    })

    return invitation
  }, {
    errorMessage: "Erreur lors de l'envoi de l'invitation",
  })
}

export async function updateMemberRole(input: { membershipId: string; role: AppRole }) {
  return safeAction(async () => {
    const { org, member } = await requirePermission("members.role.update")
    const actorRole = member.role as AppRole

    if (!canAssignRole(actorRole, input.role)) {
      throw new Error("Vous ne pouvez pas attribuer ce rôle")
    }

    const targetMembership = await db.query.memberships.findFirst({
      where: and(
        eq(memberships.id, input.membershipId),
        eq(memberships.organizationId, org.id)
      ),
    })

    if (!targetMembership) {
      throw new Error("Membre introuvable")
    }

    if (actorRole === "admin" && targetMembership.role === "owner") {
      throw new Error("Un admin ne peut pas modifier le rôle du propriétaire")
    }

    const [updatedMembership] = await db
      .update(memberships)
      .set({ role: input.role })
      .where(and(
        eq(memberships.id, input.membershipId),
        eq(memberships.organizationId, org.id)
      ))
      .returning()

    return updatedMembership
  }, {
    errorMessage: "Erreur lors de la mise à jour du rôle",
  })
}

export async function acceptOrgInvitation(invitationId: string) {
  return safeAction(async () => {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Utilisateur non connecté")
    }

    const invitation = await db.query.invitations.findFirst({
      where: and(
        eq(invitations.id, invitationId),
        ilike(invitations.userEmail, user.email),
        eq(invitations.status, "pending")
      ),
      with: { organization: true },
    })

    if (!invitation) {
      throw new Error("Invitation introuvable ou déjà traitée")
    }

    const existingMembership = await db.query.memberships.findFirst({
      where: and(
        eq(memberships.userId, user.id),
        eq(memberships.organizationId, invitation.orgId)
      ),
    })

    if (!existingMembership) {
      await db.insert(memberships).values({
        userId: user.id,
        organizationId: invitation.orgId,
        role: "staff",
      })
    }

    const [updatedInvitation] = await db.update(invitations)
      .set({ status: "active" })
      .where(eq(invitations.id, invitation.id))
      .returning()

    return {
      invitation: updatedInvitation,
      orgId: invitation.orgId,
    }
  }, {
    errorMessage: "Erreur lors de l'acceptation de l'invitation",
  })
}
