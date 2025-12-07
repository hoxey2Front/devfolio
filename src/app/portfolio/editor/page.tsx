'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { mapProjectFromSupabase } from '@/lib/mapper';
import { Project } from '@/types/project';
import GradientHeadline from '@/components/common/GradientHeadline';

type ProjectFormFields = {
  title: string;
  summary: string;
  techStacks: string;
  githubLink: string;
  deployLink: string;
  thumbnailUrl: string;
  description: string;
  startDate: string;
  endDate: string;
};

export default function PortfolioEditorPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [techStacks, setTechStacks] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormFields>({
    defaultValues: {
      title: '',
      summary: '',
      techStacks: '',
      githubLink: '',
      deployLink: '',
      thumbnailUrl: '',
      description: '',
      startDate: '',
      endDate: '',
    },
  });

  // ... (핸들러 함수들은 동일하게 유지)
  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedTech = techInput.trim();
      if (trimmedTech && !techStacks.includes(trimmedTech)) {
        const newStacks = [...techStacks, trimmedTech];
        setTechStacks(newStacks);
        setValue('techStacks', newStacks.join(', '));
        setTechInput('');
      }
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    const newStacks = techStacks.filter(tech => tech !== techToRemove);
    setTechStacks(newStacks);
    setValue('techStacks', newStacks.join(', '));
  };

  const onSubmit: SubmitHandler<ProjectFormFields> = async (data) => {
    try {
      const deployUrl = data.deployLink;
      let finalThumbnailUrl = data.thumbnailUrl;

      if (!finalThumbnailUrl && deployUrl) {
        finalThumbnailUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(deployUrl)}?w=800`;
      }

      const newProjectPayload = {
        title: data.title,
        summary: data.summary,
        tech_stacks: techStacks,
        github_link: data.githubLink,
        deploy_link: data.deployLink,
        thumbnail_url: finalThumbnailUrl,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
      };

      const { data: insertedData, error } = await supabase
        .from('projects')
        .insert(newProjectPayload)
        .select()
        .single();

      if (error) throw error;

      const currentProjects = queryClient.getQueryData<Project[]>(['projects']) || [];
      const newProject = mapProjectFromSupabase(insertedData);
      queryClient.setQueryData(['projects'], [newProject, ...currentProjects]);

      toast.success('프로젝트가 추가되었습니다!');
      router.push('/portfolio');
    } catch (error: any) {
      console.error('프로젝트 추가 실패:', error);
      toast.error(error.message || '프로젝트 추가에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <GradientHeadline text="프로젝트 추가" className="text-3xl" />
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="gap-2" variant="gradient">
              <Save className="size-5" />
              {isSubmitting ? '저장 중...' : '저장하기'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Basic Info (2 cols wide) */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">프로젝트 제목</label>
                    <Controller
                      name="title"
                      control={control}
                      rules={{ required: '제목을 입력해주세요.' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="프로젝트 제목을 입력하세요" className="text-lg" />
                      )}
                    />
                    {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Summary */}
                  <div>
                    <label className="block text-sm font-medium mb-2">한 줄 요약</label>
                    <Controller
                      name="summary"
                      control={control}
                      rules={{ required: '요약을 입력해주세요.' }}
                      render={({ field }) => (
                        <Input {...field} placeholder="프로젝트를 한 문장으로 설명해주세요" />
                      )}
                    />
                    {errors.summary && <p className="text-destructive text-sm mt-1">{errors.summary.message}</p>}
                  </div>

                  {/* Tech Stacks */}
                  <div>
                    <label className="block text-sm font-medium mb-2">기술 스택</label>
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {techStacks.length === 0 && (
                          <span className="text-muted-foreground text-sm">추가된 기술 스택이 없습니다.</span>
                        )}
                        {techStacks.map((tech) => (
                          <Badge key={tech} variant="secondary" className="gap-1 pl-2 pr-1 py-1 text-sm">
                            {tech}
                            <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors">
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleAddTech}
                        placeholder="기술 스택 입력 후 Enter (예: React, Next.js)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>상세 설명</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="프로젝트의 주요 기능, 개발 과정, 배운 점 등을 자유롭게 작성해주세요."
                        className="min-h-[300px] resize-y font-mono text-sm leading-relaxed"
                      />
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Details (1 col wide) */}
            <div className="space-y-8">
              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>프로젝트 링크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub Repository</label>
                    <Controller
                      name="githubLink"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="https://github.com/..." />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">배포 URL</label>
                    <Controller
                      name="deployLink"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="https://..." />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>진행 기간</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">시작일</label>
                    <Controller
                      name="startDate"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="date" />
                      )}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">종료일</label>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} type="date" />
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-1">* 진행 중이면 비워두세요.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-transparent">
                <CardHeader>
                  <CardTitle>썸네일</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Controller
                      name="thumbnailUrl"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="이미지 URL을 입력하세요 (비워두면 배포 URL로 자동 생성)"
                          onChange={(e) => {
                            field.onChange(e);
                            // 수동 입력 시 자동 생성 모드 해제 로직이 필요하다면 추가
                          }}
                        />
                      )}
                    />
                    {/* Preview */}
                    <div className="aspect-video rounded-md bg-muted flex items-center justify-center overflow-hidden border border-border/50 relative group">
                      {(() => {
                        const thumbUrl = watch('thumbnailUrl');
                        const deployUrl = watch('deployLink');

                        let previewUrl = thumbUrl;
                        if (!previewUrl && deployUrl) {
                          previewUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(deployUrl)}?w=800`;
                        }

                        if (previewUrl) {
                          return (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previewUrl}
                              alt="Thumbnail Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image';
                              }}
                            />
                          );
                        }
                        return <span className="text-muted-foreground text-sm">이미지 미리보기</span>;
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * 썸네일 URL을 비워두면 배포 URL을 기반으로 자동 생성됩니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
