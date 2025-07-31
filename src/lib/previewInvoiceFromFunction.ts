'use client'

import { supabase } from './supabaseClient'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

export async function previewInvoiceFromFunction(invoiceId: string) {
  if (typeof window === 'undefined') return

  try {
    // 1. Fetch invoice from Supabase
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) throw new Error('Invoice not found')

    // 2. Formatters
    const formatDate = (dateString: string) =>
      new Intl.DateTimeFormat('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateString))

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(amount).replace('ZAR', 'R')

    // 3. Format items
    const items = (invoice.items ?? []) as {
      description: string
      quantity: number
      price: number
      total: number
    }[]

    const itemMapped = items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: formatCurrency(item.price ?? 0),
      total: formatCurrency(item.total ?? 0),
    }))

    // 4. Get logo
let logoUrl = '/default-logo.png'
if (invoice.logo_url && typeof invoice.logo_url === 'string') {
  const cleanPath = invoice.logo_url.replace(/^logos\//, '')
  const { data: signed, error } = await supabase.storage
    .from('logos')
    .createSignedUrl(cleanPath, 60 * 60)

  if (signed?.signedUrl) {
    logoUrl = signed.signedUrl
  } else {
    console.warn('⚠️ Failed to sign logo URL:', error)
  }
}


    // 5. Build HTML
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

    // 6. Optional watermark for paid invoices
    const finalHtml = invoice.status === 'paid'
      ? html.replace(
          '</body>',
          `<div style="position:absolute;top:40%;left:35%;font-size:72px;color:#ccc;transform:rotate(-30deg);opacity:0.4;">PAID</div></body>`
        )
      : html

    // 7. Open in new window as preview
    const previewWindow = window.open('', '_blank', 'width=1024,height=768')
    if (!previewWindow) throw new Error('Popup blocked')

    previewWindow.document.write(finalHtml)
    previewWindow.document.title = `Invoice Preview`
    previewWindow.document.close()
  } catch (err) {
    console.error('Preview error:', err)
    alert('Could not preview invoice.')
  }
}
