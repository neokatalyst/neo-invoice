import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendConfirmationEmail } from '@/lib/email/sendConfirmationEmail'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { email, first_name, last_name, password } = await req.json()

  if (!email || !first_name || !last_name || !password) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // 🔑 Step 1: Generate signup link from Supabase
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      data: {
        first_name,
        last_name,
        role: 'admin',
        organisation_id: 'temp-org',
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    }
  })

  if (error || !data?.properties?.action_link) {
    console.error('Link generation error:', error)
    return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
  }

  // 📧 Step 2: Send email using Resend
  try {
    await sendConfirmationEmail({
      email,
      name: `${first_name} ${last_name}`,
      confirmationUrl: data.properties.action_link
    })

    return NextResponse.json({ message: 'Email sent' }, { status: 200 })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
