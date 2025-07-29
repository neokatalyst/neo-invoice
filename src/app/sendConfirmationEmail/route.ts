import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // ✅ server-side uses redirectTo
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

  return NextResponse.json({ message: 'Signup email sent by Supabase' }, { status: 200 })
}
