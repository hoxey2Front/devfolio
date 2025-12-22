'use client';

import { useState, use } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { TiptapViewer } from '@/components/editor/TiptapViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TimelinBadge } from '@/components/common/TimelinBadge';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ArrowLeft className="animate-pulse size-12 text-muted-foreground" />
          <p className="text-muted-foreground">포스트를 불러오는 중입니다...</p>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            블로그로 돌아가기
          </Link>

          {/* 관리자 전용 버튼 */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 h-8 text-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                수정
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2 h-8 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content with TOC */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-16">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Post Header */}
            <header className="mb-10">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-main mb-6 leading-tight tracking-tight">
                {post.title}
              </h1>

              <div className="flex justify-between items-center gap-3 mb-6">
                <TimelinBadge createdAt={post.publishedAt} strict={true} />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="primary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="text-sm sm:text-base text-muted-foreground border-l-4 border-border pl-4 leading-relaxed">
                {post.summary}
              </p>
            </header>

            {/* Divider */}
            <div className="border-t border-border mb-12" />

            {/* Post Content */}
            <div className="prose-container">
              <TiptapViewer content={post.content} />
            </div>
          </article>

          {/* Table of Contents - Desktop only */}
          <aside className="hidden xl:block w-64 shrink-0">
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
