import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'

export async function generateAndUploadInvoicePdf(invoice: any) {
  // 1. Generate PDF
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Invoice', 10, 20)
  doc.setFontSize(12)
  doc.text(`Client: ${invoice.client_name}`, 10, 40)
  doc.text(`Email: ${invoice.client_email}`, 10, 50)
  doc.text(`Amount: R${invoice.amount}`, 10, 60)
  doc.text(`Status: ${invoice.status}`, 10, 70)
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, 10, 80)

  const pdfBlob = doc.output('blob')

  const filename = `invoice-${invoice.id}.pdf`

  // 2. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(filename, pdfBlob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'application/pdf',
    })

  if (uploadError) throw uploadError

  // 3. Get public URL
  const { data } = supabase.storage.from('invoices').getPublicUrl(filename)
  const pdfUrl = data.publicUrl

  // 4. Save to invoice record
  const { error: updateError } = await supabase
    .from('invoices')
    .update({ pdf_url: pdfUrl })
    .eq('id', invoice.id)

  if (updateError) throw updateError

  return pdfUrl
}

