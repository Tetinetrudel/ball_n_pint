import { AppRole } from "@/lib/types/permissions"

export type SidebarProps = {
  collapsed: boolean
  toggle: () => void
  orgId: string
  role: AppRole
}

export type OrgLayoutClientProps = {
  children: React.ReactNode
  orgId: string
  role: AppRole
}
