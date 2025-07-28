export function generateConfirmEmailHTML(name: string, confirmationUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Hello ${name},</h2>
      <p>Thanks for signing up with <strong>Neo-Invoice</strong>.</p>
      <p>Please confirm your email address by clicking the button below:</p>
      <p>
        <a href="${confirmationUrl}" style="display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
          Confirm Email
        </a>
      </p>
      <p>If the button doesn't work, paste this URL into your browser:</p>
      <p style="color:#555;">${confirmationUrl}</p>
      <hr style="margin-top:40px;" />
      <p style="font-size:12px;color:#999;">
        This email was sent by Neo-Invoice • support@neokatalyst.co.za
      </p>
    </div>
  `
}
