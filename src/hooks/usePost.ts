import { useQuery } from '@tanstack/react-query';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';
import { mapPostFromSupabase } from '@/lib/mapper';

const fetchPost = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching post:', error);
    throw new Error('포스트를 가져오는 데 실패했습니다.');
  }

  return mapPostFromSupabase(data);
};

export const usePost = (id: string) => {
  return useQuery<Post | null>({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!id,
  });
};
