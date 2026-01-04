import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BlogPostCard } from './BlogPostCard';
import { Post } from '@/types/post';

export interface BlogSearchDialogProps {
  isSearchOpen: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
  filteredPosts: Post[];
  // 검색 후 Dialog를 닫기 위한 함수
  onPostSelect: () => void;
}

export function BlogSearchDialog({
  isSearchOpen,
  onOpenChange,
  query,
  onQueryChange,
  filteredPosts,
  onPostSelect,
}: BlogSearchDialogProps) {
  const dialogInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isSearchOpen) {
      // Dialog가 열릴 때 input에 포커스
      requestAnimationFrame(() => dialogInputRef.current?.focus());
    }
  }, [isSearchOpen]);

  return (
    <Dialog
      open={isSearchOpen}
      onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className='gradient-text inline font-bold'>블로그 검색</DialogTitle>
          <DialogDescription className='mt-2'>
            제목, 요약 내용으로 빠르게 블로그 글을 검색할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              ref={dialogInputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="검색어를 입력해주세요…"
              className="h-10 text-sm focus-visible:ring-sub focus-visible:ring-2 mt-4"
              aria-label="Dialog search input"
            />
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {filteredPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} onClick={onPostSelect}>
                <BlogPostCard post={post} isSearchResult />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}