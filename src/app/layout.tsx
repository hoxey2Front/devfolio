import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Footer from '@/components/layout/Footer';
// useInView를 Layout에서 제거

// HeaderManager 임포트
import HeaderManager from '@/components/layout/HeaderManager';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My Devfolio',
  description: '나만을 위한 포트폴리오와 개발 블로그',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

  // 서버 컴포넌트인 RootLayout은 이제 순수하게 레이아웃 구조만 담당합니다.

  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full w-full bg-gray-900 text-gray-200`} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col w-full">

            {/* HeaderManager가 이제 감지할 요소를 직접 찾습니다. */}
            {/* inViewElement prop 제거 */}
            <HeaderManager />

            <main className="flex-grow w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}