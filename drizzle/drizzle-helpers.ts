import { timestamp, uuid } from "drizzle-orm/pg-core"

export const id = uuid().primaryKey().defaultRandom()
export const createdAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
export const updatedAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date())
export const organizationId =  uuid("organization_id").notNull()
export const memberId = uuid("member_id").notNull()
export const clientId = uuid("client_id").notNull()
export const productId = uuid("product_id").notNull()

