import { supabase } from './supabaseClient'

export async function previewInvoiceFromFunction(invoiceId: string) {
  if (typeof window === 'undefined') return

  try {
    const html2pdf = (await import('html2pdf.js')).default

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

    const functionsUrl =
      process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL ||
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`

    const res = await fetch(`${functionsUrl}/generate-invoice-pdf?invoice_id=${invoiceId}`, {
      headers: isLocal
        ? {} // No auth header for local dev
        : session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {},
    })

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
