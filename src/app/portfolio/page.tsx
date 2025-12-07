'use client';

import { useProjects } from '@/hooks/useProjects';
import { Separator } from '@/components/ui/separator';

import { RecentProjectSection } from './_components/RecentProjectSection';
import { OtherProjectsGrid } from './_components/OtherProjectsGrid';
import { Project } from '@/types/project';
import { Skeleton } from '@/components/ui/skeleton';
import GradientHeadline from '@/components/common/GradientHeadline';
import ReloadButton from '@/components/common/ReloadButton';
import { EmptyState } from '@/components/common/EmptyState';
import { FolderOpen } from 'lucide-react';


import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PortfolioPage() {
  const { data: projects, isLoading, isError } = useProjects();
  const { isAdmin } = useAdmin();

  if (isLoading) {
    // ... (existing skeleton code) ...
    const recentSkeleton = (
      <div className="p-6 rounded-lg">
        <div className='flex justify-between'>
          <Skeleton className="h-6 w-2/4 mb-3 bg-muted" />
          <Skeleton className="h-6 w-1/4 mb-3 bg-muted" />
        </div>
        <Skeleton className="h-4 w-1/4 mb-2 bg-main" />
        <Skeleton className="h-4 w-5/6 mb-2 bg-muted" />
        <Skeleton className="h-4 w-5/6 mb-2 bg-muted" />
        <Skeleton className="h-4 w-5/6 mb-2 bg-muted" />
        <div className='flex justify-between mt-4'>
          <Skeleton className="h-6 w-1/4 mb-2 bg-muted" />
          <Skeleton className="h-6 w-1/4 mb-2 gradient-bg" />
        </div>
      </div>
    );

    return (
      <div className="w-full max-w-7xl mx-auto px-6 pb-12">
        <h1 className="text-4xl font-extrabold tracking-wide lg:text-5xl gradient-text w-fit">Portfolio</h1>
        <p className="text-base md:text-lg lg:text-lg text-body mt-4 mb-12">
          제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
        </p>

        <Separator />

        {/* 최근 진행 프로젝트 섹션 스켈레톤 */}
        <div className='mb-8 pl-4 border-l-4 border-main'>
          <Skeleton className="h-8 w-1/2  bg-muted" />
        </div>
        <div className="bg-card hover:shadow-lg transition-shadow">
          {recentSkeleton}
        </div>

        <Separator className='my-12' />

        {/* 기타 프로젝트 섹션 스켈레톤 */}
        <div className='mb-8 pl-4 border-l-4 border-main'>
          <Skeleton className="h-8 w-1/2  bg-muted" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="bg-card hover:shadow-lg transition-all">
              {recentSkeleton}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6">
        <GradientHeadline text={"Portfolio"} />
        <p className="text-base md:text-lg lg:text-lg text-body mt-4 mb-12">
          제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
        </p>
        <Separator />
        <div className="py-32 text-center">
          <p className="text-lg text-destructive mb-6">
            프로젝트를 불러오는 중 에러가 발생했습니다.
          </p>
          <ReloadButton buttonText="새로고침" />
        </div>
      </div>
    );
  }

  // projects를 Project[] 타입으로 단언 (useProjects 훅에 의존)
  const typedProjects: Project[] = projects as Project[];

  // 최신 프로젝트 선택: period.start 기준 내림차순
  const sorted = [...typedProjects].sort((a, b) => {
    // period가 null/undefined인 경우를 대비한 안전한 접근
    const aStart = a.period?.start ?? '';
    const bStart = b.period?.start ?? '';
    return bStart.localeCompare(aStart);
  });

  const recentProject = sorted[0];
  const otherProjects = sorted.slice(1);

  if (!recentProject) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 pb-12">
        <div className="flex justify-between items-start mb-12">
          <div>
            <GradientHeadline text={"Portfolio"} />
            <p className="text-base md:text-lg lg:text-lg text-body mt-4">
              제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
            </p>
          </div>
          {isAdmin && (
            <Link href="/portfolio/editor">
              <Button variant="gradient" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                프로젝트 추가
              </Button>
            </Link>
          )}
        </div>
        <Separator />
        <EmptyState
          message="등록된 프로젝트가 없습니다."
          icon={FolderOpen}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 pb-12">
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wide lg:text-5xl gradient-text w-fit">Portfolio</h1>
          <p className="text-base md:text-lg lg:text-lg text-body mt-4">
            제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
          </p>
        </div>
        {isAdmin && (
          <Link href="/portfolio/editor">
            <Button variant="gradient" size="sm" className="gap-2">
              <Plus className="size-4.5" />
              프로젝트 추가
            </Button>
          </Link>
        )}
      </div>

      <Separator />

      {/* 1. 최근 진행 프로젝트 섹션 */}
      <RecentProjectSection project={recentProject} />

      <Separator />

      {/* 2. 기타 프로젝트 그리드 */}
      <OtherProjectsGrid projects={otherProjects} />

    </div>
  );
}