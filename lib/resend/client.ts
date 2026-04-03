type SendEmailInput = {
  to: string
  subject: string
  html: string
}

export async function sendEmailWithResend({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL

  if (!apiKey || !fromEmail) {
    throw new Error("Configuration Resend manquante")
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Erreur envoi email: ${body}`)
  }
}
