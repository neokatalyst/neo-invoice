// src/lib/generateInvoicePdf.ts
import { createClient } from '@supabase/supabase-js'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'


export async function generateInvoicePdf(invoiceId: string): Promise<Blob> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // 1. Fetch the invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()

  if (error || !invoice) {
    throw new Error('Invoice not found')
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

  // 4. Generate signed URL for logo if available
  let logoUrl = '/default-logo.png'
  if (invoice.logo_url) {
    const { data: signed } = await supabase.storage
      .from('logos')
      .createSignedUrl(invoice.logo_url, 60 * 60)
    if (signed?.signedUrl) logoUrl = signed.signedUrl
  }

  // 5. Generate HTML
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

  // 6. Optional: Add watermark if invoice is paid
  const finalHtml = invoice.status === 'paid'
    ? html.replace('</body>', `<div style="position:absolute;top:40%;left:35%;font-size:72px;color:#ccc;transform:rotate(-30deg);opacity:0.4;">PAID</div></body>`)
    : html

  return new Blob([finalHtml], { type: 'text/html' })
}
