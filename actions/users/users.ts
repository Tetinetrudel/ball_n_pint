import { cookies } from "next/headers";
import { db } from "@/drizzle/db/db";
import { memberships, MembershipsWithUserAndOrg, MembershipWithUserAndOrg, sessions, users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const session = await db.query.sessions.findFirst({
    where: eq(sessions.token, token),
  });

  if (!session) return null;

  if (new Date(session.expiresAt) < new Date()) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  return user ?? null;
}

export async function getUserOrg(
  userId: string,
): Promise<MembershipWithUserAndOrg | null> {
  try {
    const userOrg = await db.query.memberships.findFirst({
      where: eq(memberships.userId, userId),
      with: { organization: true, user: true },
    });

    return userOrg ?? null
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getUserOrgs(
  userId: string,
): Promise<MembershipsWithUserAndOrg[] | null> {
  try {
    const userOrgs = await db.query.memberships.findMany({
      where: eq(memberships.userId, userId),
      with: { organization: true, user: true },
    });

    return userOrgs.length ? userOrgs : null
  } catch (error) {
    console.error(error);
    return [];
  }
}
