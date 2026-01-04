'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { List, Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // DOM에서 실제 헤딩 요소 찾기
    const extractHeadings = () => {
      const editorElement = document.querySelector('.tiptap-viewer');
      if (!editorElement) return;

      const headingElements = editorElement.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((heading) => {
        if (heading.id) {
          const level = parseInt(heading.tagName.charAt(1));
          const text = heading.textContent || '';
          extractedHeadings.push({ id: heading.id, text, level });
        }
      });

      setHeadings(extractedHeadings);
    };

    // DOM이 준비될 때까지 대기 (TiptapViewer의 ID 생성이 100ms 후이므로 150ms로 설정)
    const timer = setTimeout(extractHeadings, 150);
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // 즉시 활성화 상태 업데이트 (스크롤 중에도 반영되도록)
      setActiveId(id);
      setIsMobileOpen(false);
    }
  };

  if (headings.length === 0) return null;

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn("space-y-1", isMobile && "px-2")}>
      {!isMobile && <p className="text-sm font-semibold text-foreground mb-4 pl-4 border-l-2 border-transparent">목차</p>}
      <div className={cn("border-l border-border/40", isMobile && "border-none")}>
        {headings.map(({ id, text, level }) => (
          <button
            key={id}
            onClick={() => handleClick(id)}
            className={cn(
              'block w-full text-left text-sm py-1.5 transition-all outline-none mb-1',
              !isMobile && 'border-l-2 -ml-px',
              activeId === id
                ? cn(
                  'text-primary font-medium bg-primary/5',
                  !isMobile && 'border-main'
                )
                : cn(
                  'text-muted-foreground hover:text-foreground hover:bg-muted/30',
                  !isMobile && 'border-transparent hover:border-main/50'
                ),
              level === 1 && (isMobile ? 'pl-2' : 'pl-4'),
              level === 2 && (isMobile ? 'pl-6' : 'pl-8'),
              level === 3 && (isMobile ? 'pl-10' : 'pl-12')
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden xl:block sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
        <NavContent />
      </nav>

      {/* Mobile/Tablet Floating Button & Overlay */}
      <div className="xl:hidden">
        <Dialog open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="fixed bottom-8 right-8 size-14 rounded-full shadow-2xl z-40 bg-primary text-primary-foreground hover:scale-110 active:scale-95 transition-transform"
            >
              <Menu className="size-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw] sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 mb-4">
                <List className="size-5 text-primary" />
                목차
              </DialogTitle>
            </DialogHeader>
            <NavContent isMobile={true} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
