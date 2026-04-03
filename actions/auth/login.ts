"use server";

import { db } from "@/drizzle/db/db";
import { users, sessions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "@/app/auth/_lib/verify-password";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function login(data: { email: string; password: string }) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      return { success: false, message: "Email ou mot de passe invalide" };
    }

    const isValid = await verifyPassword(data.password, user.password);

    if (!isValid) {
      return { success: false, message: "Email ou mot de passe invalide" };
    }

    const token = crypto.randomUUID();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await db.insert(sessions).values({
      userId: user.id,
      token,
      expiresAt,
    });

    const cookieStore = await cookies();

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return { success: true, message: "Connexion réussie !" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur lors du login"
    return {
      success: false,
      message,
    };
  }
}
