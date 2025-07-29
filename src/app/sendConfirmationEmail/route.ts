import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const { email, first_name, last_name, password } = await req.json()

  if (!email || !first_name || !last_name || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Step 1: Generate sign-up link (don't send email)
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        first_name,
        last_name,
        role: 'admin',
        organisation_id: 'temp-org',
      },
    },
  })

  if (error || !data?.properties?.action_link) {
    console.error('❌ Link generation error:', error)
    return NextResponse.json({ error: 'Failed to generate signup link' }, { status: 500 })
  }

  const signupLink = data.properties.action_link

  // Step 2: Send the email via Resend
  try {
    await resend.emails.send({
      from: 'Neo-Invoice <no-reply@neokatalyst.co.za>',
      to: [email],
      subject: 'Confirm your email to join Neo-Invoice',
      html: `
        <p>Hi ${first_name},</p>
        <p>Thanks for signing up. Click below to confirm your email and complete your account setup:</p>
        <p><a href="${signupLink}" target="_blank">Confirm Email</a></p>
        <p>If you did not sign up, you can safely ignore this message.</p>
        <p>– Neo-Invoice Team</p>
      `,
    })

    return NextResponse.json({ message: 'Signup email sent via Resend' }, { status: 200 })
  } catch (emailError: any) {
    console.error('❌ Email send error:', emailError)
    return NextResponse.json({ error: 'Failed to send confirmation email' }, { status: 500 })
  }
}
