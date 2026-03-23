'use client';

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Pagination } from 'swiper/modules';
import { motion, Variants } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';

import { Plus, GraduationCap, Briefcase, Settings, Dog, GitBranch } from 'lucide-react';
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiNextdotjs,
  SiReactquery, SiStorybook, SiJest, SiTailwindcss, SiSupabase,
} from 'react-icons/si';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import RotatingTyped from '@/components/common/RotatingTyped';
import Footer from '@/components/layout/Footer';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { useProjects } from '@/hooks/useProjects';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { Project } from '@/types/project';

// *******************************************************************
// 데이터
// *******************************************************************
const skills = [
  { name: 'HTML', icon: SiHtml5, level: '상', percentage: 90 },
  { name: 'CSS', icon: SiCss, level: '중', percentage: 70 },
  { name: 'JavaScript', icon: SiJavascript, level: '중', percentage: 75 },
  { name: 'TypeScript', icon: SiTypescript, level: '중', percentage: 75 },
  { name: 'React', icon: SiReact, level: '중', percentage: 75 },
  { name: 'Next.js', icon: SiNextdotjs, level: '중', percentage: 75 },
  { name: 'Tanstack-query', icon: SiReactquery, level: '상', percentage: 90 },
  { name: 'Storybook', icon: SiStorybook, level: '상', percentage: 90 },
  { name: 'Jest', icon: SiJest, level: '중', percentage: 65 },
  { name: 'Husky', icon: GitBranch, level: '중', percentage: 65 },
  { name: 'Tailwind', icon: SiTailwindcss, level: '상', percentage: 95 },
  { name: 'Supabase', icon: SiSupabase, level: '중', percentage: 65 },
];

const SkillBar = ({ name, icon: Icon, percentage, level }: { name: string, icon: any, percentage: number, level: string }) => (
  <div className="mb-0">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-main" />
        <span className="text-base md:text-lg font-bold text-foreground">{name}</span>
      </div>
      <span className="text-sm md:text-base font-bold text-main px-2 py-0.5 bg-main/10 rounded-full">{level}</span>
    </div>
    <div className="h-4 w-full bg-main/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="h-full bg-gradient-to-r from-main to-main/60 rounded-full"
      />
    </div>
  </div>
);

const careersData = [
  {
    company: '씨마켓플레이스',
    period: '2025.09 ~ 2025.09',
    details: [
      "세상의 모든 견적: SEMO 플랫폼 개발",
      "로그인, 회원가입, 격적 생성 페이지 제작",
      "openapi, orval을 활용한 api 생성 자동화 경험",
      "백엔드 node 개발자와 협업하여 api연결 및 오류해결"
    ]
  }
];

const educationData = [
  {
    course: "코드잇 스프린트 단기 심화 프론트엔드 9기 수료",
    period: "2025.04 ~ 2025.06",
    details: [
      "Next.js, TypeScript, Git, Storybook, Jest 심화",
      "팀 프로젝트 1개: 스토리텔링 플랫폼 WeWrite",
      "요구사항 기반 기술 통합 역량 향상",
    ],
  },
];

