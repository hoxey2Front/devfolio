import { useQuery } from '@tanstack/react-query';
import { Project } from '@/types/project';
import { supabase } from '@/lib/supabase';
import { mapProjectFromSupabase } from '@/lib/mapper';

// API 호출 함수
const fetchProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('프로젝트 데이터를 가져오는 데 실패했습니다.');
  }

  return data.map(mapProjectFromSupabase);
};

// TanStack Query Hook
export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });
};
