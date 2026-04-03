import { getOrganizationEmployees } from "@/actions/organizations/organisations"
import { InviteMembersForm } from "@/components/organization/forms/invite-members-form"
import { EmployeeDataTable } from "@/components/organization/table/employee-data-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUserContext } from "@/lib/helpers"
import { AppRole, hasPermission } from "@/lib/permissions"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const { member, org, user } = await requireUserContext()

  if (!hasPermission(member.role as AppRole, "members.invite")) {
    redirect(`/organization/${org.id}/dashboard`)
  }

  const employeesResult = await getOrganizationEmployees()
  const employees = employeesResult.success ? employeesResult.data : []

  return (
    <main className="max-w-full p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil général de l'organisation</CardTitle>
          <CardDescription>Informations générales de votre organisation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <span className="text-muted-foreground">Nom: </span>
            {org.name}
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">ID: </span>
            {org.id}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inviter des membres</CardTitle>
          <CardDescription>
            Invitez des employés à rejoindre votre organisation avec le rôle staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InviteMembersForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <EmployeeDataTable
            employees={employees}
            currentUserRole={member.role as AppRole}
            currentUserId={user.id}
            orgOwnerId={org.ownerId}
          />
        </CardContent>
      </Card>
    </main>
  )
}
