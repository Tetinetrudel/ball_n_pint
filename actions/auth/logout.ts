"use server";

import { cookies } from "next/headers";
import { db } from "@/drizzle/db/db";
import { sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  cookieStore.delete("session");

  return { success: true };
}