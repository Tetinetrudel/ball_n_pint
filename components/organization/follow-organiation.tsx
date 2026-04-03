"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { InvitationWithOrg, MembershipsWithUserAndOrg } from "@/drizzle/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@/hooks/use-mutations";
import { acceptOrgInvitation } from "@/actions/organizations/organisations";
import { LoadingSwap } from "../ui/loading-swap";

type Props = {
  invitation: InvitationWithOrg | null;
  userOrg: MembershipsWithUserAndOrg[] | null;
};

export function FollowOrgCard({ invitation, userOrg }: Props) {
  const router = useRouter();

  const hasMemberships = (userOrg ?? []).length > 0;
  const hasInvitation = !!invitation;

  const { mutate: acceptInvitation, isLoading } = useMutation(acceptOrgInvitation, {
    successMessage: "Invitation acceptée",
    onSuccess: (result) => {
      router.push(`/organization/${result.orgId}/dashboard`)
    },
  })

  if (hasInvitation) {
    return (
      <Card
        className="w-50 h-50 cursor-pointer hover:shadow-lg hover:border-primary border transition-shadow flex flex-col items-center justify-center"
      >
        <CardContent className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Building2 className="text-muted-foreground" size={20} />
          </div>
          <h3>
            Rejoindre {invitation?.organization?.name ?? "Organisation inconnue"}
          </h3>
          <button
            className="text-sm underline"
            onClick={() => invitation?.id && acceptInvitation(invitation.id)}
            disabled={isLoading}
          >
            <LoadingSwap isLoading={isLoading}>Accepter l'invitation</LoadingSwap>
          </button>
        </CardContent>
      </Card>
    );
  }

  if (hasMemberships) {
    return (
      <Card className="w-50 h-50 cursor-pointer hover:shadow-lg hover:border-primary border transition-shadow flex flex-col items-center justify-center p-2">
        <CardContent className="flex flex-col items-center text-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Building2 className="text-muted-foreground" size={20} />
          </div>
          <Select
            onValueChange={(val) => router.push(`/organization/${val}/dashboard`)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Sélectionnez une organisation" />
            </SelectTrigger>

            <SelectContent>
              {(userOrg ?? [])
                .filter((membership) => membership.organization?.id) // 🔥 filtre les invalides
                .map((membership) => (
                  <SelectItem
                    key={membership.organization!.id}
                    value={membership.organization!.id} // ✅ jamais vide
                  >
                    {membership.organization!.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="w-50 h-50 cursor-pointer hover:shadow-lg hover:border-primary border transition-shadow flex flex-col items-center justify-center"
    >
      <CardContent className="flex flex-col items-center text-center gap-2">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Building2 className="text-muted-foreground" size={20} />
        </div>
        <h3>Demander d'être invité à une organisation</h3>
      </CardContent>
    </Card>
  );
}
