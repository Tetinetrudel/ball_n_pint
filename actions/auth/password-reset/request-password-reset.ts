"use server"

import { db } from "@/drizzle/db/db"
import { passwordResetTokens, users } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { forgotPasswordFormSchema, ForgotPasswordFormType } from "@/lib/schemas/auth"
import { sendEmailWithResend } from "@/lib/resend/client"
import { passwordResetEmailTemplate } from "@/lib/resend/templates/password-reset"
import { buildResetUrl, generateRawToken, hashResetToken } from "./utils"

export async function requestPasswordReset(data: ForgotPasswordFormType) {
  try {
    const parsed = forgotPasswordFormSchema.parse(data)
    const user = await db.query.users.findFirst({
      where: eq(users.email, parsed.email),
    })

    // Toujours retourner succès pour ne pas divulguer si l'email existe.
    if (!user) {
      return {
        success: true,
        data: { sent: true },
      } as const
    }

    const rawToken = generateRawToken()
    const tokenHash = hashResetToken(rawToken)

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    await db.insert(passwordResetTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt,
    })

    const resetUrl = buildResetUrl(rawToken)
    await sendEmailWithResend({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: passwordResetEmailTemplate(resetUrl),
    })

    return {
      success: true,
      data: { sent: true },
    } as const
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de l'envoi du courriel"
    return {
      success: false,
      message,
    } as const
  }
}
