import { Client, ClientNotes, ClientWithRelations, MembershipWithUser } from "@/drizzle/schema"

export type CreateClientInput = Pick<Client, "name" | "email">

export type UpdateClientInput = Pick<Client, "id" | "name" | "email">

export type AddNotesInput = Pick<ClientNotes, "notes">

export type UpdateNoteInput = {
  notes: string
  noteId: string
}

export type ClientNote = {
  id: string
  clientId: string
  organizationId: string
  notes: string
  createdAt: Date
  updatedAt: Date
  memberships: MembershipWithUser
}

export type ClientNotesDisplayProps = {
  notes: ClientNote[]
  client: ClientWithRelations
}

export type AddNotesFormProps = {
  client: Client
}

export type UpdateClientFormProps = {
  client: Client
  onSuccess?: () => void
}

export type ClientTabProps = {
  clientId: string
}

export type ClientRouteParams = Promise<{ clientId: string; orgId: string }>

export type ClientRouteParamsProps = {
  params: ClientRouteParams
}

export type ActivityItem = {
  id: string
  event: string
  message: string
  createdAt: Date
  memberships?: {
    user?: {
      name: string
    }
  }
}

export type ActivityFilterKey = "all" | "invoice" | "note" | "card" | "client"

export type ActivitiesTimelineProps = {
  activities: ActivityItem[]
}
