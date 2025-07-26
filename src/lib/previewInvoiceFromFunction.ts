export async function previewInvoiceFromFunction(invoiceId: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL}/generate-invoice-pdf?invoice_id=${invoiceId}`

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    })

    if (!res.ok) throw new Error('Failed to load preview')

    const html = await res.text()
    const win = window.open('', '_blank')
    if (win) {
      win.document.open()
      win.document.write(html)
      win.document.close()
    } else {
      alert('Popup blocked')
    }
  } catch (err) {
    console.error('Preview error:', err)
    alert('Could not preview invoice.')
  }
}
