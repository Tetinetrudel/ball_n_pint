"use server";

import { hashPassword } from "@/app/auth/_lib/hash-password";
import { db } from "@/drizzle/db/db";
import { sessions, users } from "@/drizzle/schema";
import { signUpFormSchema, SignUpFormType } from "@/lib/schemas/auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function signUp(data: SignUpFormType) {
  try {
    const parsed = signUpFormSchema.parse(data);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, parsed.email)
    })

    if(existingUser) {
      return {
        success: false,
        message: "Cet email est déjà utilisé"
      }
    }

    const hashedPassword = await hashPassword(parsed.password)

    const [newUser] = await db.insert(users).values({ 
      name: parsed.name,
      email: parsed.email,
      password: hashedPassword,
      imageUrl: null
    }).returning()

    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await db.insert(sessions).values({
      userId: newUser.id,
      token,
      expiresAt,
    })

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return { success: true, message: "Utilisateur créé avec succès !", newUser };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Une erreur est survenue"
    return { success: false, message };
  }
}
