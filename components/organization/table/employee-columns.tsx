"use client"

import { updateMemberRole, type OrganizationEmployee } from "@/actions/organizations/organisations"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppRole } from "@/lib/permissions"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Edit, MoreHorizontal } from "lucide-react"
import { useMutation } from "@/hooks/use-mutations"
import { EmployeeTableMeta } from "./employee-data-table"

const roleLabel: Record<AppRole, string> = {
  owner: "Owner",
  admin: "Admin",
  staff: "Staff",
}

export const employeeColumns: ColumnDef<OrganizationEmployee>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "Courriel",
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => roleLabel[row.original.role],
  },
  {
    accessorKey: "createdAt",
    header: "Créé le",
    cell: ({ row }) => format(new Date(row.original.createdAt), "dd MMM yyyy", { locale: fr }),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Dernière connexion",
    cell: ({ row }) =>
      row.original.lastLoginAt
        ? format(new Date(row.original.lastLoginAt), "dd MMM yyyy HH:mm", { locale: fr })
        : "Jamais connecté",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row, table }) => {
      const employee = row.original
      const meta = table.options.meta as EmployeeTableMeta | undefined
      const currentUserRole = meta?.currentUserRole ?? "staff"
      const currentUserId = meta?.currentUserId
      const orgOwnerId = meta?.orgOwnerId

      const isCurrentUser = currentUserId === employee.userId
      const isOrgOwner = employee.userId === orgOwnerId
      const canEditRole = !(employee.role === "owner" && currentUserRole === "admin")
      const roleOptions: AppRole[] = isOrgOwner ? ["owner"] : ["admin", "staff"]

      const { mutate: updateRole, isLoading } = useMutation(updateMemberRole, {
        successMessage: "Rôle mis à jour",
      })

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isLoading || !canEditRole}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {roleOptions.map((role) => (
              <DropdownMenuItem
                key={role}
                disabled={
                  isLoading ||
                  !canEditRole ||
                  (isCurrentUser && employee.role === "owner" && role !== "owner")
                }
                onClick={() => updateRole({ membershipId: employee.membershipId, role })}
              >
                <Edit className="mr-2 h-4 w-4" />
                Mettre {roleLabel[role]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
