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

const PERMISSIONS_BY_ROLE: Record<AppRole, Set<Permission>> = {
  owner: new Set<Permission>([
    "organization.delete",
    "members.invite",
    "members.role.update",
    "members.role.assign_owner",
    "clients.manage",
    "products.manage",
    "invoices.manage",
    "cards.manage",
    "reports.read",
  ]),
  admin: new Set<Permission>([
    "members.invite",
    "members.role.update",
    "clients.manage",
    "products.manage",
    "invoices.manage",
    "cards.manage",
    "reports.read",
  ]),
  staff: new Set<Permission>([
    "clients.manage",
    "invoices.manage",
    "cards.manage",
    "reports.read",
  ]),
}

export function hasPermission(role: AppRole, permission: Permission) {
  return PERMISSIONS_BY_ROLE[role].has(permission)
}

export function assertPermission(role: AppRole, permission: Permission) {
  if (!hasPermission(role, permission)) {
    throw new Error("Permission insuffisante")
  }
}

export function canAssignRole(actorRole: AppRole, nextRole: AppRole) {
  if (actorRole === "owner") return true
  if (actorRole === "admin") return nextRole !== "owner"
  return false
}
