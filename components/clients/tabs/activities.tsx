import { getClientActivities } from "@/actions/clients/clients"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivitiesTimeline } from "@/components/clients/ui/activities-timeline"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ clientId: string; orgId: string }>
}

export async function Activities({ params }: Props) {
  const { clientId, orgId } = await params

  if (!clientId) {
    redirect(`/organization/${orgId}/clients`)
  }

  const result = await getClientActivities(clientId, orgId)

  if (!result.success) {
    return <p>{result.message}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activités</CardTitle>
        <CardDescription>Historique des actions réalisées sur ce client</CardDescription>
      </CardHeader>
      <CardContent>
        <ActivitiesTimeline activities={result.data} />
      </CardContent>
    </Card>
  )
}
