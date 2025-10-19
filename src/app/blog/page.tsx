'use client';

import { usePosts } from '@/hooks/usePosts';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function BlogPage() {
  const { data: posts, isLoading, isError } = usePosts();

  if (isLoading) {
    return (
      <div className="w-full px-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Blog</h1>
        <p className="text-lg text-muted-foreground mt-2 mb-8">
          제가 작성한 블로그 포스트들을 소개합니다.
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

  if (isError || !posts) {
    return <div className="text-center py-10 text-red-500">프로젝트 목록을 가져오는 데 문제가 발생했습니다.</div>;
  }

  return (
    <div className="w-full px-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Blog</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        제가 작성한 블로그 포스트들을 소개합니다.
      </p>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link href={`/portfolio/${post.id}`} key={post.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* TODO: 썸네일 이미지는 추후 추가 */}
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.summary}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}