import { InvitationWithOrg, MembershipsWithUserAndOrg } from "@/drizzle/schema"
import { AppRole } from "@/lib/types/permissions"

export type OrganizationEmployee = {
  membershipId: string
  userId: string
  name: string
  email: string
  role: AppRole
  createdAt: Date
  lastLoginAt: Date | null
}

export type FollowOrgCardProps = {
  invitation: InvitationWithOrg | null
  userOrg: MembershipsWithUserAndOrg[] | null
}

export type EmployeeTableMeta = {
  currentUserRole: AppRole
  currentUserId: string
  orgOwnerId: string
}

export type EmployeeDataTableProps = {
  employees: OrganizationEmployee[]
  currentUserRole: AppRole
  currentUserId: string
  orgOwnerId: string
}
