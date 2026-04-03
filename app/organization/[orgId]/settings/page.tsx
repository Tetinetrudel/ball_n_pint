import { InviteMembersForm } from "@/components/organization/forms/invite-members-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUserContext } from "@/lib/helpers";
import { AppRole, hasPermission } from "@/lib/permissions";

export default async function SettingsPage() {
  const { member } = await requireUserContext()

  if (!hasPermission(member.role as AppRole, "members.invite")) {
    return <main className="max-w-3xl p-6" />
  }

  return (
    <main className="max-w-3xl p-6">
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
    </main>
  )
}
