import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

// ✅ Admin Supabase client
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

  // 1. Fetch the invoice
  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (error || !invoice) {
    return new Response('Invoice not found', { status: 404 })
  }

  // 2. Formatters
  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString))

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount).replace('ZAR', 'R')

  // 3. Prepare items
  const items = (invoice.items ?? []) as {
    description: string
    quantity: number
    price: number
    total: number
  }[]

  const itemMapped = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    price: formatCurrency(item.price),
    total: formatCurrency(item.total),
  }))

  // 4. Generate signed logo URL if available
  let logoUrl = '/default-logo.png'
  if (invoice.logo_url) {
    const { data: signed } = await supabaseAdmin.storage
      .from('logos')
      .createSignedUrl(invoice.logo_url, 60 * 60)
    if (signed?.signedUrl) logoUrl = signed.signedUrl
  }

  // 5. Generate the invoice HTML using shared layout
  const html = generateInvoiceHTML({
    company_logo_url: logoUrl,
    company_name: invoice.company_name ?? 'Company Name',
    company_address: invoice.company_address ?? 'Company Address',
    client_name: invoice.client_name ?? 'Customer',
    client_email: invoice.client_email ?? 'client@example.com',
    invoice_reference: invoice.reference ?? invoice.id,
    invoice_date: formatDate(invoice.created_at),
    due_date: invoice.due_date ? formatDate(invoice.due_date) : formatDate(invoice.created_at),
    items: itemMapped,
    subtotal: formatCurrency(Number(invoice.subtotal ?? 0)),
    vat: formatCurrency(Number(invoice.vat ?? 0)),
    total: formatCurrency(Number(invoice.total ?? 0)),
    notes: invoice.notes ?? 'Thank you for your business!',
  })

  // 6. Optional "PAID" watermark if status is paid
  const finalHtml = invoice.status === 'paid'
    ? html.replace('</body>', `<div style="position:absolute;top:40%;left:35%;font-size:72px;color:#ccc;transform:rotate(-30deg);opacity:0.4;">PAID</div></body>`)
    : html

  return new Response(finalHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
