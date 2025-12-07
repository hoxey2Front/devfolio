import * as React from 'react';
import { Columns3, Rows3, Search, Tags, PenSquare } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Kbd } from './Kbd';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import GradientHeadline from '@/components/common/GradientHeadline';

// 타입 정의는 이전 답변에서 수정되었으므로 그대로 유지합니다.
export interface BlogHeaderProps {
  viewMode: 'grid' | 'list';
  onViewModeToggle: () => void;
  onSearchTrigger: () => void;
  isMac: boolean | null;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  showTags: boolean;
  onTagsToggle: () => void;
}

export function BlogHeader({
  viewMode,
  onViewModeToggle,
  onSearchTrigger,
  isMac,
  searchInputRef,
  showTags, // 사용하지 않지만 props로 받습니다.
  onTagsToggle,
}: BlogHeaderProps) {
  const { isAdmin } = useAdmin();
  const router = useRouter();

  // 트리거 인풋: onMouseDown으로 Dialog 열기 + blur
  const handleTriggerMouseDown: React.MouseEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault(); // 기본 포커스 방지
    onSearchTrigger();
    searchInputRef.current?.blur(); // 포커스 루프 차단
  };

  // 새 글 작성 버튼 클릭 핸들러
  const handleNewPost = () => {
    router.push('/blog/editor');
  };

  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <GradientHeadline text="Dev Blog" />
        {/* 관리자 로그인 시 새 글 작성 버튼 표시 */}
        {isAdmin && (
          <Button
            onClick={handleNewPost}
            variant="gradient"
            size="sm"
            className="flex items-center gap-2"
          >
            <PenSquare className="size-5" />
            <span className="hidden sm:inline">새 글 작성</span>
          </Button>
        )}
      </div>
      <div className='flex justify-between items-center mt-4 mb-12'>
        <p className="text-base md:text-lg lg:text-lg text-body">
          제가 작성한 블로그 포스트들을 소개합니다.
        </p>
        <div className="flex justify-end items-center gap-2 sm:gap-3 md:gap-4">
          {/* 데스크탑 검색 입력창 (트리거 역할) */}
          <InputGroup className="w-fit px-2 hidden sm:flex">
            <InputGroupAddon className="flex items-center shrink-0 max-w-55">
              <InputGroupInput
                ref={searchInputRef}
                placeholder="검색어 입력"
                aria-label="Search input"
                className="flex-1 cursor-pointer" // 클릭 가능함을 시각적으로 알리기 위해 cursor-pointer 추가
                onMouseDown={handleTriggerMouseDown}
                readOnly tabIndex={-1}
              />
              {isMac === null ? null : (
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  {isMac ? (
                    <>
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                    </>
                  ) : (
                    <>
                      <Kbd>Ctrl</Kbd>
                      <Kbd>K</Kbd>
                    </>
                  )}
                </span>
              )}
            </InputGroupAddon>
          </InputGroup>

          {/* 모바일 검색 아이콘 */}
          <Search
            className='sm:hidden text-muted-foreground hover:text-sub size-5 transition-all'
            onClick={onSearchTrigger}
          />
          <div className='flex gap-2 sm:gap-3 md:gap-4'>
            {/* 태그 링크 */}
            <div
              className={`cursor-pointer transition-all ${showTags ? 'text-main' : 'text-muted-foreground hover:text-sub'}`}
              onClick={onTagsToggle}
              aria-label="Toggle tag filter"
            >
              <Tags className='size-5 sm:size-5.5 md:size-6' />
            </div>
            {/* 뷰 모드 토글 */}
            {viewMode === 'list' ?
              <Columns3
                className={`size-5 sm:size-5.5 md:size-6 cursor-pointer transition-all text-muted-foreground hover:text-sub`}
                onClick={onViewModeToggle}
              />
              :
              <Rows3
                className={`size-5 sm:size-5.5 md:size-6 cursor-pointer transition-all text-muted-foreground hover:text-sub`}
                onClick={onViewModeToggle}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}