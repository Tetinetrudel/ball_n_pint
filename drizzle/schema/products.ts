import { pgTable, uuid, text, numeric, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { InferSelectModel, relations } from "drizzle-orm";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  imageUrl: text("image_url"),
  favorite: boolean().default(false).notNull(),
  categoryId: uuid("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  organizationId: uuid("organization_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const productRelations = relations(products, ({ one }) => ({
  organization: one(organizations, {
    fields: [products.organizationId],
    references: [organizations.id],
  }),

  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [categories.organizationId],
    references: [organizations.id],
  }),

  products: many(products),
}));

export type Product = InferSelectModel<typeof products>
export type Category = InferSelectModel<typeof categories>

export type ProductWithRelations = Product & {
  organization?: { id: string; name: string };
  category?: { id: string; name: string}
};