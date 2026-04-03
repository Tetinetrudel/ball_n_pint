export function passwordResetEmailTemplate(url: string) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Réinitialisation du mot de passe</h2>
      <p>Vous avez demandé de réinitialiser votre mot de passe.</p>
      <p>Ce lien est valide pendant 1 heure.</p>
      <p>
        <a href="${url}" style="display:inline-block;padding:10px 16px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;">
          Réinitialiser le mot de passe
        </a>
      </p>
      <p>Si vous n'avez pas fait cette demande, vous pouvez ignorer ce courriel.</p>
    </div>
  `
}
