'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef } from 'react';
// 1. framer-motion 임포트
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

// 아이콘: lucide-react에서 임시로 사용
import { GitBranch, Type, Code, Rocket, Book, FlaskConical, Database, TreePalm, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RotatingTyped from '@/components/common/RotatingTyped';

// *******************************************************************
// 사용자 정의 타입/인터페이스 (사용자 요청: type 선언은 interface로)
// *******************************************************************
interface EducationItem {
  course: string;
  period: string;
  details: string[];
}

interface PrizeItem {
  name: string;
  date: string;
  details: string[];
}

interface Skill {
  name: string;
  icon: React.ElementType;
}

interface Career {
  company: string;
  period: string;
  details: string[];
}

// *******************************************************************
// 애니메이션 설정
// *******************************************************************
// Variants 인터페이스로 타입 명확히 함
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// *******************************************************************
// 데이터
// *******************************************************************
const educationData: EducationItem[] = [
  {
    course: "코드잇 스프린트 단기 심화 프론트엔드 9기 수료",
    period: "2025.04 ~ 2025.06",
    details: [
      "Next.js, TypeScript, Git, Storybook, Jest 심화",
      "팀 프로젝트 1개: 스토리텔링 플램폿 WeWrite",
      "요구사항 기반 기술 통합 역량 향상",
    ],
  },
];

const prizeData: PrizeItem[] = [
  {
    name: "AWS Onboarding Program",
    date: "2025.09.10",
    details: [
      "중소기업 맞춤형 AWS 서비스 이해",
      "AWS 보안 개념 학습",
      "핸즈온 실습: AI 에이전트 구축",
    ],
  },
  {
    name: "WRTN(뤼튼) 프롬프톤 대회",
    date: "2023.09.07",
    details: [
      "논코딩 프롬프트 툴 제작 경험",
      "여러 사람들의 아이디어를 통해 새로운 경험",
      "AI의 무궁무진한 확장성에 대해 생각해보는 시간을 가짐"
    ],
  },
];

const skills: Skill[] = [
  { name: 'HTML', icon: Code },
  { name: 'CSS', icon: Code },
  { name: 'JavaScript', icon: Code },
  { name: 'TypeScript', icon: Type },
  { name: 'React', icon: Rocket },
  { name: 'Next.js', icon: Rocket },
  { name: 'Tanstack-query', icon: TreePalm },
  { name: 'Storybook', icon: Book },
  { name: 'Jest', icon: FlaskConical },
  { name: 'Husky', icon: GitBranch },
  { name: 'Tailwind', icon: Paintbrush },
  { name: 'Supabase', icon: Database },
];

const careersData: Career[] = [
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
]

/**
 * 컴포넌트가 뷰포트에 들어올 때 fade-in 애니메이션을 적용하는 래퍼 컴포넌트
 */
const AnimateOnScroll: React.FC<{ children: React.ReactNode, id: string }> = ({ children, id }) => {
  const ref = useRef(null);
  // 뷰포트에 들어왔는지 확인
  const inView = useInView(ref, { once: true, amount: 0.2 }); // 한 번만 실행, 20%가 보일 때
  const controls = useAnimation(); // 애니메이션 제어

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      id={id}
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={sectionVariants}
      className="space-y-4 scroll-mt-20"
    >
      {children}
    </motion.div>
  );
};


