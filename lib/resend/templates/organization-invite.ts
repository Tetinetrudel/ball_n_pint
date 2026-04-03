export function organizationInviteEmailTemplate(params: {
  organizationName: string
  signupUrl: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Invitation Ball'N'Pint</h2>
      <p>Vous êtes invité à rejoindre l'organisation <b>${params.organizationName}</b>.</p>
      <p>Créez votre compte puis acceptez l'invitation dans l'onboarding.</p>
      <p>
        <a href="${params.signupUrl}" style="display:inline-block;padding:10px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;">
          Créer mon compte
        </a>
      </p>
      <p>Si vous avez déjà un compte, connectez-vous avec cet email pour voir l'invitation.</p>
    </div>
  `
}
