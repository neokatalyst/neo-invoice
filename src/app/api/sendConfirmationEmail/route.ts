import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail } from '@/lib/email/sendConfirmationEmail'
import { supabaseAdmin } from '@/lib/supabaseAdmin'



export async function POST(req: NextRequest) {
  const { email, password, first_name, last_name } = await req.json()

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password, 
    options: {
      data: {
        first_name,
        last_name,
        role: 'admin',
        organisation_id: 'temp-org'
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`.replace(/([^:]\/)\/+/g, '$1'),
    }
  })

  if (error || !data?.properties?.action_link) {
    console.error('Link generation error:', error)
    return NextResponse.json({ error: 'Failed to generate confirmation link' }, { status: 500 })
  }

  const confirmationUrl = data.properties.action_link

  try {
    await sendConfirmationEmail({
      email,
      name: `${first_name} ${last_name}`,
      confirmationUrl,
    })

    return NextResponse.json({ message: 'Confirmation email sent' }, { status: 200 })
  } catch (err) {
    console.error('Email send error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}