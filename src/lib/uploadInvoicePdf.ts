import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'

export async function generateAndUploadInvoicePdf(invoice: any) {
  try {
    // 1. Generate the invoice PDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Invoice', 10, 20)
    doc.setFontSize(12)
    doc.text(`Client: ${invoice.client_name}`, 10, 40)
    doc.text(`Email: ${invoice.client_email}`, 10, 50)
    doc.text(`Amount: R${invoice.amount}`, 10, 60)
    doc.text(`Status: ${invoice.status}`, 10, 70)
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, 10, 80)

    // 2. Convert to Blob
    const blob = doc.output('blob')

    const cleanName = invoice.client_name.replace(/\s+/g, '_').toLowerCase()
    const filename = `invoice-${cleanName}-${invoice.id}-${Date.now()}.pdf`

    // 3. Upload to Supabase Storage
    const uploadResponse = await supabase.storage
      .from('invoices')
      .upload(filename, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true,
      })

    if (!uploadResponse?.data) {
      if (uploadResponse?.error) {
        console.error('❌ Upload error:', JSON.stringify(uploadResponse.error, null, 2))
        throw new Error(uploadResponse.error.message ?? 'Unknown upload error')
      } else {
        throw new Error('Upload failed but no error message provided')
      }
    }

    // 4. Generate a signed URL (valid for 1 week = 604800 seconds)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('invoices')
      .createSignedUrl(filename, 604800)

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('❌ Signed URL error:', signedUrlError)
      throw new Error('Failed to create signed URL for uploaded PDF')
    }

    // 5. Update the invoice with the signed URL
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ pdf_url: signedUrlData.signedUrl })
      .eq('id', invoice.id)

    if (updateError) {
      console.error('❌ DB update error:', updateError)
      throw new Error('Failed to update invoice with signed PDF URL')
    }

    return signedUrlData.signedUrl
  } catch (err) {
    console.error('🔥 Error in generateAndUploadInvoicePdf:', err)
    throw err
  }
}
