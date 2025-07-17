import { supabase } from './supabaseClient'

export const uploadLogo = async (file: File, userId: string): Promise<string> => {
  const filePath = `${userId}/${file.name}`;
  console.log('Uploading file to:', filePath);

  const { error: uploadError } = await supabase
    .storage
    .from('logos')
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Upload Error:', uploadError);
    throw new Error(uploadError?.message || 'Upload failed.');
  }

  // ✅ Create signed URL valid for 7 days
  const { data: signedUrlData, error: signedUrlError } = await supabase
    .storage
    .from('logos')
    .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

  if (signedUrlError) {
    console.error('Signed URL Error:', signedUrlError);
    throw new Error(signedUrlError?.message || 'Failed to generate signed URL.');
  }

  console.log('✅ Signed URL created:', signedUrlData.signedUrl);

  return signedUrlData.signedUrl;
};
