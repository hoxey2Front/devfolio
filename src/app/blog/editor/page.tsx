'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, X } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';
import { mapPostFromSupabase } from '@/lib/mapper';
import { toast } from 'sonner';

interface PostFormFields {
  title: string;
  publishedAt: string;
  tags: string;
  summary: string;
  content: string;
  coverImage?: string;
}

// --- Main Component ---
export default function BlogEditor() {
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const todayDate = new Date().toISOString().substring(0, 10);

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormFields>({
    defaultValues: {
      title: '',
      publishedAt: todayDate,
      tags: '',
      summary: '',
      content: '',
      coverImage: '',
    },
  });

  // 태그 추가 핸들러
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // IME 조합 중이면 무시

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

  // 자동 저장
  const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'unsaved'>('saved');

  const handleSave = React.useCallback(() => {
    setSaveStatus('saving');
    const formData = watch();
    localStorage.setItem('blog-draft', JSON.stringify(formData));
    setTimeout(() => setSaveStatus('saved'), 500);
  }, [watch]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const formData = watch();
      if (formData.title || formData.content) {
        handleSave();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [handleSave, watch]);

  React.useEffect(() => {
    const saved = localStorage.getItem('blog-draft');
    if (saved) {
      const data = JSON.parse(saved);
      if (confirm('저장된 임시 글이 있습니다. 복구하시겠습니까?')) {
        setValue('title', data.title || '');
        setValue('summary', data.summary || '');
        setValue('content', data.content || '');
        setValue('tags', data.tags || '');

        if (data.tags) {
          const tagsArray = data.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t);
          setTags(tagsArray);
        }
      }
    }
  }, [setValue]);

  const onSubmit: SubmitHandler<PostFormFields> = async (data) => {
    try {

      const newPostPayload = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        published_at: new Date().toISOString(),
        tags: tags,
        cover_image: data.coverImage,
      };

      const { data: insertedData, error } = await supabase
        .from('posts')
        .insert(newPostPayload)
        .select()
        .single();

      if (error) throw error;

      const currentCachedPosts = queryClient.getQueryData<Post[]>(['posts']) || [];
      const newPost = mapPostFromSupabase(insertedData);
      const updatedCachedPosts = [newPost, ...currentCachedPosts];
      queryClient.setQueryData(['posts'], updatedCachedPosts);

      localStorage.removeItem('blog-draft');

      toast.success('포스트가 발행되었습니다!');

      router.push('/blog');
    } catch (error) {
      console.error('발행 실패:', error);
      toast.error('포스트 발행에 실패했습니다.');
    }
  };

  const coverImage = watch('coverImage');

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Actions */}
      <div className="sticky top-0 z-10 backdrop-blur-xs border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-foreground">새 글 작성</h1>
            <span className="text-xs text-muted-foreground">
              {saveStatus === 'saving' && '저장 중...'}
              {saveStatus === 'saved' && '저장됨'}
              {saveStatus === 'unsaved' && '저장되지 않음'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="gradient"
              size="sm"
              disabled={isSubmitting}
              className='gap-2'
              onClick={handleSubmit(onSubmit)}
            >
              <Send className='size-4' />
              {isSubmitting ? '발행 중...' : '발행하기'}
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
              {/* 2. next/image로 교체하여 LCP 경고 해결 */}
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
              // 4. 미사용 변수 `field` 제거
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