export default function Home() {
  const [swiper, setSwiper] = React.useState<any>(null);
  const { data: projects, isLoading } = useProjects();
  const { isAdmin } = useAdmin();
  const typedProjects: Project[] = (projects as Project[]) || [];

  const skillsRef = React.useRef<HTMLDivElement>(null);
  const experienceRef = React.useRef<HTMLDivElement>(null);

  // 프로젝트 날짜순 정렬 (최신순)
  const sortedProjects = [...typedProjects].sort((a, b) => {
    const aStart = a.period?.start ?? '';
    const bStart = b.period?.start ?? '';
    return bStart.localeCompare(aStart);
  });

  const profileVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  React.useEffect(() => {
    const handleRobustWheel = (e: WheelEvent, container: HTMLDivElement) => {
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isAtTop = container.scrollTop <= 0;
      const isAtBottom = Math.abs(container.scrollHeight - container.clientHeight - container.scrollTop) < 4;

      // 상단에서 위로 스크롤하거나, 하단에서 아래로 스크롤하는 경우 (경계를 넘어가는 시도)
      if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
        if (swiper) swiper.mousewheel.enable();
        return;
      }

      // 내부 콘텐츠를 스크롤 중인 경우 Swiper의 휠 동작을 일시 정지하고 네이티브 스크롤을 허용합니다.
      // 기본적으로 Swiper는 이벤트를 가로채므로, 경계에 도달하지 않았다면 Swiper를 끕니다.
      if (swiper) swiper.mousewheel.disable();
      e.stopPropagation();
    };

    const skillsEl = skillsRef.current;
    const experienceEl = experienceRef.current;

    const onSkillsWheel = (e: WheelEvent) => skillsEl && handleRobustWheel(e, skillsEl);
    const onExperienceWheel = (e: WheelEvent) => experienceEl && handleRobustWheel(e, experienceEl);

    if (skillsEl) skillsEl.addEventListener('wheel', onSkillsWheel, { passive: false });
    if (experienceEl) experienceEl.addEventListener('wheel', onExperienceWheel, { passive: false });

    return () => {
      if (skillsEl) skillsEl.removeEventListener('wheel', onSkillsWheel);
      if (experienceEl) experienceEl.removeEventListener('wheel', onExperienceWheel);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-background">
      <Swiper
        onSwiper={setSwiper}
        direction={'vertical'}
        slidesPerView={1}
        spaceBetween={0}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
          releaseOnEdges: true,
        }}
        pagination={{ clickable: true }}
        modules={[Mousewheel, Pagination]}
        onSlideChange={(swiper) => {
          const direction = swiper.activeIndex > swiper.previousIndex ? 'down' : 'up';
          window.dispatchEvent(new CustomEvent('swiperScroll', { detail: { direction } }));
        }}
        className="w-full h-full"
      >
        {/* Slide 1: Intro */}
        <SwiperSlide>
          <div className="flex flex-col items-center justify-center w-full h-full px-6 pt-32 md:pt-40 relative">
            <div id="in-view-detector" className="absolute top-20 h-10 w-full pointer-events-none" />
            <motion.div
              initial="hidden"
              animate="visible"
              variants={profileVariants}
              className="w-full max-w-4xl text-center flex flex-col items-center"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full bg-main"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background ring-2 ring-main/50 z-10">
                  <Image
                    src="/image/nomad_coder.png"
                    width={500}
                    height={500}
                    alt="profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black mb-4">
                장한옥 <span className="text-main">.</span>
              </h1>

              <RotatingTyped
                items={['Front-End 개발자', 'React.js 개발자', 'Full-Stack 개발자', 'Next.js 개발자']}
                speedMs={60}
                pauseMs={1600}
                className="text-xl md:text-2xl font-bold text-main mb-6 h-8"
              />

              <div className="max-w-2xl bg-card/50 p-6 md:p-8 rounded-2xl border border-border/50 backdrop-blur-sm shadow-sm">
                <p className="text-base md:text-lg text-body leading-relaxed mb-4 font-medium">
                  안녕하세요! <b className="text-foreground">꾸준히 성장하는 개발자</b> 장한옥입니다. <br className="hidden md:block" />
                  사용자 경험과 성능 개선에 집중하며, 최신 트렌드를 적재적소에 적용하기 위해 노력합니다.
                </p>
                <p className="text-sm md:text-base text-sub leading-relaxed">
                  새로운 기술에 거부감이 없고 적극성을 갖고 참여하며, <br className="hidden md:block" />
                  단 한 줄의 코드라도 서비스의 가치를 담으려고 노력합니다.
                </p>
              </div>
            </motion.div>
          </div>
        </SwiperSlide>

        {/* Slide 2: Technical Skills */}
        <SwiperSlide>
          <div
            ref={skillsRef}
            className="flex flex-col w-full h-full px-6 pt-32 md:pt-40 pb-12 max-w-6xl mx-auto overflow-y-auto overscroll-contain pr-2 custom-scrollbar"
            onMouseLeave={() => swiper?.mousewheel?.enable()}
          >
            <h2 className="text-3xl font-bold text-foreground mb-10 pl-4 border-l-4 border-main shrink-0 mt-4 md:mt-10">역량</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 pb-20">
              {skills.map((skill) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  icon={skill.icon}
                  percentage={skill.percentage}
                  level={skill.level}
                />
              ))}
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Experience & Education */}
        <SwiperSlide>
          <div
            ref={experienceRef}
            className="flex flex-col w-full h-full px-6 pt-32 md:pt-40 pb-12 max-w-6xl mx-auto overflow-y-auto overscroll-contain pr-2 custom-scrollbar"
            onMouseLeave={() => swiper?.mousewheel?.enable()}
          >
            <h2 className="text-3xl font-bold text-foreground mb-10 pl-4 border-l-4 border-main shrink-0 mt-4 md:mt-10">경험</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
              {/* 경력 */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-main" />
                  경력
                </h3>
                <div className="space-y-6">
                  {careersData.map((career, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="h-full group"
                    >
                      <Card shadowEffect className="h-full p-0 gap-0 overflow-hidden flex flex-col bg-background border-border/50 transition-all duration-300">
                        <div className="flex-1 flex flex-col gap-8 py-8 px-6">
                          <CardHeader className="p-0">
                            <CardTitle className='flex justify-between items-start text-base md:text-lg'>
                              <span className="font-bold text-main group-hover:text-main transition-colors duration-300">{career.company}</span>
                              <Badge variant="outline" className="text-xs md:text-sm shrink-0 border-main/30 text-main/80 bg-main/5">{career.period}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 flex-1">
                            <ul className="list-none pl-0 text-sm md:text-base text-body space-y-3">
                              {career.details.map((detail, dIndex) => (
                                <li key={dIndex} className="relative pl-5 leading-relaxed">
                                  <span className="absolute left-0 top-[0.7em] -translate-y-1/2 shrink-0 block w-1.5 h-1.5 rounded-full bg-main/60 group-hover:bg-main transition-colors duration-300" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 교육 */}
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-main" />
                  교육
                </h3>
                <div className="space-y-6">
                  {educationData.map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="h-full group"
                    >
                      <Card shadowEffect className="h-full p-0 gap-0 overflow-hidden flex flex-col bg-background border-border/50 transition-all duration-300">
                        <div className="flex-1 flex flex-col gap-8 py-8 px-6">
                          <CardHeader className="p-0">
                            <CardTitle className="flex justify-between items-start text-base md:text-lg">
                              <span className="font-bold text-main group-hover:text-main leading-tight transition-colors duration-300">{item.course}</span>
                              <Badge variant="outline" className="text-xs md:text-sm shrink-0 ml-2 border-main/30 text-main/80 bg-main/5">{item.period}</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0 flex-1">
                            <ul className="list-none pl-0 text-sm md:text-base text-body space-y-3">
                              {item.details.map((detail, dIndex) => (
                                <li key={dIndex} className="relative pl-5 leading-relaxed">
                                  <span className="absolute left-0 top-[0.7em] -translate-y-1/2 shrink-0 block w-1.5 h-1.5 rounded-full bg-main/60 group-hover:bg-main transition-colors duration-300" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4: Portfolio */}
        <SwiperSlide>
          <div className="flex flex-col w-full h-full pt-32 md:pt-40 pb-12 max-w-6xl mx-auto overflow-hidden">
            <div className="flex justify-between items-center mb-10 shrink-0 mt-4 md:mt-10 px-6 max-w-7xl mx-auto w-full">
              <h2 className="text-3xl font-bold text-foreground pl-4 border-l-4 border-main">프로젝트</h2>
              {isAdmin && (
                <Link href="/portfolio/editor">
                  <Button variant="outline" size="sm" className="gap-2 border-main text-main hover:bg-main hover:text-background">
                    <Plus className="size-4" />
                    프로젝트 추가
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-start relative">
              {isLoading ? (
                <div className="w-full text-center py-20 text-body">프로젝트를 불러오는 중...</div>
              ) : sortedProjects.length === 0 ? (
                <div className="w-full text-center py-20 text-body">
                  <p>등록된 프로젝트가 없습니다.</p>
                </div>
              ) : (
                <div className="relative flex overflow-hidden w-full">
                  {/* Ticker Animation Container */}
                  <div
                    className="flex gap-10 whitespace-nowrap animate-ticker py-10 px-4"
                    style={{
                      animationDuration: `${sortedProjects.length * 5}s`,
                    }}
                  >
                    {/* 프로젝트 리스트 2번 반복 (심리스한 연결을 위함) */}
                    {[...sortedProjects, ...sortedProjects].map((project, idx) => (
                      <div key={idx} className="w-[300px] md:w-[400px] shrink-0 pointer-events-auto">
                        <ProjectCard project={project} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4: Contact & Footer */}
        <SwiperSlide>
          <div className="flex flex-col items-center justify-center w-full h-full px-6 pt-32 md:pt-40 relative overflow-hidden bg-main/5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center z-10"
            >
              <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
                Let's <span className="text-main">Work Together</span>
              </h2>
              <p className="text-lg text-body mb-10 max-w-2xl mx-auto">
                언제든 편하게 연락주세요. 좋은 기회와 인연을 기다리고 있습니다.
              </p>

              <div className="w-full max-w-3xl">
                <Footer />
              </div>
            </motion.div>

            {/* 배경 장식 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-main/10 rounded-full blur-3xl -z-10 pointer-events-none" />
          </div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
}