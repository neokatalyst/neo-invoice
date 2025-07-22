import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateInvoiceEmailHTML } from '@/lib/emailTemplates/invoiceEmail'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { invoice_id } = await req.json()
  if (!invoice_id) return new Response('Missing invoice_id', { status: 400 })

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) return new Response('Invoice not found', { status: 404 })

  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/generateInvoicePdf?invoice_id=${invoice.id}`
  const html = generateInvoiceEmailHTML(invoice, pdfUrl)

  try {
    const result = await resend.emails.send({
      from: 'Neo Invoice <noreply@neokatalyst.co.za>',
      to: [invoice.client_email],
      subject: `Your Invoice ${invoice.reference || ''}`,
      html,
    })

    console.log('Resend email result:', result)

    if (!result?.data?.id) throw new Error('Failed to send email via Resend')

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    console.error('Email failed:', err)
    return new Response('Failed to send email', { status: 500 })
     console.log('Resend raw result:', JSON.stringify(result, null, 2))
    if (result.error) console.error('Resend error:', result.error.message)
    
  }
}
