import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateQuoteEmailHTML } from '@/lib/emailTemplates/quoteEmail'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { quote_id } = await req.json()
  if (!quote_id) return new Response('Missing quote_id', { status: 400 })

  const { data: quote, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) return new Response('Quote not found', { status: 404 })

  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/generateQuotePdf?quote_id=${quote.id}`
  const html = generateQuoteEmailHTML(quote, pdfUrl)

  try {
    const result = await resend.emails.send({
      from: 'Neo Invoice <noreply@neokatalyst.co.za>',
      to: [quote.client_email],
      subject: `Your Quote ${quote.reference || ''}`,
      html,
    })

    console.log('Resend email result:', result)

    if (!result?.data?.id) throw new Error('Failed to send email via Resend')

    // ✅ Update quote status after successful email
    const { error: updateError } = await supabaseAdmin
      .from('quotes')
      .update({ status: 'sent' })
      .eq('id', quote.id)

    if (updateError) {
      console.error('❌ Failed to update quote status:', updateError.message)
    } else {
      console.log(`✅ Quote ${quote.reference} status updated to 'sent'`)
    }

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    console.error('Email failed:', err)
    return new Response('Failed to send email', { status: 500 })
  }
}
