export async function generateInvoicePdf(invoice_id: string): Promise<Blob> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-invoice-pdf?invoice_id=${invoice_id}`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to generate invoice PDF')
  }

  return await response.blob()
}
