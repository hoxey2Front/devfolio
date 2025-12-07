import { Post } from '@/types/post';
import { Project } from '@/types/project';

// 포스트 목업 데이터
export const mockPosts: Post[] = [
  {
    id: 'post1',
    title: 'Next.js 14 App Router에서 TDD 시작하기',
    publishedAt: '2025-12-06T03:00:00.000Z', // 5시간 전 (예시 고정값)
    tags: ['Next.js', 'Testing', 'TDD', 'TypeScript'],
    summary: 'App Router 환경에서 Vitest와 RTL을 활용한 테스트 주도 개발 방법론을 소개합니다.',
    content: `
      <h2>테스트 주도 개발이란?</h2>
      <p>테스트 주도 개발(TDD, Test-Driven Development)은 소프트웨어 개발 방법론 중 하나로, 실제 코드를 작성하기 전에 테스트 코드를 먼저 작성하는 방식입니다.</p>
      
      <h3>TDD의 3단계</h3>
      <ol>
        <li><strong>Red</strong>: 실패하는 테스트 작성</li>
        <li><strong>Green</strong>: 테스트를 통과하는 최소한의 코드 작성</li>
        <li><strong>Refactor</strong>: 코드 개선 및 리팩토링</li>
      </ol>
      
      <h3>Next.js App Router에서 Vitest 설정하기</h3>
      <p>Next.js 14의 App Router 환경에서 Vitest를 설정하는 방법을 알아보겠습니다.</p>
      
      <pre><code>npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom</code></pre>
      
      <blockquote>
        <p>Vitest는 Vite 기반의 빠른 테스트 러너로, Jest와 호환되는 API를 제공합니다.</p>
      </blockquote>
      
      <h3>첫 번째 테스트 작성하기</h3>
      <p>간단한 컴포넌트 테스트를 작성해보겠습니다.</p>
      
      <pre><code>import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(&lt;Button&gt;Click me&lt;/Button&gt;);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});</code></pre>
      
      <p>이렇게 TDD를 통해 안정적이고 유지보수가 쉬운 코드를 작성할 수 있습니다.</p>
    `,
  },
  {
    id: 'post2',
    title: 'Tailwind CSS v4와 shadcn/ui로 반응형 레이아웃 만들기',
    publishedAt: '2025-12-04T03:00:00.000Z', // 2일 전 (예시 고정값)
    tags: ['Tailwind CSS', 'UI', 'Design'],
    summary:
      'Tailwind v4의 새로운 기능을 활용하여 빠르고 쉽게 반응형 컴포넌트를 설계하는 방법.',
    content: `
      <h2>Tailwind CSS v4의 새로운 기능</h2>
      <p>Tailwind CSS v4는 성능 개선과 함께 다양한 새로운 기능을 제공합니다.</p>
      
      <h3>주요 변경사항</h3>
      <ul>
        <li>더 빠른 빌드 속도</li>
        <li>개선된 JIT 모드</li>
        <li>새로운 유틸리티 클래스</li>
        <li>향상된 다크 모드 지원</li>
      </ul>
      
      <h3>shadcn/ui와 함께 사용하기</h3>
      <p>shadcn/ui는 Tailwind CSS 기반의 재사용 가능한 컴포넌트 라이브러리입니다.</p>
      
      <blockquote>
        <p>shadcn/ui는 복사-붙여넣기 방식으로 컴포넌트를 프로젝트에 추가할 수 있어 매우 유연합니다.</p>
      </blockquote>
      
      <h3>반응형 그리드 레이아웃 예제</h3>
      <pre><code>&lt;div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
  &lt;Card&gt;카드 1&lt;/Card&gt;
  &lt;Card&gt;카드 2&lt;/Card&gt;
  &lt;Card&gt;카드 3&lt;/Card&gt;
&lt;/div&gt;</code></pre>
      
      <p>이렇게 간단하게 반응형 레이아웃을 구성할 수 있습니다.</p>
      
      <h3>다크 모드 구현</h3>
      <p>Tailwind CSS의 <code>dark:</code> 접두사를 사용하면 쉽게 다크 모드를 구현할 수 있습니다.</p>
      
      <pre><code>&lt;div className="bg-white dark:bg-gray-900 text-black dark:text-white"&gt;
  다크 모드 지원 컨텐츠
&lt;/div&gt;</code></pre>
    `,
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
    githubLink: 'https://github.com/hoxey2Front/devfolio',
    deployLink: '/',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-10',
      end: '2025-12',
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
    githubLink: 'https://github.com/orgs/SEMO-SEMO/repositories',
    deployLink: 'https://www.semo.io.kr/',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-09',
      end: '2025-10',
    },
  },
  {
    id: 'project3',
    title: 'WeWrite',
    summary:
      '누구나 작가가 되어 다른 사람들과 함께 이야기를 이어 쓰며 만들어가는 참여형 스토리텔링 플랫폼입니다.',
    techStacks: ['Next.js', 'Typescript', 'storybook', 'jest', 'supabase'],
    githubLink: 'https://github.com/we-write/frontend/tree/main',
    deployLink: 'https://we-write.netlify.app',
    thumbnailUrl: '/images/example.png',
    description: '...',
    period: {
      start: '2025-08',
      end: '2025-09',
    },
  },
];
