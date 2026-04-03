import { checkUserMembership, getCurrentOrg } from "@/actions/organizations/organisations";
import { getCurrentUser } from "@/actions/users/users";
import { OrgLayoutClient } from "@/components/layout/organization-layout-client";
import { OrgProvider } from "@/providers/organization-providers";
import { UserProvider } from "@/providers/user-provider";
import { redirect } from "next/navigation";

type Props = {
    children: React.ReactNode,
    params: Promise<{ orgId: string}>
}
export default async function OrganizationLayout({ children, params } : Props) {
    const { orgId } = await params

    const user = await getCurrentUser()
    if(!user) redirect("/auth/login")
    
    const membership = await checkUserMembership(user.id, orgId)
    if(!membership) redirect("/organization/onboarding")

    const org = await getCurrentOrg(orgId)
    if(!org) redirect("/organization/onboarding")

    return (
        <OrgProvider org={org}>
            <UserProvider user={user}>
                <OrgLayoutClient orgId={orgId} role={membership.role}>
                    {children}
                </OrgLayoutClient>
            </UserProvider>
        </OrgProvider>
    )
}
