import * as FileSystem from 'expo-file-system'
import mime from 'mime'
import { supabase } from './supabaseClient'

export async function uploadToSupabaseStorage(fileUri: string, userId: string) {
  const fileData = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  const fileExt = fileUri.split('.').pop()
  const fileName = `invoices/${userId}/invoice-${Date.now()}.${fileExt}`
  const mimeType = mime.getType(fileUri) || 'application/pdf'

  const { error } = await supabase.storage
    .from('invoices')
    .upload(fileName, fileData, {
      contentType: mimeType,
      upsert: true,
    })

  if (error) throw error

// Generate signed URL (valid for 1 hour)
const { data, error: urlError } = await supabase.storage
  .from('invoices')
  .createSignedUrl(fileName, 3600)

if (urlError) throw urlError

return data.signedUrl
}
