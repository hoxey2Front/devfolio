import { http, HttpResponse } from 'msw';
import { mockPosts, mockProjects } from './data';

export const handlers = [
  // 포트폴리오 목록 API
  http.get('/api/projects', () => {
    return HttpResponse.json(mockProjects);
  }),

  // 블로그 포스트 목록 API
  http.get('/api/posts', () => {
    return HttpResponse.json(mockPosts);
  }),
];
