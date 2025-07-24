// src/lib/generateInvoiceEmailHTML.ts
import type { Invoice } from '@/types/invoice'   // see step 2

export function generateInvoiceEmailHTML(
  invoice: Invoice,
  pdfUrl: string
): string {
  const reference = invoice.reference || invoice.id
  const total     = (invoice.total ?? 0).toFixed(2)
  const client    = invoice.client_name || 'Customer'

  return `
    <div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;">
      <h1 style="background:#1d4ed8;color:#fff;padding:20px;text-align:center;">
        Your Invoice
      </h1>
      <p>Hi ${client},</p>
      <p>Thank you for your business.  Your invoice is below.</p>
      <p><strong>Reference:</strong> ${reference}</p>
      <p><strong>Total:</strong> R ${total}</p>
      <div style="margin:20px 0;text-align:center;">
        <a href="${pdfUrl}"
           style="background:#1d4ed8;color:#fff;padding:15px 25px;
                  text-decoration:none;border-radius:5px;">
          View Invoice PDF
        </a>
      </div>
      <p>If you have any questions, just reply to this e-mail.</p>
      <p>Kind regards,<br/>Neo Invoice Team</p>
      <hr style="margin-top:40px;" />
      <p style="font-size:12px;color:grey;text-align:center;">
        Sent via Neo Invoice.
      </p>
    </div>
  `
}
