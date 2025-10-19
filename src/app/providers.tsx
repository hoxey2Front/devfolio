'use client';

// 개발 환경에서만, 브라우저에서만, 그리고 서비스 워커 파일이 실제로 존재할 때만 MSW 시작
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (async () => {
    try {
      const res = await fetch('/mockServiceWorker.js', { method: 'HEAD' });
      if (!res.ok) return; // 파일이 없으면 MSW 시작하지 않음

      const { worker } = await import('../mocks/browser');
      await worker.start({ serviceWorker: { url: '/mockServiceWorker.js' } });
    } catch {
      // 파일이 없거나 fetch 실패 시 조용히 무시하여 런타임 에러 방지
    }
  })();
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// 클라이언트 컴포넌트로 분리
const queryClient = new QueryClient({
  // 전역 오류 재시도를 방지하기 위한 기본 설정 예시 (선택 사항)
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// 사용자님의 지침에 따라 interface를 사용하여 타입을 선언했습니다.
export interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 시 React Query Devtools를 여기에 추가할 수 있습니다 */}
    </QueryClientProvider>
  );
}