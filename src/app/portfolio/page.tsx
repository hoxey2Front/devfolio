'use client';

import { useProjects } from '@/hooks/useProjects';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, SquareArrowOutUpRight } from 'lucide-react';

export default function PortfolioPage() {
  const { data: projects, isLoading, isError } = useProjects();

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Portfolio</h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
        </p>
        <Separator className="mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="hover:shadow-lg transition-shadow">
              <div className="p-6 border rounded-lg">
                <Skeleton className="h-6 w-2/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-2" />
                <Skeleton className="h-4 w-1/2 mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !projects) {
    return <div className="text-center py-10 text-red-500">프로젝트 목록을 가져오는 데 문제가 발생했습니다.</div>;
  }

  // 최신 프로젝트 선택: period.start 기준 내림차순
  const sorted = [...projects].sort((a, b) => {
    const aStart = a.period?.start ?? '';
    const bStart = b.period?.start ?? '';
    return bStart.localeCompare(aStart);
  });
  const recentProject = sorted[0];
  const otherProjects = sorted.slice(1);

  return (
    <div className="w-full px-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Portfolio</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        제가 참여하고 개발한 주요 프로젝트들을 소개합니다.
      </p>
      <Separator className="mb-8" />

      {/* Recent Project */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">최근 진행 프로젝트</h2>
        <Card className="w-full mx-auto hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className='flex justify-between items-center'>
              <span>{recentProject.title}</span>
              <div className='flex gap-2 mt-2'>
                <Badge>팀프로젝트</Badge> <Badge>프론트앤드 4명</Badge>
              </div>
            </CardTitle>
            <CardDescription>
              {recentProject.period?.start} ~ {recentProject.period?.end}
            </CardDescription>
            <div className="mt-2 text-sm leading-6">
              <p className="mb-2">{recentProject.summary}</p>
              <ul className="list-disc pl-5 space-y-1">
                {/* 세부 기여사항은 필요 시 보강 */}
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                {recentProject.techStacks.map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-4">
                {recentProject.githubLink && (
                  <Button asChild>
                    <Link className='flex gap-2 text-xs' href={recentProject.githubLink} target="_blank" rel="noreferrer noopener">
                      <Github className='size-3.5' fill='currentColor' /> <span>Github</span>
                    </Link>
                  </Button>
                )}
                {recentProject.deployLink && (
                  <Button asChild>
                    <Link className='flex gap-2 text-xs' href={recentProject.deployLink} target="_blank" rel="noreferrer noopener">
                      <SquareArrowOutUpRight className='size-3.5' /> <span>배포 링크</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherProjects.map((project) => (
          <Card key={project.id} className="w-full mx-auto hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <span>{project.title}</span>
                <div className='flex gap-2 mt-2'>
                  <Badge>팀프로젝트</Badge> <Badge>프론트앤드 4명</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                {project.period?.start} ~ {project.period?.end}
              </CardDescription>
              <div className="mt-2 text-sm leading-6">
                <p className="mb-2">{project.summary}</p>
                <ul className="list-disc pl-5 space-y-1">
                  {/* 세부 기여사항은 필요 시 보강 */}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.techStacks.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  {project.githubLink && (
                    <Button asChild>
                      <Link className='flex gap-2 text-xs' href={project.githubLink} target="_blank" rel="noreferrer noopener">
                        <Github className='size-3.5' fill='currentColor' /> <span>Github</span>
                      </Link>
                    </Button>
                  )}
                  {project.deployLink && (
                    <Button asChild>
                      <Link className='flex gap-2 text-xs' href={project.deployLink} target="_blank" rel="noreferrer noopener">
                        <SquareArrowOutUpRight className='size-3.5' /> <span>배포 링크</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}