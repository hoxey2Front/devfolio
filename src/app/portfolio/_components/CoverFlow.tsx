'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '@/types/project';
import { ProjectCard } from './ProjectCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CoverFlowProps {
  projects: Project[];
}

export function CoverFlow({ projects }: CoverFlowProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (!projects.length) return null;

  return (
    <div className="relative w-full overflow-hidden px-4 md:px-12">
      <div
        ref={containerRef}
        className="flex items-center justify-center min-h-[380px] perspective-[1000px] relative"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => {
            // 현재 인덱스를 기준으로 상대적인 위치 계산
            let position = index - currentIndex;

            // 순환 구조 처리 (아이템이 양쪽으로 무한히 이어지는 것처럼 보이게 하려면 복잡해지므로, 우선 선형 슬라이더 구조에 가깝게 구현)
            // 슬라이더의 양 끝에서 자연스럽게 넘어가도록 함
            if (position < -projects.length / 2) position += projects.length;
            if (position > projects.length / 2) position -= projects.length;

            const isCenter = position === 0;
            const absPosition = Math.abs(position);

            // 중앙에서 멀어질수록 투명도와 스케일 감소, 회전 효과 추가
            const opacity = Math.max(0, 1 - absPosition * 0.3);
            const scale = Math.max(0.7, 1 - absPosition * 0.15);
            const rotateY = position * 45; // 중앙 아이템은 0, 옆 아이템들은 회전
            const x = position * 200; // 좌우 간격 (화면 크기에 맞춰 조정 필요)
            const z = isCenter ? 0 : -200 + (-absPosition * 50); // 멀어질수록 뒤로

            // 중앙 아이템이 항상 가장 위에 오도록 zIndex 조정
            const zIndex = 100 - absPosition;

            return (
              <motion.div
                key={project.id}
                initial={false}
                animate={{
                  x,
                  z,
                  scale,
                  rotateY,
                  opacity,
                  zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 25,
                }}
                onClick={() => setCurrentIndex(index)}
                className="absolute w-full max-w-[350px] cursor-pointer preserve-3d"
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className={`transition-all duration-300 ${isCenter ? 'drop-shadow-[0_20px_50px_rgba(var(--main-rgb),0.3)] scale-105' : 'filter grayscale-[20%]'}`}>
                  <ProjectCard project={project} isRecentProject={false} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-6 mt-12">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="rounded-full hover:bg-main hover:text-white transition-colors border-2"
        >
          <ChevronLeft className="size-6" />
        </Button>
        <div className="flex gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 bg-main' : 'w-2 bg-muted hover:bg-muted-foreground'
                }`}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full hover:bg-main hover:text-white transition-colors border-2"
        >
          <ChevronRight className="size-6" />
        </Button>
      </div>
    </div>
  );
}
