'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TimelinBadge } from '@/components/common/TimelinBadge';
import { stripHtmlTags } from '@/lib/utils';
import { Post } from '@/types/post';

export interface BlogPostCardProps {
  post: Post;
  isSearchResult?: boolean;
  shadowEffect?: boolean;
}

export function BlogPostCard({ post, isSearchResult = false, shadowEffect }: BlogPostCardProps) {
  const contentClasses = isSearchResult
    ? ''
    : 'line-clamp-5 max-h-0 overflow-hidden group-hover:max-h-96 transition-all ease-in-out';

  const cardClasses = isSearchResult
    ? 'shadow-none hover:shadow-none hover:scale-100'
    : 'shadowEffect';

  const plainTextContent = stripHtmlTags(post.content);

  return (
    <Link
      href={`/blog/${post.id}`}
      key={post.id}
      onClick={isSearchResult ? () => { } : undefined}
      className="block"
    >
      <motion.div initial="initial" whileHover="hover" className="h-full group">
        <Card className={cardClasses} shadowEffect={shadowEffect}>
          <CardHeader>
            <CardTitle className='flex justify-between'>
              <span className='text-base text-foreground lg:text-lg leading-8 break-words group-hover:text-main transition-colors duration-300'>
                {post.title}
              </span>
              <TimelinBadge createdAt={post.publishedAt} strict={false} />
            </CardTitle>
            <CardDescription>
              {post.summary}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="primary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            {!isSearchResult && (
              <div className={`${contentClasses}`}>
                {plainTextContent}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}