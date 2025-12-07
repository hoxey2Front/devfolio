import * as React from 'react';
import { ProjectCard } from './ProjectCard';
import { Project } from '@/types/project';

export interface OtherProjectsGridProps {
  projects: Project[];
}

export function OtherProjectsGrid({ projects }: OtherProjectsGridProps) {
  return (
    <>
      <h2 className="text-xl md:text-2xl font-bold mb-8 pl-4 border-l-4 border-main flex items-center gap-4">
        기타 프로젝트
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} isRecentProject={false} />
        ))}
      </div>
    </>
  );
}