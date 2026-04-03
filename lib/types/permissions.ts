export type AppRole = "owner" | "admin" | "staff"

export type Permission =
  | "organization.delete"
  | "members.invite"
  | "members.role.update"
  | "members.role.assign_owner"
  | "clients.manage"
  | "products.manage"
  | "invoices.manage"
  | "cards.manage"
  | "reports.read"
