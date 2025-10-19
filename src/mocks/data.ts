import { Post } from '@/interfaces/post';
import { Project } from '@/interfaces/project';

// 포스트 목업 데이터
export const mockPosts: Post[] = [
  {
    id: 'post1',
    title: 'Next.js 14 App Router에서 TDD 시작하기',
    slug: 'nextjs14-approuter-tdd-start',
    publishedAt: '2025-10-05',
    tags: ['Next.js', 'Testing', 'TDD', 'TypeScript'],
    summary: 'App Router 환경에서 Vitest와 RTL을 활용한 테스트 주도 개발 방법론을 소개합니다.',
    content: '...', // 실제 내용 대신 '...'
  },
  {
    id: 'post2',
    title: 'Tailwind CSS v4와 shadcn/ui로 반응형 레이아웃 만들기',
    slug: 'tailwind-v4-responsive-layout',
    publishedAt: '2025-09-28',
    tags: ['Tailwind CSS', 'UI', 'Design'],
    summary:
      'Tailwind v4의 새로운 기능을 활용하여 빠르고 쉽게 반응형 컴포넌트를 설계하는 방법.',
    content: '...',
  },
];

// 프로젝트 목업 데이터
export const mockProjects: Project[] = [
  {
    id: 'project1',
    title: '나만을 위한 포트폴리오 & 개발 블로그 Devfolio',
    summary: 'TypeScript와 최신 Frontend 스택으로 구축된 개인 포트폴리오 사이트입니다.',
    techStacks: [
      'Next.js',
      'TypeScript',
      'TanStack Query',
      'Zustand',
      'Tailwind',
      'shadcn/ui',
    ],
    githubLink: 'https://github.com/my-repo/example',
    deployLink: 'https://example.com',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-10',
      end: '2025-10',
    },
  },
  {
    id: 'project2',
    title: '세상의 모든 견적 SEMO',
    summary: '1개월간 인턴십을 진행하며 구축한 견적 서비스 플랫폼입니다.',
    techStacks: [
      'React.js',
      'TypeScript',
      'TanStack Query',
      'Zustand',
      'Tailwind',
      'shadcn/ui',
    ],
    githubLink: 'https://github.com/my-repo/example',
    deployLink: 'https://example.com',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-09',
      end: '2025-09',
    },
  },
  {
    id: 'project3',
    title: 'WeWrite',
    summary:
      '누구나 작가가 되어 다른 사람들과 함께 이야기를 이어 쓰며 만들어가는 참여형 스토리텔링 플랫폼입니다.',
    techStacks: ['Next.js', 'Typescript', 'storybook', 'jest', 'supabase'],
    githubLink: 'https://github.com/my-repo/example',
    deployLink: 'https://example.com',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-08',
      end: '2025-08',
    },
  },
];
