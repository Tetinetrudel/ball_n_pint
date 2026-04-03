import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { products, ProductWithRelations } from "./products";
import { clients, ClientWithRelations } from "./clients";
import { invoices, InvoiceWithItems } from "./invoices";
import { InferModel, relations } from "drizzle-orm";
import { memberships, MembershipWithUser, users } from "./auth";

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: uuid("owner_id").notNull(),
});

export const organizationRelations = relations(organizations, ({ many }) => ({
  members: many(memberships),
  products: many(products),
  clients: many(clients),
  invoices: many(invoices),
}));

export type Organization = {
  id: string;
  name: string;
  ownerId: string;
};

export type OrganizationWithRelations = Organization & {
  members?: MembershipWithUser[];
  products?: ProductWithRelations[];
  clients?: ClientWithRelations[];
  invoices?: InvoiceWithItems[];
};

export const InvitationStatus = pgEnum("invitation_status", ["pending", "active", "declined"]);

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userEmail: text("user_email").notNull(),
  orgId: uuid("organization_id").notNull(),
  status: InvitationStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitationRelations = relations(invitations, ({ one }) => ({
  user: one(users, { fields: [invitations.userEmail], references: [users.email] }),
  organization: one(organizations, { fields: [invitations.orgId], references: [organizations.id] }),
}));

export type Invitation = InferModel<typeof invitations>;
export type NewInvitation = InferModel<typeof invitations, "insert">;
export type InvitationWithOrg = Invitation & {
  organization: Organization;
};