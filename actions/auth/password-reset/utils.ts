import crypto from "crypto"

export function buildResetUrl(token: string) {
  const baseUrl = process.env.APP_URL || "http://localhost:3000"
  return `${baseUrl}/auth/reset-password?token=${encodeURIComponent(token)}`
}

export function generateRawToken() {
  return crypto.randomBytes(32).toString("hex")
}

export function hashResetToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex")
}
