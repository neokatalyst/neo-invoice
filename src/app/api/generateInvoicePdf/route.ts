import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

export const runtime = 'nodejs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get('invoice_id')

  if (!invoice_id) return new Response('Missing invoice_id', { status: 400 })

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) return new Response('Invoice not found', { status: 404 })

  const html = generateInvoiceHTML(invoice)

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
        'Content-Disposition': `inline; filename="invoice-${invoice.reference || invoice.id}.pdf"`
      }
    })
  } catch (err) {
    console.error('PDF generation failed:', err)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
