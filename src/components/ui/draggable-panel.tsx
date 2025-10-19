'use client';

import { Menu } from 'lucide-react';
import React from 'react';

export interface DraggablePanelProps {
  children: React.ReactNode;
  initialTop?: number; // px
  initialRight?: number; // px
  topBoundary?: number; // px: prevent overlapping header, default 60
  bottomBoundary?: number; // px: prevent overlapping footer, default 60
}

export default function DraggablePanel({ children, initialTop = 96, initialRight = 2, topBoundary = 72, bottomBoundary = 72 }: DraggablePanelProps) {
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<{ top: number; right: number }>({ top: initialTop, right: initialRight });
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const dragState = React.useRef<{ dragging: boolean; startX: number; startY: number; startTop: number; startRight: number }>({ dragging: false, startX: 0, startY: 0, startTop: initialTop, startRight: initialRight });

  const onPointerDown = (e: React.PointerEvent) => {
    // Only start drag with primary button/touch/pen
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startTop: position.top,
      startRight: position.right,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current.dragging) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    // Panel is positioned using top + right; moving right by dx means decreasing right by dx
    const nextTop = dragState.current.startTop + dy;
    const nextRight = dragState.current.startRight - dx;

    // Constrain to viewport bounds if possible
    const panel = panelRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = panel?.offsetWidth ?? 0;
    const height = panel?.offsetHeight ?? 0;

    const minTop = topBoundary; // prevent overlapping header area
    const maxTop = Math.max(minTop, vh - height - bottomBoundary);

    // Allow dragging beyond edge for collapse/expand
    const handleWidth = 32; // visible handle width when collapsed
    const minRight = -Math.max(0, width - handleWidth); // allow hiding beyond edge
    const maxRight = Math.max(0, Math.floor(vw * 0.1 - width)); // limit to rightmost 10%

    const clampedTop = Math.min(Math.max(nextTop, minTop), maxTop);
    const clampedRight = Math.min(Math.max(nextRight, minRight), maxRight);

    // Auto collapse/expand thresholds
    const collapseThreshold = minRight + 8;
    const expandThreshold = minRight + 20;

    if (clampedRight <= collapseThreshold && !isCollapsed) {
      setIsCollapsed(true);
      setPosition({ top: clampedTop, right: 0 });
      dragState.current.dragging = false;
      return;
    }
    if (clampedRight > expandThreshold && isCollapsed) {
      setIsCollapsed(false);
    }

    setPosition({ top: clampedTop, right: clampedRight });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragState.current.dragging = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={panelRef}
      className="hidden lg:block fixed z-40 transition-transform"
      style={{ top: position.top, right: position.right, transform: isCollapsed ? 'translateX(calc(100%))' : 'translateX(-12px)' }}
    >
      <div className="relative">
        {/* Drag handle stays visible when collapsed */}
        <div
          role="button"
          aria-label="드래그 핸들"
          className="absolute -left-8 top-0 h-8 w-8 rounded-l-md bg-background border border-r-0 flex items-center justify-center text-xs select-none cursor-grab active:cursor-grabbing py-4"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Menu size={15} />
        </div>
        {children}
      </div>
    </div>
  );
}


