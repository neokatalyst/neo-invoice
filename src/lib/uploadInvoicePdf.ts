import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'

// Define a TypeScript interface for better type safety
interface Invoice {
  id: string | number
  client_name: string
  client_email: string
  amount: number
  status: string
  created_at: string | Date
  pdf_url?: string
}

export async function generateAndUploadInvoicePdf(invoice: Invoice): Promise<string> {
  try {
    // 1. Generate the invoice PDF using jsPDF
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text('Invoice', 10, 20)

    doc.setFontSize(12)
    doc.text(`Client: ${invoice.client_name}`, 10, 40)
    doc.text(`Email: ${invoice.client_email}`, 10, 50)
    doc.text(`Amount: R${invoice.amount.toFixed(2)}`, 10, 60) // Format amount with two decimals
    doc.text(`Status: ${invoice.status}`, 10, 70)

    // Format created_at as Date object if it's a string
    const createdDate = typeof invoice.created_at === 'string'
      ? new Date(invoice.created_at)
      : invoice.created_at
    doc.text(`Date: ${createdDate.toLocaleString()}`, 10, 80)

    // 2. Convert PDF to Blob
    const blob = doc.output('blob')

    // 3. Construct filename / path (auto-generated)
    const formattedClientName = invoice.client_name.toLowerCase().replace(/\s+/g, '_')
    const timestamp = createdDate.getTime()
    const filename = `invoices/invoice-${formattedClientName}-${invoice.id}-${timestamp}.pdf`

    console.log('📤 Attempting to upload PDF to Supabase Storage')
    console.log('🧾 File name:', filename)
    console.log('🗂 Bucket: invoices')

    // 4. Upload the Blob to Supabase Storage
    const uploadResponse = await supabase.storage
      .from('invoices')
      .upload(filename, blob, {
        contentType: 'application/pdf',
        cacheControl: '3600',
        upsert: true,
      })

    console.log('📦 Full upload response:', JSON.stringify(uploadResponse, null, 2))

    // 5. Validate upload response
    if (!uploadResponse.data) {
      console.error('❌ No upload data returned')
      if (uploadResponse.error) {
        console.error('❌ Upload error:', JSON.stringify(uploadResponse.error, null, 2))
        throw new Error(uploadResponse.error.message ?? 'Unknown upload error')
      } else {
        throw new Error('Upload failed but no error message provided')
      }
    }

    // 6. Get the public URL of the uploaded file
    const { data: urlData, error: urlError } = supabase.storage
      .from('invoices')
      .getPublicUrl(filename)

    if (urlError || !urlData?.publicUrl) {
      console.error('⚠️ URL retrieval error:', urlError)
      throw new Error('Could not retrieve public URL for uploaded PDF')
    }

    // 7. Update the invoice record with the public URL
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
