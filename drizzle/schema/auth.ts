import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { InferModel } from "drizzle-orm";
import { Organization, organizations } from "./organizations";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password_hash").notNull(),
  imageUrl: text("imageUrl")
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  memberships: many(memberships),
  passwordResetTokens: many(passwordResetTokens),
}));

export type User = InferModel<typeof users, "select">;
export type UserWithRelations = User & {
  sessions?: Session[];
  memberships?: MembershipWithUser[];
};

export const MembershipRoles = pgEnum("membership_roles", ["owner", "admin", "staff"]);

export const memberships = pgTable("memberships", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  organizationId: uuid("organization_id").notNull(),
  role: MembershipRoles("role").notNull().default("staff"),
});

export const membershipRelations = relations(memberships, ({ one }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  organization: one(organizations, { fields: [memberships.organizationId], references: [organizations.id] }),
}));

export type MembershipWithUser = {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const passwordResetTokenRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export type Membership = {
    id: string;
    userId: string;
    organizationId: string;
    role: string
};

export type Session = {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
};

export type MembershipWithUserAndOrg = Membership & {
  user?: User
  organization?: Organization;
};

export type MembershipsWithUserAndOrg = {
  id: string
  userId: string
  organizationId: string
  role: "owner" | "admin" | "staff"
  user: {
    id: string
    name: string
    email: string
    password: string
    imageUrl: string | null
  }
  organization: {
    id: string
    name: string
    ownerId: string
  }
}
