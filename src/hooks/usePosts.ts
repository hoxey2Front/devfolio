import { useQuery } from '@tanstack/react-query';
import { Post } from '@/interfaces/post';

// API 호출 함수
const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts');
  if (!res.ok) {
    throw new Error('프로젝트 데이터를 가져오는 데 실패했습니다.');
  }
  return res.json();
};

// TanStack Query Hook
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });
};
