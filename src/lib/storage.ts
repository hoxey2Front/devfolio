import { supabase } from './supabase';

export const BUCKET_NAME = 'blog-images';

/**
 * Supabase Storage에 이미지를 업로드하고 Public URL을 반환합니다.
 */
export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName; // 폴더 구조가 필요한 경우 `${folder}/${fileName}` 형식으로 변경 가능

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
