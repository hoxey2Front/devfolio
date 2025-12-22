
import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // Supabase Storage에 업로드
    console.log('Attempting to upload file to Supabase:', file.name, file.size, file.type);
    const url = await uploadImage(file);
    console.log('Upload successful, URL:', url);

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error('Detailed Error uploading file:', {
      message: error.message,
      stack: error.stack,
      details: error,
    });
    return NextResponse.json(
      { 
        error: error.message || '파일 업로드 중 오류가 발생했습니다.',
        details: error.toString() 
      },
      { status: 500 }
    );
  }
}
