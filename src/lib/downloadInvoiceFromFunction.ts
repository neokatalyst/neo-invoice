export async function downloadInvoiceFromFunction(invoiceId: string) {
  if (typeof window === 'undefined') return

  try {
    const html2pdf = (await import('html2pdf.js')).default

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL}/generate-invoice-pdf?invoice_id=${invoiceId}`
    )

    if (!res.ok) {
      console.error('Failed to fetch invoice HTML:', await res.text())
      throw new Error('Fetch failed')
    }

    const html = await res.text()

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    await html2pdf().from(container).save(`invoice-${invoiceId}.pdf`)
    document.body.removeChild(container)
  } catch (err) {
    console.error('Download error:', err)
    alert('Could not download PDF.')
  }
}
