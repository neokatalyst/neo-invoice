// src/app/api/verifyCaptcha/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ success: false, message: 'Missing CAPTCHA token' }, { status: 400 })
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  const ip = req.headers.get('x-forwarded-for') || '' // optional

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secret ?? '',
        response: token,
        remoteip: ip
      }),
    })

    const data = await response.json()

    if (!data.success) {
      return NextResponse.json({ success: false, message: 'CAPTCHA failed', ...data }, { status: 403 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('CAPTCHA verification error:', err)
    return NextResponse.json({ success: false, message: 'Server error verifying CAPTCHA' }, { status: 500 })
  }
}
