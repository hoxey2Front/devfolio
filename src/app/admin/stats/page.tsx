'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, Clock, Zap, Monitor, MousePointerClick, Info, Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminStatsPage() {
  const { isAdmin, isInitialLoading } = useAdmin();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{
    overview: { label: string; value: string; icon: any; color: string }[];
    topPosts: any[];
    performance: any[];
    device: any[];
    interactions: any[];
  } | null>(null);

  useEffect(() => {
    // 인증 로딩 중이면 대기
    if (isInitialLoading) return;

    if (!isAdmin) {
      router.push('/');
      return;
    }

    async function fetchStats() {
      try {
        setIsLoading(true);

        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString();

        // 1. 전체 데이터 페칭
        const [analyticsRes, postsRes] = await Promise.all([
          supabase.from('analytics').select('*').gte('created_at', thirtyDaysAgo),
          supabase.from('posts').select('id, title')
        ]);

        if (analyticsRes.error) throw analyticsRes.error;
        if (postsRes.error) throw postsRes.error;

        const data = analyticsRes.data;
        const posts = postsRes.data;
        const postTitleMap: Record<string, string> = {};
        posts.forEach(p => { postTitleMap[p.id] = p.title; });

        // 2. 가공 로직
        const pageViews = data.filter(d => d.type === 'page_view');
        const clicks = data.filter(d => d.type === 'click');
        const vitals = data.filter(d => d.type === 'web_vitals');

        // 인기 포스트 (Top 5)
        const blogViews = pageViews.filter(v => v.path?.startsWith('/blog/'));
        const postCounts: Record<string, number> = {};
        blogViews.forEach(v => {
          const path = v.path || 'unknown';
          postCounts[path] = (postCounts[path] || 0) + 1;
        });
        const topPosts = Object.entries(postCounts)
          .map(([path, views]) => {
            const id = path.replace('/blog/', '');
            return { 
              name: postTitleMap[id] || id, // 타이틀이 없으면 ID 유지
              views 
            };
          })
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);

        // 성능 지표 (일자별 LCP 평균)
        const perfMap: Record<string, { lcp: number; count: number }> = {};
        vitals.filter(v => v.event_name === 'LCP').forEach(v => {
          const d = new Date(v.created_at);
          // 로컬 시간 기준으로 YYYY-MM-DD 키 생성
          const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          
          if (!perfMap[dateKey]) perfMap[dateKey] = { lcp: 0, count: 0 };
          perfMap[dateKey].lcp += (v.value?.value || 0);
          perfMap[dateKey].count += 1;
        });
        const performance = Object.entries(perfMap)
          .sort((a, b) => a[0].localeCompare(b[0])) // 날짜순 정렬
          .map(([dateStr, val]) => {
            const day = dateStr.split('-')[2]; // YYYY-MM-DD 에서 DD 추출
            return {
              time: `${parseInt(day)}일`, 
              lcp: Number((val.lcp / val.count / 1000).toFixed(2)), // ms -> s
              fcp: Number((val.lcp / val.count / 1000 * 0.7).toFixed(2)) // mock FCP
            };
          }).slice(-7);

        // 기기 통계
        const deviceCounts: Record<string, number> = { desktop: 0, mobile: 0, tablet: 0 };
        pageViews.forEach(v => {
          if (v.device) deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
        });
        const deviceData = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

        // 인터랙션
        const interactionCounts: Record<string, number> = {};
        clicks.forEach(c => {
          const name = c.event_name || 'unknown';
          interactionCounts[name] = (interactionCounts[name] || 0) + 1;
        });
        const interactions = Object.entries(interactionCounts).map(([action, count]) => ({ action, count }));

        // Overview 요약
        const uniqueVisitors = new Set(pageViews.map(v => v.session_id).filter(Boolean)).size;
        const avgLcp = vitals.length > 0 
          ? (vitals.filter(v => v.event_name === 'LCP').reduce((acc, curr) => acc + (curr.value?.value || 0), 0) / vitals.length / 1000).toFixed(2) 
          : '0.00';
        const totalViews = pageViews.length;
        const clickRate = totalViews > 0 ? ((clicks.length / totalViews) * 100).toFixed(1) : '0.0';

        setStats({
          overview: [
            { label: 'Unique Visitors', value: uniqueVisitors.toLocaleString(), icon: Users, color: 'text-blue-500' },
            { label: 'Click Count', value: clicks.length.toLocaleString(), icon: MousePointerClick, color: 'text-purple-500' },
            { label: 'Avg LCP', value: `${avgLcp}s`, icon: Zap, color: 'text-amber-500' },
            { label: 'Click Rate', value: `${clickRate}%`, icon: TrendingUp, color: 'text-emerald-500' },
          ],
          topPosts,
          performance,
          device: deviceData,
          interactions
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [isAdmin, isInitialLoading, router]);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 md:pt-36 flex items-center justify-center">
        <Loader2 className="animate-spin size-8 text-main" />
      </div>
    );
  }

  if (!isAdmin) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 md:pt-36 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin size-12 text-main" />
          <p className="text-muted-foreground animate-pulse font-medium">실시간 통계 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-36 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text w-fit">
            Real-time Analytics
          </h1>
          <p className="text-muted-foreground text-lg">
            최근 30일간의 실제 사용자 행동 및 성능 지표입니다.
          </p>
        </div>

        {/* 1. Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats?.overview.map((stat, i) => (
            <Card key={i} className="border-border/50 bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">Live data from Supabase</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 2. User Behavior */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                인기 포스트 Top 5
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {stats?.topPosts.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topPosts} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} fontSize={10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="views" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">데이터가 충분하지 않습니다.</div>
              )}
            </CardContent>
          </Card>

          {/* 3. Performance */}
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                웹 성능 트렌드 (LCP)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {stats?.performance.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.performance}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="time" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Line type="monotone" dataKey="lcp" stroke="#3b82f6" strokeWidth={2} name="LCP (s)" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">데이터가 충분하지 않습니다.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer Technical Commentary */}
        <Card className="border-main/20 bg-main/5 border-l-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-main text-lg font-bold">
              <Info className="w-5 h-5" />
              Technical Commentary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-body text-sm md:text-base leading-relaxed">
            <p>
              본 대시보드는 <strong>Supabase RLS(Row Level Security)</strong>가 적용된 테이블을 기반으로 제작되었습니다. 
              사용자의 모든 이벤트는 익명화되어 수집되며, Next.js의 <code>usePathname</code> 훅을 통해 페이지 전환을 감지하고 
              브라우저의 <code>PerformanceObserver</code> 인터페이스 데이터(Web Vitals)를 함께 전송하여 실제 성능 지표를 도출합니다.
            </p>
            <p>
              데이터 수집 시 <strong>Optimistic Tracking</strong> 기법을 고려하여, 추적 로직이 메인 스레드의 성능(FID/INP)에 영향을 주지 않도록 
              설계되었습니다. 수집된 기기 통계 및 브라우저 비율 데이터를 참고하여 향후 크로스 브라우징 대응 우선순위를 결정합니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
