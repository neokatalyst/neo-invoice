import { Quote } from '@/lib/pdfTemplates/types'

export function generateQuoteEmailHTML(quote: Quote, pdfUrl: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="background-color: #1d4ed8; color: white; padding: 20px; text-align: center;">Your Quote</h1>
      <p>Hi ${quote.client_name},</p>
      <p>Thank you for your interest. Please find your quote below.</p>
      <p><strong>Reference:</strong> ${quote.reference || 'N/A'}</p>
      <p><strong>Total:</strong> R ${quote.total?.toFixed(2)}</p>
      <div style="margin: 20px 0; text-align: center;">
        <a href="${pdfUrl}" style="background-color: #1d4ed8; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px;">View Quote PDF</a>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br/>Neo Invoice Team</p>
      <hr style="margin-top: 40px;" />
      <p style="font-size: 12px; color: gray; text-align: center;">This quote was sent via Neo Invoice.</p>
    </div>
  `
}
