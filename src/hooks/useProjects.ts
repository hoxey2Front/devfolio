import { useQuery } from '@tanstack/react-query';
import { Project } from '@/interfaces/project';

// API 호출 함수
const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch('/api/projects');
  if (!res.ok) {
    throw new Error('프로젝트 데이터를 가져오는 데 실패했습니다.');
  }
  return res.json();
};

// TanStack Query Hook
export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });
};
