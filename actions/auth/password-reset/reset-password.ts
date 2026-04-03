"use server"

import { db } from "@/drizzle/db/db"
import { passwordResetTokens, users } from "@/drizzle/schema"
import { and, eq, gt, isNull } from "drizzle-orm"
import { resetPasswordFormSchema, ResetPasswordFormType } from "@/lib/schemas/auth"
import { hashPassword } from "@/app/auth/_lib/hash-password"
import { hashResetToken } from "./utils"

export async function resetPassword(data: ResetPasswordFormType) {
  try {
    const parsed = resetPasswordFormSchema.parse(data)
    const tokenHash = hashResetToken(parsed.token)

    const tokenRow = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.tokenHash, tokenHash),
        isNull(passwordResetTokens.usedAt),
        gt(passwordResetTokens.expiresAt, new Date())
      ),
    })

    if (!tokenRow) {
      return {
        success: false,
        message: "Lien invalide ou expiré",
      } as const
    }

    const hashedPassword = await hashPassword(parsed.password)

    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, tokenRow.userId))

    await db.update(passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokens.id, tokenRow.id))

    return {
      success: true,
      data: { updated: true },
    } as const
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la réinitialisation"
    return {
      success: false,
      message,
    } as const
  }
}
