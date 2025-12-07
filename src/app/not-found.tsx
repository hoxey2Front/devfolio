import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-7xl md:text-9xl font-bold gradient-text mb-6">
          404
        </h1>

        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">
          페이지를 찾을 수 없습니다
        </h2>

        <p className="text-base text-muted-foreground mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="size-4" />
            홈으로 돌아가기
          </Link>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            블로그 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
