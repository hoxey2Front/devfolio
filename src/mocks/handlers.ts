import { http, HttpResponse } from 'msw';
import { mockPosts, mockProjects } from './data';

export const handlers = [
  // 포트폴리오 목록 API
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects);
  }),

  // 블로그 포스트 목록 API
  http.get('/api/posts', () => {
    // 로컬 스토리지에서 저장된 포스트 확인
    if (typeof window !== 'undefined') {
      const savedPosts = localStorage.getItem('blog-posts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        // 저장된 포스트와 mock 포스트 병합 (저장된 포스트가 우선)
        return HttpResponse.json([...posts, ...mockPosts]);
      }
    }
    return HttpResponse.json(mockPosts);
  }),
];
