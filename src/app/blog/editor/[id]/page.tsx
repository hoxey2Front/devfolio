'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types/post';
import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { supabase } from '@/lib/supabase';
import { mapPostFromSupabase } from '@/lib/mapper';
import { toast } from 'sonner';

// --- Types ---
type PostFormFields = {
  title: string;
  publishedAt: string;
  tags: string;
  summary: string;
  content: string;
  coverImage?: string;
};

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogEditPage({ params }: EditorPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormFields>({
    defaultValues: {
      title: '',
      publishedAt: '',
      tags: '',
      summary: '',
      content: '',
      coverImage: '',
    },
  });

  // 포스트 데이터 로드
  useEffect(() => {
    const allPosts = queryClient.getQueryData<Post[]>(['posts']);
    const post = allPosts?.find(p => p.id === id);

    if (post) {
      setValue('title', post.title);
      setValue('summary', post.summary);
      setValue('content', post.content);
      setValue('publishedAt', post.publishedAt.split('T')[0]);
      setValue('coverImage', post.coverImage || '');

      if (post.tags) {
        setTags(post.tags);
        setValue('tags', post.tags.join(', '));
      }
    }
  }, [id, queryClient, setValue]);

  // 태그 추가 핸들러
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedTag = tagInput.trim().replace(/^#/, '');
      if (trimmedTag && !tags.includes(trimmedTag)) {
        const newTags = [...tags, trimmedTag];
        setTags(newTags);
        setValue('tags', newTags.join(', '));
        setTagInput('');
      }
    }
  };

  // 태그 제거 핸들러
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    setValue('tags', newTags.join(', '));
  };

  const onSubmit: SubmitHandler<PostFormFields> = async (data) => {
    try {
      // Supabase 업데이트용 페이로드
      const updatePayload = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        published_at: new Date().toISOString(), // 수정 시 시간 업데이트 (선택 사항)
        tags: tags,
        // cover_image: data.coverImage,
      };

      const { data: updatedData, error } = await supabase
        .from('posts')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // React Query 캐시 업데이트
      const allPosts = queryClient.getQueryData<Post[]>(['posts']) || [];
      const updatedPost = mapPostFromSupabase(updatedData);

      const updatedPosts = allPosts.map(p => p.id === id ? updatedPost : p);
      queryClient.setQueryData(['posts'], updatedPosts);

      toast.success('포스트가 수정되었습니다!');
      router.push(`/blog/${id}`);
    } catch (error) {
      console.error('수정 실패:', error);
      toast.error('포스트 수정에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Actions */}
      <div className="sticky top-24 z-10 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">글 수정</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Cover Image */}
          {watch('coverImage') && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 group">
              <img
                src={watch('coverImage')}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setValue('coverImage', '')}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Title Input */}
          <Controller
            name="title"
            control={control}
            rules={{ required: '제목을 입력해주세요.' }}
            render={({ field }) => (
              <div>
                <input
                  {...field}
                  placeholder="제목 없음"
                  className="w-full text-5xl font-bold border-none bg-transparent outline-none px-0 py-2 placeholder:text-muted-foreground/40 text-foreground"
                  autoFocus
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-2">{errors.title.message}</p>
                )}
              </div>
            )}
          />

          {/* Tags Input with Badges */}
          <div className="space-y-3">
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="pl-3 pr-1 py-1 text-sm flex items-center gap-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="태그 (Enter로 추가)"
                  className="text-sm text-muted-foreground border-none shadow-none px-0 py-1 focus-visible:ring-0 placeholder:text-muted-foreground/40"
                />
              )}
            />
          </div>

          {/* Summary Input */}
          <Controller
            name="summary"
            control={control}
            rules={{
              required: '요약을 입력해주세요.',
              maxLength: {
                value: 300,
                message: '요약은 300자 이내로 작성해야 합니다.'
              }
            }}
            render={({ field }) => (
              <div>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="포스트 소개글을 작성하세요..."
                    className="text-lg text-muted-foreground border-none shadow-none px-0 py-2 focus-visible:ring-0 placeholder:text-muted-foreground/40"
                  />
                </div>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/300
                  </span>
                </div>
                {errors.summary && (
                  <p className="text-sm text-destructive mt-2">{errors.summary.message}</p>
                )}
              </div>
            )}
          />

          {/* Separator */}
          <div className="border-t border-border/60 my-8" />

          {/* Tiptap Editor */}
          <Controller
            name="content"
            control={control}
            rules={{ required: '내용을 입력해주세요.' }}
            render={({ field }) => (
              <div>
                <TiptapEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="내용을 입력하세요... (슬래시 명령어 사용 가능)"
                />
                {errors.content && (
                  <p className="text-sm text-destructive mt-2">{errors.content.message}</p>
                )}
              </div>
            )}
          />
        </form>
      </div>
    </div>
  );
}
