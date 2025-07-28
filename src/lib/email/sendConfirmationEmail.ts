import { Resend } from 'resend'
import { generateConfirmEmailHTML } from './templates/confirmEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail({
  email,
  name,
  confirmationUrl,
}: {
  email: string
  name: string
  confirmationUrl: string
}) {
  const html = generateConfirmEmailHTML(name, confirmationUrl)

  const { error } = await resend.emails.send({
    from: 'Neo-Invoice <support@neokatalyst.co.za>',
    to: email,
    subject: 'Confirm your Neo-Invoice account',
    html,
  })

  if (error) {
    console.error('Resend email error:', error)
    throw new Error('Failed to send confirmation email.')
  }
}
