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

  if (!quote_id) {
    return new Response('Missing quote_id', { status: 400 })
  }

  const { data: quote, error } = await supabaseAdmin
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote) {
    return new Response('Quote not found', { status: 404 })
  }

  const html = generateQuoteHTML(quote)

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  const pdfBuffer = await page.pdf({ format: 'a4' })
  await browser.close()

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=quote-${quote.reference || quote.id}.pdf`
    }
  })
}
