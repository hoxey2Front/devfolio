import * as React from 'react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types/project';

export interface RecentProjectSectionProps {
  project: Project;
}

export function RecentProjectSection({ project }: RecentProjectSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-8 pl-4 border-l-4 border-main">최근 진행 프로젝트</h2>
      <ProjectCard project={project} isRecentProject={true} />
    </section>
  );
}