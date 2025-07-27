import { supabase } from './supabaseClient'

export async function previewQuoteFromFunction(quoteId: string) {
  if (typeof window === 'undefined') return

  try {
    const html2pdf = (await import('html2pdf.js')).default

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL}/generate-quote-pdf?quote_id=${quoteId}`,
      {
        headers: session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : undefined,
      }
    )

    const html = await res.text()

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    await html2pdf().from(container).save(`quote-${quoteId}.pdf`)
    document.body.removeChild(container)
  } catch (err) {
    console.error('Download error:', err)
    alert('Could not download PDF.')
  }
}
