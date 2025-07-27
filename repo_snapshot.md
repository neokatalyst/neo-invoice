            view-invoice-pdf/
            view-quote-pdf/
===== src/app/api/view-invoice-pdf/route.ts =====
===== src/app/api/view-quote-pdf/route.ts =====
    const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/view-invoice-pdf?invoice_id=${invoice_id}`
  const pdfUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/view-quote-pdf?quote_id=${quote.id}`
import { view-invoice-pdf } from '@/lib/generateInvoicePDF'
    const doc = view-invoice-pdf(invoice)
    window.open(`/api/view-invoice-pdf?invoice_id=${invoiceId}`, '_blank')
    window.open(`/api/view-quote-pdf?quote_id=${quoteId}`, '_blank')
    window.open(`/api/view-quote-pdf?quote_id=${quoteId}`, '_blank')
import { view-invoice-pdf, Invoice } from '@/lib/view-invoice-pdf'
  const pdfBlob = await view-invoice-pdf(invoice)
