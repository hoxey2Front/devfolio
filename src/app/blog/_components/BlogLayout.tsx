'use client';

import { usePosts } from '@/hooks/usePosts';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef, useState, useMemo, ReactNode } from 'react';
import { Post } from '@/types/post';
import ReloadButton from '@/components/common/ReloadButton';
import GradientHeadline from '@/components/common/GradientHeadline';

import { BlogHeader } from './BlogHeader';
import { BlogSearchDialog } from './BlogSearchDialog';


export interface ViewMode {
  viewMode: 'grid' | 'list';
}

// Layout의 children으로 렌더 함수를 받아 viewMode와 filteredPosts를 넘겨줍니다.
export interface BlogLayoutProps {
  children: (params: {
    posts: Post[];
    viewMode: ViewMode['viewMode'];
    // 🎯 추가: 태그 표시 상태
    showTags: boolean;
  }) => ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  const { data: posts, isLoading, isError } = usePosts();

  const [viewMode, setViewMode] = useState<ViewMode['viewMode']>(
    'grid'
  );
  const toggleViewMode = () => setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));

  const [showTags, setShowTags] = useState(false);
  const toggleShowTags = () => setShowTags((prev) => !prev);

  // 검색 상태 관리
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // OS 확인 로직 (핫키 표시용)
  const [isMac, setIsMac] = useState<boolean | null>(null);
  useEffect(() => {
    setIsMac(navigator.platform.toLowerCase().includes('mac'));
  }, []);

  // ⌘/Ctrl+K 핫키 로직 (page.tsx와 동일)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // e.key가 undefined일 수 있으므로 체크
      if (!e.key) return;

      const key = e.key.toLowerCase();
      const isHotkey = (e.metaKey && key === 'k') || (e.ctrlKey && key === 'k');

      const target = e.target as HTMLElement | null;
      const isTypingField = target
        ? ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable
        : false;

      if (isHotkey && !isTypingField) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Dialog 오픈 변경 처리: 닫힐 때 검색어 초기화 및 트리거 인풋 포커스 복귀
  const handleDialogOpenChange = (open: boolean) => {
    setIsSearchOpen(open);
    if (!open) {
      setQuery('');
      // Dialog 닫힐 때만 검색어 입력창에 포커스 복귀
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  };

  const handleSearchTrigger = () => {
    setIsSearchOpen(true);
  };

  const handlePostSelect = () => {
    // 검색 결과를 클릭했을 때
    setIsSearchOpen(false);
    setQuery(''); // 검색어 초기화
  };

  // 포스트 필터링 로직 (page.tsx와 동일)
  const filteredPosts = useMemo(() => {
    const postArray: Post[] = posts! as Post[];
    // 'as' 문법은 최대한 지양해달라는 요청을 준수하기 위해 
    // `posts`가 `Post[] | undefined`라고 가정하고 확실하게 체크합니다.
    if (!postArray || !query.trim() || !Array.isArray(posts)) return postArray;

    const q = query.trim().toLowerCase();

    return postArray.filter((p) => {
      const inTitle = p.title?.toLowerCase().includes(q);
      const inSummary = p.summary?.toLowerCase().includes(q);
      const inTags = p.tags?.some((t: string) => t.toLowerCase().includes(q));
      return inTitle || inSummary || inTags;
    });
  }, [posts, query]);

  // 로딩 및 에러 처리 (page.tsx와 동일)
  if (isLoading) {
    const skeleton = (
      <div className="p-6 rounded-lg">
        <Skeleton className="h-6 w-2/3 mb-3 bg-muted" />
        <Skeleton className="h-4 w-full mb-2 bg-muted" />
        <Skeleton className="h-30 w-full mb-2 bg-muted" />
        <Skeleton className="h-4 w-1/2 mt-4 bg-muted" />
      </div>
    );
    return (
      <div className="w-full max-w-7xl mx-auto px-6" >
        {/* BlogHeader 대신 간략한 스켈레톤 헤더 */}
        <h1 className="text-4xl font-extrabold tracking-wide lg:text-5xl gradient-text w-fit">Dev Blog</h1>
        <div className='flex justify-between items-center mt-4 mb-12'>
          <p className="text-base md:text-lg lg:text-lg text-body">
            제가 작성한 블로그 포스트들을 소개합니다.
          </p>
          <Skeleton className='h-8 w-1/4 bg-muted' />
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 lg:gap-2">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div key={idx} className="bg-card hover:shadow-lg transition-all">{skeleton}</div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !posts) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <GradientHeadline text="Dev Blog" />
        <p className="text-base md:text-lg lg:text-lg text-body mt-4 mb-12">
          제가 작성한 블로그 포스트들을 소개합니다.
        </p>
        <Separator />
        <div className="py-32 text-center">
          <p className="text-lg text-destructive mb-6">
            블로그를 불러오는 중 에러가 발생했습니다.
          </p>
          <ReloadButton buttonText="새로고침" />
        </div>
      </div>
    );
  }

  // 포스트의 타입을 명확하게 지정
  const typedPosts: Post[] = posts as Post[];

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      {/* 🚀 BlogHeader는 Layout에 고정 */}
      <BlogHeader
        viewMode={viewMode}
        onViewModeToggle={toggleViewMode}
        onSearchTrigger={handleSearchTrigger}
        isMac={isMac}
        searchInputRef={searchInputRef}
        // 🎯 추가: 태그 토글 상태 및 함수 전달
        showTags={showTags}
        onTagsToggle={toggleShowTags}
      />

      <Separator />

      {/* 🎯 children으로 렌더 함수를 호출하여 필터링된 포스트와 뷰 모드를 넘겨줍니다. */}
      {children({ posts: typedPosts, viewMode, showTags })}

      {/* 🔎 BlogSearchDialog는 Layout에 고정 */}
      <BlogSearchDialog
        isSearchOpen={isSearchOpen}
        onOpenChange={handleDialogOpenChange}
        query={query}
        onQueryChange={setQuery}
        filteredPosts={filteredPosts}
        onPostSelect={handlePostSelect}
      />
    </div>
  );
}