import * as React from 'react';
import { Project } from '@/types/project';
import { CoverFlow } from './CoverFlow';

export interface OtherProjectsGridProps {
  projects: Project[];
}

export function OtherProjectsGrid({ projects }: OtherProjectsGridProps) {
  return (
    <div className="py-20">
      <h2 className="text-2xl md:text-3xl font-bold mb-12 pl-4 border-l-4 border-main flex items-center gap-4 max-w-7xl mx-auto px-6">
        기타 프로젝트
      </h2>
      <CoverFlow projects={projects} />
    </div>
  );
}