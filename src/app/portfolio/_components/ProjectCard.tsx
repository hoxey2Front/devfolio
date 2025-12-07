'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, SquareArrowOutUpRight } from 'lucide-react';
import { Project } from '@/types/project';

export interface ProjectCardProps {
  project: Project;
  isRecentProject?: boolean; // 최근 프로젝트인 경우 (큰 카드)
}

export function ProjectCard({ project, isRecentProject = false }: ProjectCardProps) {

  const RecentProjectTitleClasses = isRecentProject ? 'flex justify-between gap-2' : 'flex justify-between md:flex-col gap-2'

  // 기타 프로젝트의 기술 스택은 호버 시에만 보이게 처리 (원본 코드 반영)
  const techStackClasses = 'flex flex-wrap gap-2 md:gap-1 mt-4'

  return (
    <motion.div initial="initial" whileHover="hover" className="h-full group">
      <Card shadowEffect className="h-full p-0 gap-0 overflow-hidden flex flex-col">
        {/* Thumbnail Section */}
        {project.thumbnailUrl && (
          <div className="w-full h-48 relative bg-muted/30 border-b border-border/50 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex-1 flex flex-col gap-8 py-8">
          <CardHeader>
            <CardTitle className={RecentProjectTitleClasses}>
              <span className='text-base lg:text-lg leading-8 break-words group-hover:text-main transition-all duration-300'>
                {project.title}
              </span>
              <Badge className='md:mt-2'>
                {project.period?.start} ~ {project.period?.end}
              </Badge>
            </CardTitle>
            <CardDescription>
              <div className='flex flex-wrap gap-2 md:gap-3 mt-2'>
                {/* 이 부분은 프로젝트 데이터에 따라 동적으로 처리하는 것이 좋지만, 원본 코드에 맞춰 하드코딩된 배지 유지 */}
                <Badge variant={'outline'}>팀프로젝트</Badge>
                <Badge variant={'outline'}>프론트엔드 4명</Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm leading-6 flex-1'>

            <p className="mb-2">{project.summary}</p>
            <div className={techStackClasses}>
              {project.techStacks.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>

          </CardContent>
          <CardFooter className='flex justify-between gap-4'>
            {project.githubLink && (
              <Button variant={'outline'} asChild>
                <Link className='flex gap-2' href={project.githubLink} target="_blank" rel="noreferrer noopener">
                  <Github className='size-4.5' fill='currentColor' /> <span>Github</span>
                </Link>
              </Button>
            )}
            {project.deployLink && (
              <Button asChild variant={'gradient'}>
                <Link className='flex gap-2' href={project.deployLink} target="_blank" rel="noreferrer noopener">
                  <SquareArrowOutUpRight className='size-4.5' /> <span>배포 링크</span>
                </Link>
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </motion.div >
  );
}