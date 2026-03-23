'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { stripHtmlTags } from '@/lib/utils';
import { Post } from '@/types/post';

export interface BlogPostCardProps {
  post: Post;
  isSearchResult?: boolean;
  shadowEffect?: boolean;
}

export function BlogPostCard({ post, isSearchResult = false, shadowEffect }: BlogPostCardProps) {
  const plainTextContent = stripHtmlTags(post.content);

  // 날짜 포맷 (예: 2025년 3월 19일)
  const d = new Date(post.publishedAt);
  const formattedDate = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  return (
    <Link
      href={`/blog/${post.id}`}
      key={post.id}
      onClick={isSearchResult ? () => { } : undefined}
      className="block h-full group"
    >
      <motion.div 
        whileHover={{ y: -5 }} 
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Card shadowEffect className="h-full flex flex-col border-border/40 bg-card transition-all duration-300 group-hover:border-main/30">
          <CardHeader className="flex-1 pb-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-xl font-bold leading-tight text-foreground group-hover:text-main line-clamp-2 transition-colors duration-300">
                {post.title}
              </CardTitle>
              <span className="text-xs font-medium text-caption/80">{formattedDate}</span>
            </div>
            <CardDescription className="mt-3 text-sm text-body leading-relaxed line-clamp-3">
              {post.summary || plainTextContent.slice(0, 100) + '...'}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0 pb-6">
            <div className="flex flex-wrap gap-1.5">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 bg-main/5 text-main/80 hover:bg-main/10 hover:text-main border-none transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}