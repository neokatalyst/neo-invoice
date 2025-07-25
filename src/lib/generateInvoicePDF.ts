import type { Invoice } from '@/types/invoice'
import type { InvoiceTemplateInput } from '@/types/invoiceTemplate'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'
import { chromium } from 'playwright'

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const templateData: InvoiceTemplateInput = {
    company_logo_url: '/default-logo.png',
    company_name: 'Your Company Name',
    company_address: '123 Main Street, Johannesburg',
    client_name: invoice.client_name,
    client_email: invoice.client_email,
    invoice_reference: invoice.reference || invoice.id,
    invoice_date: new Date(invoice.created_at).toLocaleDateString(),
    due_date: '',
    items: invoice.items?.map((item: { description: string; quantity: number; price: number }) => ({
      description: item.description,
      quantity: item.quantity,
      price: item.price.toFixed(2),
      total: (item.quantity * item.price).toFixed(2),
    })) ?? [],
    subtotal: invoice.total.toFixed(2),
    vat: '0.00',
    total: invoice.total.toFixed(2),
    notes: invoice.notes ?? '',
  }

  const html = generateInvoiceHTML(templateData)

  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'networkidle' })

  const pdfBuffer = await page.pdf({
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  })

  await browser.close()
  return new Blob([pdfBuffer], { type: 'application/pdf' })
}
