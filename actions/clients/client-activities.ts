"use server"

import { db } from "@/drizzle/db/db"
import { clientActivities } from "@/drizzle/schema"

type CreateClientActivityInput = {
  clientId: string
  organizationId: string
  memberId: string
  event: string
  message: string
}

export async function createClientActivity(input: CreateClientActivityInput) {
  try {
    await db.insert(clientActivities).values({
      clientId: input.clientId,
      organizationId: input.organizationId,
      memberId: input.memberId,
      event: input.event,
      message: input.message,
    })
  } catch (error) {
    console.error("Erreur createClientActivity:", error)
  }
}
