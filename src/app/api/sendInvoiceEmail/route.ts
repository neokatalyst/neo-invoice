import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to, subject, html })
      return new Response('Missing required fields', { status: 400 })
    }

    const result = await resend.emails.send({
      from: 'Neo Invoice <invoices@neokatalyst.co.za>',
      to,
      subject,
      html,
    })

    console.log('Resend raw result:', JSON.stringify(result, null, 2))

    if (result.error) {
      console.error('Resend error:', result.error.message)
      return new Response(`Email sending failed: ${result.error.message}`, { status: 500 })
    }

    return NextResponse.json({ message: 'Email sent successfully', result })
  } catch (err) {
    console.error('Email failed:', err)
    return new Response('Failed to send email', { status: 500 })
  }
}
