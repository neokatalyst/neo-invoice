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
  const quote_id = searchParams.get('quote_id') ?? undefined

  if (!quote_id) {
    console.error('❌ Missing quote_id')
    return new Response('Missing quote_id', { status: 400 })
  }

  const { data: quote, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  console.log('Quote lookup:', { quote_id, quote, error })

  if (error || !quote) return new Response('Quote not found', { status: 404 })

  let logoUrl: string | null = null
  const logoPath = typeof quote.logo_url === 'string' && quote.logo_url.trim() !== '' 
    ? quote.logo_url 
    : undefined

  if (logoPath) {
    const { data: signed, error: signedError } = await supabaseAdmin
      .storage.from('logos')
      .createSignedUrl(logoPath, 60 * 60 * 24 * 7)

    if (signedError) console.error('❌ Signed URL Error:', signedError.message)

    logoUrl = signed?.signedUrl ?? null
  }

  const html = generateQuoteHTML(quote, logoUrl ?? undefined)

  try {
    const browser = await chromium.launch()
    const page = await browser.newPage()
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
    console.error('❌ PDF Generation Error:', err)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
