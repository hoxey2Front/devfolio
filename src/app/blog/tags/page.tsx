// app/blog/tags/page.tsx
'use client';

import { Suspense } from 'react';
import * as React from 'react';
import { BlogLayout } from '@/app/blog/_components/BlogLayout';
import { useSearchParams } from 'next/navigation';
import { BlogPostCard } from '@/app/blog/_components/BlogPostCard';
import { BlogTagCarousel } from '@/app/blog/_components/BlogTagCarousel';

function BlogTagsContent() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag')?.toLowerCase() || null;

  return (
    <BlogLayout>
      {({ posts, viewMode, showTags }) => {
        const filteredPosts = selectedTag
          ? posts.filter((post) =>
            post.tags.map((t) => t.toLowerCase()).includes(selectedTag)
          )
          : posts;

        const renderTagBadges = () => (
          showTags && <BlogTagCarousel posts={posts} selectedTag={selectedTag} />
        );

        const renderPostList = () => {
          if (filteredPosts.length === 0) {
            return (
              <p className="text-muted-foreground">
                {selectedTag ? `'${selectedTag}' 태그를 가진 포스트가 없습니다.` : '포스트가 없습니다.'}
              </p>
            );
          }

          const gridClasses = viewMode === 'list'
            ? 'grid-cols-1'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';

          return (
            <div className={`grid ${gridClasses} gap-8 md:gap-6 lg:gap-4 transition-all duration-300 ease-in-out`}>
              {filteredPosts.map((post) => (
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

export default function BlogTagsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogTagsContent />
    </Suspense>
  );
}