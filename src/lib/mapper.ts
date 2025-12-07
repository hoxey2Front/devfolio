import { Post } from '@/types/post';
import { Project } from '@/types/project';

export const mapPostFromSupabase = (data: any): Post => {
  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    publishedAt: data.published_at,
    tags: data.tags || [],
    // coverImage: data.cover_image, // DB 스키마에 추가되면 주석 해제
  };
};

export const mapProjectFromSupabase = (data: any): Project => {
  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    techStacks: data.tech_stacks || [],
    githubLink: data.github_link,
    deployLink: data.deploy_link,
    thumbnailUrl: data.thumbnail_url,
    description: data.description,
    period: {
      start: data.start_date,
      end: data.end_date,
    },
  };
};
