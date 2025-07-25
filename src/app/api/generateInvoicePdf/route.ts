import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'
import { chromium } from 'playwright'

export const runtime = 'nodejs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const invoice_id = searchParams.get('invoice_id')

  if (!invoice_id) {
    return new Response('Missing invoice_id', { status: 400 })
  }

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    return new Response('Invoice not found', { status: 404 })
  }

  const html = generateInvoiceHTML(invoice)

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })
  const pdfBuffer = await page.pdf({ format: 'a4' })
  await browser.close()

  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice-${invoice.reference || invoice.id}.pdf`
    }
  })
}
