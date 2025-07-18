import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { quote_id } = await req.json()

  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 })

  const acceptLink = `${process.env.BASE_URL}/quote/respond?quote_id=${quote.id}&action=accept`

  const emailResponse = await resend.emails.send({
    from: 'your@domain.com',
    to: quote.client_email,
    subject: `Quote from ${quote.client_name}`,
    html: `
      <p>Hi ${quote.client_name},</p>
      <p>Please review your quote. Total: R${quote.total}</p>
      <p><a href="${acceptLink}">Accept this quote</a></p>
    `,
  })

  if (emailResponse.error) return NextResponse.json({ error: emailResponse.error }, { status: 500 })

  return NextResponse.json({ message: 'Quote email sent!' })
}
