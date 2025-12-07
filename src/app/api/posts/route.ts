import { NextResponse } from 'next/server';
import { mockPosts } from '@/mocks/data';
import { Post } from '@/types/post';

export async function GET() {
  // 로컬 스토리지는 서버에서 접근 불가하므로 클라이언트에서 병합해야 함
  // 여기서는 Mock 데이터만 반환
  return NextResponse.json(mockPosts);
}
