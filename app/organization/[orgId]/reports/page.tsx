import { requireUserContext } from "@/lib/helpers"
import { AppRole, hasPermission } from "@/lib/permissions"
import { redirect } from "next/navigation"

export default async function ReportsPage() {
  const { member, org } = await requireUserContext()

  if (!hasPermission(member.role as AppRole, "reports.read")) {
    redirect(`/organization/${org.id}/dashboard`)
  }

  return <h1>rapports</h1>
}
