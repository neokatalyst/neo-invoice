import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateQuoteHTML } from '@/lib/pdfTemplates/quoteTemplate'
import { chromium } from 'playwright'

export const runtime = 'nodejs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const quote_id = searchParams.get('quote_id')

  if (!quote_id) return new Response('Missing quote_id', { status: 400 })

  const { data: quote, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) return new Response('Quote not found', { status: 404 })

  let logoUrl: string | null = null

  // Step 1: Check quote logo, else fallback to profile logo
  const quoteLogo = quote.logo_url?.trim() || null

  if (quoteLogo) {
    const { data: signed, error: signedError } = await supabaseAdmin
      .storage.from('logos')
      .createSignedUrl(quoteLogo, 60 * 60 * 24 * 7)

    if (signedError) console.warn('Signed URL error (quote logo):', signedError.message)
    logoUrl = signed?.signedUrl ?? null
  } else {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('logo_url')
      .eq('id', quote.user_id)
      .single()

    if (!profileError && profile?.logo_url) {
      const { data: signed } = await supabaseAdmin
        .storage.from('logos')
        .createSignedUrl(profile.logo_url, 60 * 60 * 24 * 7)
      logoUrl = signed?.signedUrl ?? null
    }
  }

  // Step 2: Generate HTML
  const html = generateQuoteHTML(quote, logoUrl ?? undefined)

  try {
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="quote-${quote.reference || quote_id}.pdf"`
      }
    })
  } catch (err) {
    console.error('PDF generation failed:', err)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
