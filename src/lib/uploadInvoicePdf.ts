import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'

export async function generateAndUploadInvoicePdf(invoice: any) {
  try {
    // 1. Generate the invoice PDF using jsPDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Invoice', 10, 20)
    doc.setFontSize(12)
    doc.text(`Client: ${invoice.client_name}`, 10, 40)
    doc.text(`Email: ${invoice.client_email}`, 10, 50)
    doc.text(`Amount: R${invoice.amount}`, 10, 60)
    doc.text(`Status: ${invoice.status}`, 10, 70)
    doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`, 10, 80)

    // 2. Convert PDF to Blob
    const blob = doc.output('blob')
    const filename = `invoices/invoice-${invoice.client_name.toLowerCase().replace(/\s+/g, '_')}-${invoice.id}-${new Date(invoice.created_at).getTime()}.pdf`


    // 3. Upload to Supabase Storage
    console.log('📤 Attempting to upload PDF to Supabase Storage')
    console.log('🧾 File name:', filename)
    console.log('🗂 Bucket: invoices')

    const uploadResponse = await supabase.storage
      .from('invoices')
      .upload(filename, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true,
      })

    console.log('📦 Full upload response:', JSON.stringify(uploadResponse, null, 2))

    // 4. Validate upload response
    if (!uploadResponse?.data) {
      console.error('❌ No upload data returned')
      console.warn('ℹ️ Upload response object:', JSON.stringify(uploadResponse, null, 2))

      if (uploadResponse?.error) {
        console.error('❌ Upload error:', JSON.stringify(uploadResponse.error, null, 2))
        throw new Error(uploadResponse.error.message ?? 'Unknown upload error')
      } else {
        throw new Error('Upload failed but no error message provided')
      }
    }

    // 5. Get the public URL of the uploaded file
    const { data: urlData, error: urlError } = supabase
      .storage
      .from('invoices')
      .getPublicUrl(filename)

    if (urlError || !urlData?.publicUrl) {
      console.error('⚠️ URL retrieval error:', urlError)
      throw new Error('Could not retrieve public URL for uploaded PDF')
    }

    // 6. Update invoice record
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ pdf_url: urlData.publicUrl })
      .eq('id', invoice.id)

    if (updateError) {
      console.error('❌ DB update error:', updateError)
      throw new Error('Failed to update invoice with PDF URL')
    }

    console.log('✅ PDF uploaded and invoice record updated successfully')
    return urlData.publicUrl

  } catch (err) {
    console.error('🔥 Unhandled error in generateAndUploadInvoicePdf:', err)
    throw err
  }
}
