import { checkUserMembership, getCurrentOrg } from "@/actions/organizations/organisations";
import { getCurrentUser, getUserOrg } from "@/actions/users/users";
import { AppRole, assertPermission, Permission } from "@/lib/permissions";
import { ActionResult } from "@/lib/types/actions";
import { redirect } from "next/navigation"

export type { ActionResult } from "@/lib/types/actions"

export async function safeAction<T>(
  fn: () => Promise<T>,
  options?: { errorMessage?: string }
): Promise<ActionResult<T>> {
  try {
    const data = await fn()

    return {
      success: true,
      data, 
    }
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error
    }

    console.error(error)
    const message =
      error instanceof Error && error.message
        ? error.message
        : options?.errorMessage ?? "Une erreur est survenue"

    return {
      success: false,
      message,
    }
  }
}

export async function requireUserContext(orgId?: string) {
  const user = await getCurrentUser()
  if (!user) redirect("/auth/login")

  const userOrg = await getUserOrg(user.id)
  if (!userOrg) redirect("/organization/onboarding")

  const resolvedOrgId = orgId ?? userOrg.organizationId

  const org = await getCurrentOrg(resolvedOrgId)
  if (!org) redirect("/organization/onboarding")

  const member = await checkUserMembership(user.id, org.id)
  if(!member) redirect("/organization/onboarding")

  return {
    user,
    userOrg,
    org,
    member
  }
}

export async function requirePermission(permission: Permission, orgId?: string) {
  const context = await requireUserContext(orgId)
  assertPermission(context.member.role as AppRole, permission)
  return context
}
