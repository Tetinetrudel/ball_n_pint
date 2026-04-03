import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";
import { organizations, OrganizationWithRelations } from "./organizations";
import { InferSelectModel, relations } from "drizzle-orm";
import { clientId, createdAt, id, memberId, organizationId, productId, updatedAt } from "@/drizzle/drizzle-helpers";
import { memberships } from "./auth";
import { products } from "./products";

export const clients = pgTable("clients", {
  id,
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt,
  updatedAt
});

export const clientRelations = relations(clients, ({ one }) => ({
  organization: one(organizations, { fields: [clients.organizationId], references: [organizations.id] }),
}));

export const clientNotes = pgTable("client_notes", {
  id,
  clientId,
  organizationId,
  notes: text("notes").notNull(),
  memberId,
  createdAt,
  updatedAt
})

export const clientNotesRelation = relations(clientNotes, ({ one, many }) => ({
  organization: one(organizations, { fields: [clientNotes.organizationId], references: [organizations.id] }),
  memberships: one(memberships, { fields: [clientNotes.memberId], references: [memberships.id] }),
  clients: many(clients)
}))

export const clientCards = pgTable("client_cards", {
  id,
  clientId,
  organizationId,
  memberId,
  createdAt, 
  updatedAt,
  productId,
  initialCount: integer("initial_count").default(10).notNull(),
  remainingCount: integer("remaining_count").default(10).notNull()
})

export const clientActivities = pgTable("client_activities", {
  id,
  clientId,
  organizationId,
  memberId,
  event: text("event").notNull(),
  message: text("message").notNull(),
  createdAt,
  updatedAt,
})

export const clientCardsRelation = relations(clientCards, ({ one, many }) => ({
  organization: one(organizations, { fields: [clientCards.organizationId], references: [organizations.id] }),
  memberships: one(memberships, { fields: [clientCards.memberId], references: [memberships.id] }),
  product: one(products, { fields: [clientCards.productId], references: [products.id] }),
  clients: many(clients),
}));

export const clientActivitiesRelation = relations(clientActivities, ({ one }) => ({
  organization: one(organizations, { fields: [clientActivities.organizationId], references: [organizations.id] }),
  memberships: one(memberships, { fields: [clientActivities.memberId], references: [memberships.id] }),
  client: one(clients, { fields: [clientActivities.clientId], references: [clients.id] }),
}))

export type Client = InferSelectModel<typeof clients>
export type ClientNotes = InferSelectModel<typeof clientNotes>
export type ClientCards = InferSelectModel<typeof clientCards>
export type ClientActivity = InferSelectModel<typeof clientActivities>
export type ClientActivityWithRelations = ClientActivity & {
  memberships?: {
    id: string
    userId: string
    organizationId: string
    role: "owner" | "admin" | "staff"
    user?: {
      id: string
      name: string
      email: string
    }
  }
}

export type ClientWithRelations = Client & {
  organization?: OrganizationWithRelations;
  clientNotes?: ClientNotes;
  clientCards?: ClientCards;
  clientActivities?: ClientActivity[];
};
