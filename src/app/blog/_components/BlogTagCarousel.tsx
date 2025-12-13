// app/blog/_components/BlogTagCarousel.tsx
import * as React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Post } from '@/types/post'; // Post 타입 임포트

// 사용자 요청에 따라 interface로 타입을 선언합니다.
export interface TagInfo {
  tag: string;
  count: number;
}

export interface BlogTagCarouselProps {
  posts: Post[]; // 전체 포스트 목록
  selectedTag: string | null; // 현재 선택된 태그 (useSearchParams에서 가져온 값)
}

// ---------------------- 1. 태그 추출 및 정렬 로직 ----------------------
const getTagList = (posts: Post[]): TagInfo[] => {
  const tagCountMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      // 태그 이름은 대소문자 구분 없이 사용하기 위해 소문자로 통일
      const normalizedTag = tag.toLowerCase();
      tagCountMap.set(normalizedTag, (tagCountMap.get(normalizedTag) || 0) + 1);
    });
  });

  // 배열로 변환하고 카운트 내림차순, 태그명 오름차순으로 정렬
  return Array.from(tagCountMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count; // 카운트 내림차순
      }
      return a.tag.localeCompare(b.tag); // 태그명 오름차순
    });
};

export function BlogTagCarousel({ posts, selectedTag }: BlogTagCarouselProps) {
  const allTags = getTagList(posts);

  // 선택된 태그가 있을 경우 소문자로 변환하여 비교에 사용합니다. (이전 답변에서 수정된 로직)
  const normalizedSelectedTag = selectedTag ? selectedTag.toLowerCase() : null;

  // 캐러셀 스크롤 핸들링
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const scrollByAmount = (amount: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    return () => {
    };
  }, []);



  return (
    <div className="relative">
      {/* 좌측/우측 네비 버튼 - md 이상에서 항상 표시, 모바일은 스크롤 힌트만 */}
      <div
        ref={scrollRef}
        // 수평 스크롤 컨테이너
        className="
          flex items-center gap-2 overflow-x-auto overflow-y-hidden
          scroll-smooth snap-x snap-mandatory
          px-1 [-ms-overflow-style:none] [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden mb-8
        "
        // 키보드 스크롤도 가능하게
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') scrollByAmount(240);
          if (e.key === 'ArrowLeft') scrollByAmount(-240);
        }}
      >
        {/* '전체' 링크 */}
        <Link
          href="/blog/tags"
        >
          <Badge className={`flex-shrink-0 snap-start text-sm py-1.5 px-3 cursor-pointer transition-colors ${normalizedSelectedTag === null
            ? 'text-foreground bg-main hover:bg-main/80'
            : 'text-body bg-muted hover:bg-muted/80'
            }`}>전체 ({allTags.length})</Badge>
        </Link>

        {allTags.map(({ tag, count }) => (
          <Link key={tag} href={`/blog/tags?tag=${tag}`} className="flex-shrink-0 snap-start">
            <Badge
              className={`text-sm py-1.5 px-3 cursor-pointer transition-colors ${normalizedSelectedTag === tag
                ? 'text-foreground bg-main hover:bg-main/80'
                : 'text-body bg-muted hover:bg-muted/80'
                }`}
            >
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}