'use client';

import { Suspense } from 'react';
import { BlogLayout } from '@/app/blog/_components/BlogLayout';
import { BlogPostCard } from '@/app/blog/_components/BlogPostCard';
// 🎯 추가: 태그 캐러셀 컴포넌트 임포트
import { BlogTagCarousel } from '@/app/blog/_components/BlogTagCarousel';
import { Post } from '@/types/post';
// 🎯 추가: useSearchParams 임포트 (태그 필터링을 위해)
import { useSearchParams } from 'next/navigation';
import { EmptyState } from '@/components/common/EmptyState';
import { FileX } from 'lucide-react';

function BlogPageContent() {
  // 🎯 추가: 쿼리 파라미터에서 선택된 태그를 가져옵니다.
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag')?.toLowerCase() || null;

  return (
    <BlogLayout>
      {/* 🎯 showTags를 추가로 받습니다. */}
      {({ posts, viewMode, showTags }) => {

        // 🎯 태그 필터링 로직: 선택된 태그에 따라 포스트를 필터링합니다.

        const filteredPosts = selectedTag
          ? posts.filter((post) =>
            post.tags.map((t) => t.toLowerCase()).includes(selectedTag)
          )
          : posts; // 태그가 선택되지 않았다면 BlogLayout의 posts (전체 포스트)를 사용합니다.

        // BlogLayout으로부터 받은 viewMode를 사용하여 레이아웃 클래스를 결정합니다.
        const gridClasses = viewMode === 'list'
          ? 'grid-cols-1'
          : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

        return (
          <>
            {/* 🎯 showTags가 true일 때만 태그 캐러셀을 렌더링합니다. */}
            {showTags && (
              <BlogTagCarousel posts={posts} selectedTag={selectedTag} />
            )}

            <div className={`grid ${gridClasses} gap-8 md:gap-6 lg:gap-4 transition-all duration-300 ease-in-out`}>
              {filteredPosts.map((post: Post) => (
                // 필터링된 포스트 목록을 렌더링합니다.
                <BlogPostCard key={post.id} post={post} shadowEffect />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <EmptyState
                message={selectedTag ? `'${selectedTag}' 태그를 가진 포스트가 없습니다.` : '포스트가 없습니다.'}
                icon={FileX}
              />
            )}
          </>
        );
      }}
    </BlogLayout>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageContent />
    </Suspense>
  );
}