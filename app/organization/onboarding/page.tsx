import { getInvitationForUser } from "@/actions/organizations/organisations";
import { getCurrentUser, getUserOrgs } from "@/actions/users/users";
import { CreateOrgCard } from "@/components/organization/create-org-card";
import { FollowOrgCard } from "@/components/organization/follow-organiation";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Vous devez vous connecter</div>;
  }

  const invitation = await getInvitationForUser(user.email)
  const userOrgs = await getUserOrgs(user.id)
  
  return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <h1>Bienvenue sur Ball'N'Pint</h1>
      <div className="grid grid-cols-2 gap-6 place-content-center">
        <CreateOrgCard />
        <FollowOrgCard userOrg={userOrgs} invitation={invitation}/>
      </div>
    </div>
  )
}