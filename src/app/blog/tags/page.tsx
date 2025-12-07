// app/blog/tags/page.tsx
'use client';

import * as React from 'react';
import { BlogLayout } from '@/app/blog/_components/BlogLayout';
import { useSearchParams } from 'next/navigation';
import { BlogPostCard } from '@/app/blog/_components/BlogPostCard';
import { BlogTagCarousel } from '@/app/blog/_components/BlogTagCarousel'; // 새로 만든 컴포넌트 임포트

// BlogTagCarousel에서 사용하는 Post 타입은 BlogPostCard에서 가져옵니다.

export default function BlogTagsPage() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag')?.toLowerCase() || null;

  // 캐러셀 스크롤 관련 로직 제거됨. BlogTagCarousel 내부로 이동.

  return (
    <BlogLayout>
      {/* 🎯 viewMode를 BlogLayout으로부터 받습니다. */}
      {({ posts, viewMode, showTags }) => {
        // Layout에서 전체 포스트를 받습니다.

        // 현재 선택된 태그에 따라 포스트를 필터링합니다.
        const filteredPosts = selectedTag
          ? posts.filter((post) =>
            post.tags.map((t) => t.toLowerCase()).includes(selectedTag)
          )
          : posts; // 태그가 선택되지 않았다면 전체 포스트를 보여줍니다.

        // 태그 목록을 렌더링하는 컴포넌트 (BlogTagCarousel 사용)
        const renderTagBadges = () => (
          // posts와 selectedTag를 props로 전달
          // 🎯 showTags가 true일 때만 렌더링
          showTags && <BlogTagCarousel posts={posts} selectedTag={selectedTag} />
        );

        // 포스트 목록을 렌더링하는 함수 (뷰 모드 적용)
        const renderPostList = () => {
          if (filteredPosts.length === 0) {
            return (
              <p className="text-muted-foreground">
                {selectedTag ? `'${selectedTag}' 태그를 가진 포스트가 없습니다.` : '포스트가 없습니다.'}
              </p>
            );
          }

          // 🎯 BlogPage의 로직을 적용하여 viewMode에 따라 클래스를 결정합니다.
          const gridClasses = viewMode === 'list'
            ? 'grid-cols-1'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

          return (
            <div className={`grid ${gridClasses} gap-8 md:gap-6 lg:gap-4 transition-all duration-300 ease-in-out`}>
              {filteredPosts.map((post) => (
                // 이제 뷰 모드에 따라 BlogPostCard가 그리드 또는 리스트 스타일로 렌더링됩니다.
                <BlogPostCard key={post.id} post={post} shadowEffect />
              ))}
            </div>
          );
        };

        return (
          <>
            {renderTagBadges()}
            {renderPostList()}
          </>
        );
      }}
    </BlogLayout>
  );
}