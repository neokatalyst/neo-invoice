// src/lib/generateInvoicePdf.ts

export async function generateInvoicePdf(invoiceId: string): Promise<Blob> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL}/generate-invoice-pdf?invoice_id=${invoiceId}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch invoice HTML')
  }

  const html = await response.text()
  return new Blob([html], { type: 'text/html' })
}
