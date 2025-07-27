import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateInvoiceEmailHTML } from '@/lib/emailTemplates/invoiceEmail'
import type { Invoice } from '@/types/invoice'

export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { invoice_id } = await req.json()

    if (!invoice_id) {
      return new Response('Missing invoice_id', { status: 400 })
    }

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', invoice_id)
      .single()

    if (error || !invoice) {
      console.error('Invoice fetch error:', error)
      return new Response('Invoice not found', { status: 404 })
    }

    if (!invoice.client_email) {
      console.error('Missing client_email in invoice:', invoice.id)
      return new Response('Missing client_email in invoice', { status: 400 })
    }

    const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/view-invoice-pdf?invoice_id=${invoice_id}`
    const html = generateInvoiceEmailHTML(invoice as Invoice, pdfUrl)

    const from = process.env.RESEND_FROM_EMAIL || 'noreply@neokatalyst.co.za'

    console.log('Sending invoice email:', {
      to: invoice.client_email,
      from,
      subject: `Invoice ${invoice.reference ?? ''} from Neo Invoice`,
      pdfUrl,
    })

    const { data, error: sendError } = await resend.emails.send({
      to: invoice.client_email,
      from,
      subject: `Invoice ${invoice.reference ?? ''} from Neo Invoice`,
      html,
    })

    if (sendError) {
      console.error('Resend error:', sendError)
      return new Response(JSON.stringify({ error: sendError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return Response.json({ success: true, message: 'Email sent', data })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return new Response('Server error', { status: 500 })
  }
}