export default function Home() {
  const handleDownloadPdf = useCallback(() => {
    // ⚠️ 중요: 이 방식은 브라우저의 '인쇄' 대화 상자를 엽니다.
    // 사용자는 대상(Destination)을 'PDF로 저장'으로 설정해야 합니다.
    window.print();
  }, []);

  // 프로필 섹션은 항상 보이므로 motion으로 감싸지만, useInView는 사용하지 않습니다.
  // 대신 초기 로드 애니메이션만 적용합니다.
  const profileVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };


  return (
    <>
      <div className="flex justify-center w-full min-h-screen">
        <div className="w-full max-w-6xl px-4 py-12 lg:py-20 space-y-12">

          {/* 헤더/프로필 섹션 - 초기 로드 애니메이션 적용 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={profileVariants}
          >
            <div className="space-y-2 md:space-y-3 lg:space-y-4 text-center">
              <div className="w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full mx-auto overflow-hidden ring-2 md:ring-3 border-2 md:border-3 border-background ring-sub">
                <Image
                  src="/image/nomad_coder.png"
                  width={500}
                  height={500}
                  alt="profile"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-black gradient-text tracking-wide inline">장한옥</h1>
              <div id="in-view-detector" className="h-1 bg-transparent w-full -mt-2" />
              <RotatingTyped
                items={['Front-End 개발자', 'React.js 개발자', 'Full-Stack 개발자', 'Next.js 개발자']}
                speedMs={60}
                pauseMs={1600}
                className="text-lg md:text-xl lg:text-2xl font-bold text-body"
              />


              <p className="text-sm md:text-base lg:text-lg text-body mt-2 max-w-2xl mx-auto">
                협업과 효율성으로 더 나은 서비스를 완성해나가는 개발자입니다.
              </p>

              {/* CTA 버튼 (PDF 생성 및 다운로드 기능 연결) */}
              <div className="flex justify-center gap-4 md:gap-6 lg:gap-8 mt-6 lg:mt-8 print-hidden">
                <Button
                  variant={"default"}
                  className='text-sm md:text-base lg:text-lg font-semibold'>
                  <Link href="mailto:hoxey2react@gmail.com" className='px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3'>
                    메일 보내기
                  </Link>
                </Button>
                <Button
                  variant={'outline'}
                  onClick={handleDownloadPdf}
                  className="px-2 py-1 md:px-4 md:py-2 lg:px-6 lg:py-3 text-sm md:text-base lg:text-lg font-semibold"
                >
                  PDF로 저장
                </Button>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* 1. 간단소개 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="intro">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">☝️ 간단소개</h2>
            <p className="leading-relaxed text-sm md:text-base text-body">
              저는 <b className="text-main">사용자 경험</b>과 <b className="text-main">성능 개선</b>에 집중하며 개발을 진행하고있습니다.
              최근 유행하는 트렌드를 공부해 프로젝트에 적용하려고 노력하고 있으며,
              <b className="text-main">바이브 코딩</b>을 통해 필요한 곳에 시간을 투자하는 방식으로 개발하고 있습니다.
              앞으로도 협업과 효율성을 기반으로 더 나은 서비스를 만드는 개발자로 성장하겠습니다.
            </p>
          </AnimateOnScroll>

          <Separator />

          {/* 2. 저는 이런 사람이에요 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="iam">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">🙋 저는 이런 사람이에요</h2>
            <ul className="list-disc pl-5 text-sm md:text-base text-body space-y-3">
              <li>안녕하세요! <b className="text-main">꾸준히 성장하는 개발자</b> 장한옥입니다.</li>
              <li>새로운 기술에 거부감이 없고 적극성을 갖고 참여합니다.</li>
              <li>단 한 줄의 코드라도 서비스의 가치를 담으려고 노력합니다.</li>
              <li>한 번 맡은 일은 끝까지 완수하기 위해 개인시간을 사용하는걸 마다하지 않습니다.</li>
            </ul>
          </AnimateOnScroll>

          <Separator />

          {/* 3. 스킬 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="skills">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">⚙️ 스킬</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    shadowEffect
                  >
                    <CardContent className='flex flex-col items-center justify-center'>
                      <skill.icon
                        className="w-6 h-6 md:w-9 md:h-9 text-sub group-hover:text-main mb-2 transition-colors"
                      />
                      <span className="text-xs md:text-sm whitespace-nowrap font-medium text-body">{skill.name}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimateOnScroll>

          <Separator className='my-8' />

          <AnimateOnScroll id='career'>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">🧑‍💼 경력</h2>
            {careersData.map((career, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                key={index}
              >
                <Card className="hover:scale-102">
                  <CardHeader>
                    <CardTitle className='flex justify-between'>
                      <span className="text-foreground text-base md:text-lg group-hover:text-main transition-all font-bold">{career.company}</span>
                      <Badge>
                        {career.period}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 text-sm md:text-base text-body space-y-1">
                      {career.details.map((detail, dIndex) => (
                        <li key={dIndex}>{detail}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimateOnScroll>

          <Separator />

          {/* 4. 교육 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="education">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">🎓 교육</h2>
            {educationData.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                key={index}
              >
                <Card className="hover:scale-102">
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span className="text-foreground text-base md:text-lg group-hover:text-main transition-all font-bold">{item.course}</span>
                      <Badge>
                        {item.period}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-6 text-sm md:text-base text-body space-y-1">
                      {item.details.map((detail, dIndex) => (
                        <li key={dIndex}>{detail}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimateOnScroll>

          <Separator />

          {/* 5. 대회 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="prize">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 pl-4 border-l-4 border-main">🏆 대회</h2>
            <div className='flex flex-col gap-6'>
              {prizeData.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  key={index}
                >
                  <Card className="hover:scale-102">
                    <CardHeader>
                      <CardTitle className="flex justify-between">
                        <span className="text-foreground md:text-lg group-hover:text-main transition-all font-bold">{item.name}</span>
                        <Badge>
                          {item.date}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 text-sm md:text-base text-body space-y-1">
                        {item.details.map((detail, dIndex) => (
                          <li key={dIndex}>{detail}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </>
  );
}