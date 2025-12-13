import { Post } from '@/types/post';
import { Project } from '@/types/project';

export const mapPostFromSupabase = (data: unknown): Post => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid post data');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any; // after runtime check
  return {
    id: d.id,
    title: d.title,
    summary: d.summary,
    content: d.content,
    publishedAt: d.published_at,
    tags: d.tags || [],
    // coverImage: d.cover_image,
  };
};

export const mapProjectFromSupabase = (data: unknown): Project => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid project data');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;
  return {
    id: d.id,
    title: d.title,
    summary: d.summary,
    techStacks: d.tech_stacks || [],
    githubLink: d.github_link,
    deployLink: d.deploy_link,
    thumbnailUrl: d.thumbnail_url,
    description: d.description,
    period: {
      start: d.start_date,
      end: d.end_date,
    },
  };
};
