export type OrganizationLayoutProps = {
  children: React.ReactNode
  params: Promise<{ orgId: string }>
}

export type ClientPageProps = {
  params: Promise<{
    orgId: string
    clientId: string
  }>
}
