import { supabase } from './supabaseClient'
import { generateInvoiceHTML } from '@/lib/pdfTemplates/invoiceTemplate'

export async function downloadInvoiceFromFunction(invoiceId: string) {
  if (typeof window === 'undefined') return

  try {
    const html2pdf = (await import('html2pdf.js')).default

   await supabase.auth.getSession()



    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) {
      throw new Error('Invoice not found')
    }

    const html = await generateInvoiceHTML(invoice)

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
