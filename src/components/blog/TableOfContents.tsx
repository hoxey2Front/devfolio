'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    // DOM에서 실제 헤딩 요소 찾기
    const extractHeadings = () => {
      const editorElement = document.querySelector('.tiptap-viewer');
      if (!editorElement) return;

      const headingElements = editorElement.querySelectorAll('h1, h2, h3');
      const extractedHeadings: Heading[] = [];

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.charAt(1));
        const text = heading.textContent || '';
        const id = `heading-${index}`;

        // ID가 없으면 추가
        if (!heading.id) {
          heading.id = id;
        }

        extractedHeadings.push({ id: heading.id, text, level });
      });

      setHeadings(extractedHeadings);
    };

    // DOM이 준비될 때까지 대기
    const timer = setTimeout(extractHeadings, 200);
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    // Intersection Observer로 현재 보이는 헤딩 추적
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0.5,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // 헤더 높이 고려 (sticky header가 있다면)
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="hidden xl:block sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground mb-4 pl-4">목차</p>
        <div className="border-l border-border/40">
          {headings.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                'block w-full text-left text-sm py-1.5 transition-colors border-l-2 -ml-px',
                activeId === id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                level === 1 && 'pl-4',
                level === 2 && 'pl-8',
                level === 3 && 'pl-12'
              )}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
