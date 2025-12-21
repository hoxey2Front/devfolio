// app/blog/editor/[id]/page.tsx
'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // 1. next/image import
import { useQueryClient } from '@tanstack/react-query';
import { Post } from '@/types/post';
import * as React from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { TiptapEditor, TiptapEditorRef } from '@/components/editor/TiptapEditor';
import { supabase } from '@/lib/supabase';
import { mapPostFromSupabase } from '@/lib/mapper';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface PostFormFields {
  title: string;
  publishedAt: string;
  tags: string;
  summary: string;
  content: string;
  coverImage?: string;
}

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function BlogEditPage({ params }: EditorPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const editorRef = React.useRef<TiptapEditorRef>(null);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isAiDialogOpen, setIsAiDialogOpen] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState('');

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
    // 캐시된 데이터를 사용합니다.
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
        // react-hook-form의 'tags' 필드 값 업데이트
        setValue('tags', newTags.join(', '));
        setTagInput('');
      }
    }
  };

  // 태그 제거 핸들러
  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    // react-hook-form의 'tags' 필드 값 업데이트
    setValue('tags', newTags.join(', '));
  };

  const handleGenerateAIImage = async () => {
    if (!aiPrompt.trim()) {
      toast.error('프롬프트를 입력해주세요.');
      return;
    }

    setIsAiDialogOpen(false);
    setIsGenerating(true);
    const toastId = toast.loading('AI 이미지를 생성 중입니다...');

    try {
      const genResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-msw-bypass': 'true'
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const data = await genResponse.json().catch(() => ({}));
      if (!genResponse.ok) {
        throw new Error(data.details || 'Generation failed');
      }
      const localUrl = data.url;

      const editor = editorRef.current?.getEditor();
      if (editor) {
        editor.chain().focus().setImage({ src: localUrl }).run();
      } else {
        const currentContent = watch('content');
        const newContent = `${currentContent}<p><img src="${localUrl}" alt="AI Generated Image" /></p>`;
        setValue('content', newContent);
      }

      setAiPrompt('');
      toast.success('AI 이미지가 생성되어 삽입되었습니다!', { id: toastId });
    } catch (error: any) {
      console.error('AI Image Gen Error:', error);
      toast.error(`이미지 생성에 실패했습니다: ${error.message}`, { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit: SubmitHandler<PostFormFields> = async (data) => {
    try {
      // Supabase 업데이트용 페이로드
      const updatePayload = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        published_at: new Date().toISOString(), // 수정 시 시간 업데이트 (선택 사항)
        tags: tags, // 로컬 state의 tags 배열 사용
        cover_image: data.coverImage,
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
      // mapPostFromSupabase는 mapPostFromSupabase(updatedData)로 호출되어야 합니다.
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

  const coverImage = watch('coverImage');

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Actions */}
      <div className="sticky top-0 z-10 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">글 수정</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isGenerating || isSubmitting}
              className='gap-2'
              onClick={() => setIsAiDialogOpen(true)}
            >
              <Sparkles className="size-4 text-amber-500" />
              AI 이미지 생성
            </Button>
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
              disabled={isSubmitting || isGenerating}
              // 폼 전체를 감싼 form 태그에 onSubmit이 설정되어 있으므로, 
              // 버튼에서는 onClick={handleSubmit(onSubmit)} 대신 type="submit"만 사용해도 됩니다.
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
          {coverImage && (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mb-8 group">
              {/* 1. next/image로 교체 */}
              <Image
                src={coverImage}
                alt="Cover"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
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
              // 2. 미사용 변수 `field` 제거 (field 대신 별도의 로컬 state를 사용하기 때문에)
              render={() => (
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
                  ref={editorRef}
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

      {/* AI Image Generation Dialog */}
      <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI 이미지 생성</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="생성하고 싶은 이미지에 대해 설명해주세요 (예: 우주를 유영하는 고양이, 사이버펑크 도시 야경...)"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsAiDialogOpen(false)}
              disabled={isGenerating}
            >
              취소
            </Button>
            <Button
              variant="gradient"
              type="button"
              onClick={handleGenerateAIImage}
              disabled={isGenerating || !aiPrompt.trim()}
            >
              {isGenerating ? '이미지 생성 중...' : '이미지 생성'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}