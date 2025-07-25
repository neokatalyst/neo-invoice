import { supabase } from '@/lib/supabaseClient'
import { generateInvoicePDF } from '@/lib/generateInvoicePDF'
import type { Invoice } from '@/types/invoice'

export async function generateAndUploadInvoicePDF(invoice: Invoice): Promise<string> {
  const pdfBlob = await generateInvoicePDF(invoice)

  const filename = `invoice-${invoice.id}-${Date.now()}.pdf`
  const { data, error } = await supabase.storage.from('invoices').upload(filename, pdfBlob, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'application/pdf',
  })

  if (error) {
    console.error('Error uploading PDF:', error.message)
    throw new Error('Failed to upload invoice PDF')
  }

  console.log('Upload successful:', data)

  // ✅ Get public URL after upload
  const { data: urlData } = supabase.storage.from('invoices').getPublicUrl(filename)

  if (!urlData?.publicUrl) {
    console.error('Failed to get public URL for', filename)
    throw new Error('Failed to get public URL')
  }

  console.log('Public URL:', urlData.publicUrl)
  return urlData.publicUrl
}
