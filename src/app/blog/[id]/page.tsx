'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { TiptapViewer } from '@/components/editor/TiptapViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TimelinBadge } from '@/components/common/TimelinBadge';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArrowLeft, Edit, Trash2, Loader2, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';
import { usePost } from '@/hooks/usePost';
import { useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = use(params);
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: post, isLoading, isError } = usePost(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 md:pt-36 animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="w-full bg-main/5 border-b border-border/30 pt-16 md:pt-24 pb-16 md:pb-24 mb-16 px-6">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <Skeleton className="h-12 w-32 rounded-full bg-muted mb-10" />
            <Skeleton className="h-12 w-full max-w-2xl bg-muted mb-10" />
            <div className="flex flex-col items-center gap-6">
              <Skeleton className="h-4 w-40 bg-muted/60" />
              <div className="flex gap-2">
                <Skeleton className="h-7 w-16 rounded-md bg-muted/40" />
                <Skeleton className="h-7 w-16 rounded-md bg-muted/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area Skeleton */}
        <div className="max-w-7xl mx-auto px-6 pb-32">
          <div className="flex flex-col xl:flex-row gap-16 relative">
            <article className="flex-1 max-w-3xl mx-auto w-full space-y-8">
              <div className="border-l-4 border-main/20 pl-8 space-y-3">
                <Skeleton className="h-6 w-full bg-muted/30" />
                <Skeleton className="h-6 w-4/5 bg-muted/30" />
              </div>
              <div className="space-y-4 pt-10">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full bg-muted/10" />
                ))}
                <Skeleton className="h-4 w-2/3 bg-muted/10" />
              </div>
            </article>
            <aside className="hidden xl:block w-72 shrink-0">
              <div className="space-y-6">
                <Skeleton className="h-4 w-24 bg-muted/40" />
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full bg-muted/20" />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    notFound();
  }

  // 삭제 핸들러 (다이얼로그 열기)
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // 삭제 확정 핸들러
  const handleDeleteConfirm = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // React Query 캐시 업데이트
      const currentPosts = queryClient.getQueryData<Post[]>(['posts']) || [];
      const updatedCachePosts = currentPosts.filter(p => p.id !== id);
      queryClient.setQueryData(['posts'], updatedCachePosts);

      toast.success('포스트가 삭제되었습니다.');
      setIsDeleteDialogOpen(false);
      router.push('/blog');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('포스트 삭제 중 오류가 발생했습니다.');
    }
  };

  // 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/blog/editor/${id}`);
  };

  // 읽기 시간 계산 (단어 수 기준, 평균 200 wpm)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36">
      {/* Hero Section */}
      <header className="w-full bg-main/5 border-b border-border/30 pt-16 md:pt-24 pb-16 md:pb-24 mb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border/50 text-xs font-bold text-main mb-10 hover:border-main transition-all group">
            <ArrowLeft className="size-3 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO BLOG</span>
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground mb-10 leading-[1.1] tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-4 text-sm md:text-base font-medium text-body/80">
              <TimelinBadge createdAt={post.publishedAt} strict={true} />
              <div className="w-1 h-1 rounded-full bg-border" />
              <span>장한옥</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {readingTime} min read
              </span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-bold px-3 py-1 bg-background text-main border border-border/50 hover:border-main transition-colors">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="flex flex-col xl:flex-row gap-16 relative">
          {/* Article */}
          <article className="flex-1 max-w-3xl mx-auto w-full min-w-0">
            {/* Summary / Lead Paragraph */}
            {post.summary && (
              <div className="mb-16">
                <p className="text-xl md:text-2xl text-body italic font-medium leading-relaxed border-l-4 border-main pl-8">
                  {post.summary}
                </p>
              </div>
            )}

            {/* Post Content */}
            <div className="prose-container">
              <TiptapViewer content={post.content} />
            </div>

            {/* Admin Actions at the bottom */}
            {isAdmin && (
              <div className="mt-20 pt-10 border-t border-border flex items-center justify-end gap-3">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 h-10 border-main text-main hover:bg-main hover:text-background"
                >
                  <Edit className="w-4 h-4" />
                  수정하기
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-2 h-10"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제하기
                </Button>
              </div>
            )}
          </article>

          {/* Table of Contents - Desktop Sidebar */}
          <aside className="hidden xl:block w-72 shrink-0 h-fit sticky top-40">
            <TableOfContents content={post.content} />
          </aside>
        </div>
      </div>

      {/* 삭제 확인 Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말로 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 포스트가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-background hover:bg-destructive/90">
              삭제하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
