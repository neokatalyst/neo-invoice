export async function generateInvoicePdf(invoice_id: string): Promise<Blob> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL}/generate-invoice-pdf?invoice_id=${invoice_id}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch invoice HTML')
  }

  const html = await response.text()
  const blob = new Blob([html], { type: 'text/html' })

  return blob
}
