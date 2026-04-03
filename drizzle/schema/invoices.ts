import { pgTable, uuid, numeric, integer, pgEnum, boolean, text } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { clients } from "./clients";
import { InferSelectModel, relations } from "drizzle-orm";
import { products } from "./products";
import { clientId, createdAt, id, organizationId, updatedAt } from "@/drizzle/drizzle-helpers";

export const InvoiceStatus = pgEnum("invoice_status", ["a_payer", "payee", "en_souffrance"]);
export type InvoiceStatusType = "a_payer" | "payee" | "en_souffrance";

export const invoices = pgTable("invoices", {
  id,
  invoiceNumber: text("invoice_number").notNull().unique(),
  organizationId,
  clientId,
  status: InvoiceStatus("status").default("a_payer"), 
  total: numeric("total", { precision: 10, scale: 2 }).default("0"),
  createdAt,
  updatedAt
});

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  organization: one(organizations, { fields: [invoices.organizationId], references: [organizations.id] }),
  client: one(clients, { fields: [invoices.clientId], references: [clients.id] }),
  items: many(invoiceItems),
}));

export const invoiceItems = pgTable("invoice_items", {
  id,
  invoiceId: uuid("invoice_id").notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  paid: boolean("paid").default(false),
  createdAt,
  updatedAt,
});

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, { 
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}))

export type InvoiceItem = InferSelectModel<typeof invoiceItems>
export type Invoice = InferSelectModel<typeof invoices>

export type InvoiceWithItems = Invoice & {
  organization?: { id: string; name: string };
  client?: { id: string; name: string };
  items?: InvoiceItemWithRelations[];
};

export type InvoiceItemWithRelations = InvoiceItem & {
  invoice?: { id: string; clientId: string };
  product?: { id: string; name: string; price: number };
};

export type InvoiceItemWithProduct = InvoiceItem & {
  product?: {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
  }
}