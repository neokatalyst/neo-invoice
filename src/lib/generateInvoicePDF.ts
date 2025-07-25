import { chromium } from 'playwright'
import type { Invoice as BaseInvoice } from '@/types/invoice'
import type { InvoiceTemplateInput } from '@/types/invoiceTemplate'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

// Extend Invoice with optional fields needed for PDF rendering
type ExtendedInvoice = BaseInvoice & {
  logo_url?: string
  company_name?: string
  company_address?: string
  due_date?: string
}

export async function generateInvoicePDF(invoice: ExtendedInvoice): Promise<Buffer> {
  const templateData: InvoiceTemplateInput = {
    company_logo_url: invoice.logo_url ?? '/default-logo.png',
    company_name: invoice.company_name ?? 'Your Company Name',
    company_address: invoice.company_address ?? '123 Main Street, Johannesburg',
    client_name: invoice.client_name,
    client_email: invoice.client_email,
    invoice_reference: invoice.reference || invoice.id,
    invoice_date: new Date(invoice.created_at).toLocaleDateString(),
    due_date: invoice.due_date ?? '',
    items: invoice.items?.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      price: (item.price ?? 0).toFixed(2),
      total: ((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2),
    })) ?? [],
    subtotal: (invoice.total ?? 0).toFixed(2),
    vat: '0.00',
    total: (invoice.total ?? 0).toFixed(2),
    notes: invoice.notes ?? '',
  }

  const html = generateInvoiceHTML(templateData)

  try {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
      printBackground: true,
    })

    await browser.close()
    return pdfBuffer
  } catch (err) {
    console.error('❌ PDF generation failed:', err)
    throw new Error('Failed to generate invoice PDF')
  }
}
