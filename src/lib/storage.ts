import { supabase } from './supabase';

export const BUCKET_NAME = 'blog-images';

/**
 * Supabase Storage에 이미지를 업로드하고 Public URL을 반환합니다.
 */
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName;

  console.log('Using bucket:', BUCKET_NAME);
  
  // Convert File to ArrayBuffer for better reliability in server environments
  const arrayBuffer = await file.arrayBuffer();
  
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, arrayBuffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false
    });

  if (uploadError) {
    console.error('Supabase Storage Upload Error:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
