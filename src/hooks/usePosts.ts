import { useQuery } from '@tanstack/react-query';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';
import { mapPostFromSupabase } from '@/lib/mapper';

// API 호출 함수
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    throw new Error('포스트 데이터를 가져오는 데 실패했습니다.');
  }

  return data.map(mapPostFromSupabase);
};

// TanStack Query Hook
export const usePosts = () => {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });
};
