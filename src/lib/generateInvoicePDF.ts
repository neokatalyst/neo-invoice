// src/lib/generateInvoicePDF.ts
import type { Invoice } from '@/types/invoice'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'
import { chromium } from 'playwright'

export async function generateInvoicePDF(invoice: Invoice): Promise<Blob> {
  const html = generateInvoiceHTML(invoice)

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
