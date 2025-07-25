import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import puppeteer from 'puppeteer-core'
import { generateQuoteHTML } from '@/lib/pdfTemplates/quoteTemplate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const quote_id = searchParams.get('quote_id')

  if (!quote_id)
    return new Response('Missing quote_id', { status: 400 })

  const { data: quote, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', quote_id)
    .single()

  if (error || !quote)
    return new Response('Quote not found', { status: 404 })

  const html = generateQuoteHTML(quote)

  try {
const browser = await chromium.launch({
  args: ['--no-sandbox'],
  executablePath: chromium.executablePath(), // 👈 call the function
  headless: true,
});

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })

    const pdfBuffer = await page.pdf({ format: 'a4' })

    await browser.close()

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${quote.reference || 'quote'}.pdf"`
      }
    })
  } catch (err: any) {
    console.error('❌ PDF generation failed:', err)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
