// src/lib/generateInvoicePdf.ts
import { createClient } from '@supabase/supabase-js'
import { generateInvoiceEmailHTML } from './generateInvoiceEmailHTML'
import type { Invoice } from '@/types/invoice'

export async function generateInvoicePdf(invoiceId: string): Promise<Blob> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, serviceRoleKey)

  // 1. Fetch the invoice data
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single()

  if (error || !invoice) {
    throw new Error('Invoice not found')
  }

  // 2. Build the PDF URL (using edge function URL for consistency)
  const functionsUrl =
    process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL ||
    `${supabaseUrl}/functions/v1`
  const pdfUrl = `${functionsUrl}/generate-invoice-pdf?invoice_id=${invoiceId}`

  // 3. Generate the styled HTML using the shared email layout
  const html = generateInvoiceEmailHTML(invoice as Invoice, pdfUrl)

  return new Blob([html], { type: 'text/html' })
}
