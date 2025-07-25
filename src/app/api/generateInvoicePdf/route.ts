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

  if (!invoice_id) {
    return new Response('Missing invoice_id', { status: 400 })
  }

  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    console.error('❌ Invoice fetch error:', error)
    return new Response('Invoice not found', { status: 404 })
  }

  let logoUrl: string | null = null

  try {
    const logoPath = invoice.logo_url?.trim()

    if (logoPath) {
      const { data: signed, error: signedError } = await supabaseAdmin
        .storage.from('logos')
        .createSignedUrl(logoPath, 60 * 60 * 24 * 7)
      if (signedError) console.warn('⚠️ Signed URL error (invoice logo):', signedError.message)
      logoUrl = signed?.signedUrl ?? null
    } else {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('logo_url')
        .eq('id', invoice.user_id)
        .single()

      if (!profileError && profile?.logo_url) {
        const { data: signed } = await supabaseAdmin
          .storage.from('logos')
          .createSignedUrl(profile.logo_url, 60 * 60 * 24 * 7)
        logoUrl = signed?.signedUrl ?? null
      }
    }
  } catch (err) {
    console.error('❌ Logo fetch error:', err)
  }

  const safeItems = (invoice.items ?? []) as {
    description: string
    quantity: number
    price: number
  }[]

  const subtotal = safeItems.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0)
  const vat = (subtotal * 0.15).toFixed(2)
  const total = (subtotal + parseFloat(vat)).toFixed(2)

  const html = generateInvoiceHTML({
    company_logo_url: logoUrl ?? '',
    company_name: invoice.company_name || '',
    company_address: invoice.company_address || '',
    client_name: invoice.client_name,
    client_email: invoice.client_email,
    invoice_reference: invoice.reference || invoice.id,
    invoice_date: new Date(invoice.created_at).toLocaleDateString(),
    due_date: invoice.due_date || '',
    items: safeItems.map(i => ({
      description: i.description,
      quantity: i.quantity,
      price: (i.price || 0).toFixed(2),
      total: ((i.price || 0) * (i.quantity || 0)).toFixed(2)
    })),
    subtotal: subtotal.toFixed(2),
    vat,
    total,
    notes: invoice.notes || ''
  })

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const context = await browser.newContext()
    const page = await context.newPage()

    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdfBuffer = await page.pdf({ format: 'A4' })

    await browser.close()

    console.log('✅ Invoice PDF generated:', invoice.reference)
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-${invoice.reference || invoice.id}.pdf"`
      }
    })
  } catch (err) {
    console.error('❌ PDF generation failed:', err)
    return new Response('Failed to generate PDF', { status: 500 })
  }
}
