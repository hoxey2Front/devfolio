'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import React, { useCallback, useEffect } from 'react';
// 1. framer-motion 임포트
import { motion, useInView, useAnimation, Variants } from 'framer-motion';

// 아이콘: lucide-react에서 임시로 사용
import { GitBranch, Type, Code, Rocket, Mail, Phone, Rss, Github, Book, FlaskConical, Database, TreePalm } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      "중소기업 맞춤형 AWS 서비스 이해",
      "AWS 보안 개념 학습",
      "핸즈온 실습: AI 에이전트 구축",
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
  { name: 'Supabase', icon: Database },
  { name: 'Storybook', icon: Book },
  { name: 'Jest', icon: FlaskConical },
  { name: 'Husky', icon: GitBranch },
  { name: 'Tanstack-query', icon: TreePalm },
];

/**
 * 컴포넌트가 뷰포트에 들어올 때 fade-in 애니메이션을 적용하는 래퍼 컴포넌트
 */
const AnimateOnScroll: React.FC<{ children: React.ReactNode, id: string }> = ({ children, id }) => {
  const ref = React.useRef(null);
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
        <div className="w-full max-w-4xl px-4 py-12 lg:py-20 space-y-12">

          {/* 헤더/프로필 섹션 - 초기 로드 애니메이션 적용 */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={profileVariants}
            className="space-y-4 text-center"
          >
            <div className="w-32 h-32 rounded-full mx-auto overflow-hidden">
              <Image
                src="/image/nomad_coder.png"
                width={500}
                height={500}
                alt="profile"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white">장한옥</h1>
            <div id="in-view-detector" className="h-1 bg-transparent w-full -mt-2" />
            <p className="text-lg sm:text-xl font-medium text-indigo-400">Front-End Developer</p>

            <p className="text-base sm:text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
              협업과 효율성으로 더 나은 서비스를 완성해나가는 개발자입니다.
            </p>

            {/* CTA 버튼 (PDF 생성 및 다운로드 기능 연결) */}
            <div className="flex justify-center gap-4 mt-6 print-hidden">
              <Button className='text-base font-semibold'>
                <Link href="mailto:hoxey2react@gmail.com" className='px-6 py-3'>
                  메일 보내기
                </Link>
              </Button>
              <Button
                variant={'outline'}
                onClick={handleDownloadPdf}
                className="px-6 py-3 text-base font-semibold"
              >
                PDF로 저장
              </Button>
            </div>
          </motion.div>

          <Separator className="my-8 bg-gray-700" />

          {/* 1. 간단소개 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="intro">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">☝️ 간단소개</h2>
            <p className="leading-relaxed text-base text-gray-400">
              저는 <b>사용자 경험</b>과 <b>성능 개선</b>에 집중하며 개발을 진행하고있습니다.
              최근 유행하는 트렌드를 공부해 프로젝트에 적용하려고 노력하고 있으며,
              <b>바이브 코딩</b>을 통해 필요한 곳에 시간을 투자하는 방식으로 개발하고 있습니다.
              앞으로도 협업과 효율성을 기반으로 더 나은 서비스를 만드는 개발자로 성장하겠습니다.
            </p>
          </AnimateOnScroll>

          <Separator className="my-8 bg-gray-700" />

          {/* 2. 저는 이런 사람이에요 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="iam">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">🙋 저는 이런 사람이에요</h2>
            <ul className="list-disc pl-5 text-base text-gray-400 space-y-3">
              <li>안녕하세요! <b>꾸준히 성장하는 개발자</b> 장한옥입니다.</li>
              <li>새로운 기술에 거부감이 없고 적극성을 갖고 참여합니다.</li>
              <li>단 한 줄의 코드라도 서비스의 가치를 담으려고 노력합니다.</li>
              <li>한 번 맡은 일은 끝까지 완수하기 위해 개인시간을 사용하는걸 마다하지 않습니다.</li>
            </ul>
          </AnimateOnScroll>

          <Separator className="my-8 bg-gray-700" />

          {/* 3. 스킬 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="skills">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">⚙️ 스킬</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {skills.map((skill) => (
                <motion.div // 개별 스킬 카드에도 stagger 효과를 위해 motion 적용
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-102
                    hover:-rotate-2 shadow-lg"
                >
                  <skill.icon className="w-8 h-8 text-indigo-400 mb-2" />
                  <span className="text-sm font-medium text-gray-200">{skill.name}</span>
                </motion.div>
              ))}
            </div>
          </AnimateOnScroll>

          <Separator className="my-8 bg-gray-700" />

          {/* 4. 교육 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="education">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">🎓 교육</h2>
            {educationData.map((item, index) => (
              <motion.div // 개별 교육 항목에도 stagger 효과를 위해 motion 적용
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                className="p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-102 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-base sm:text-lg text-indigo-400 font-bold">{item.course}</p>
                  <Badge variant={'secondary'} className='text-xs bg-gray-600 text-gray-200 mt-1 sm:mt-0'>
                    {item.period}
                  </Badge>
                </div>
                <ul className="list-disc pl-6 text-sm sm:text-base text-gray-400 space-y-1">
                  {item.details.map((detail, dIndex) => (
                    <li key={dIndex}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimateOnScroll>

          <Separator className="my-8 bg-gray-700" />

          {/* 5. 대회 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="prize">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">🏆 대회</h2>
            {prizeData.map((item, index) => (
              <motion.div // 개별 대회 항목에도 stagger 효과를 위해 motion 적용
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-102 space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-base sm:text-lg text-indigo-400 font-bold">{item.name}</p>
                  <Badge variant={'secondary'} className='text-xs bg-gray-600 text-gray-200 mt-1 sm:mt-0'>
                    {item.date}
                  </Badge>
                </div>
                <ul className="list-disc pl-6 text-sm sm:text-base text-gray-400 space-y-1">
                  {item.details.map((detail, dIndex) => (
                    <li key={dIndex}>{detail}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimateOnScroll>

          <Separator className="my-8 bg-gray-700" />

          {/* 6. 연락처 섹션에 애니메이션 적용 */}
          <AnimateOnScroll id="contact">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">📞 연락처</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* 연락처 Link 요소에도 애니메이션을 적용할 수 있으나, 가독성을 위해 AnimateOnScroll 내부에 둠 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Link href="tel:01032893377" className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-104
            hover:-rotate-2 group">
                  <Phone className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                  <div className="space-y-0">
                    <span className="font-semibold text-gray-200 block">전화번호</span>
                    <span className="text-sm text-gray-400 underline underline-offset-4">010-3289-3377</span>
                  </div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Link href="mailto:hoxey2react@gmail.com" className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-104
            hover:-rotate-2 group">
                  <Mail className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                  <div className="space-y-0">
                    <span className="font-semibold text-gray-200 block">이메일</span>
                    <span className="text-sm text-gray-400 underline underline-offset-4">hoxey2react@gmail.com</span>
                  </div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Link href="/blog" target='_blank' className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-104
            hover:-rotate-2 group">
                  <Rss className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                  <div className="space-y-0">
                    <span className="font-semibold text-gray-200 block">블로그</span>
                    <span className="text-sm text-gray-400 underline underline-offset-4">블로그 둘러보기</span>
                  </div>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <Link
                  href="https://github.com/hoxey2Front"
                  target='_blank'
                  className="flex items-center gap-3 p-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 transition-all duration-300 hover:scale-104
                            hover:-rotate-2 group">
                  <Github className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                  <div className="space-y-0">
                    <span className="font-semibold text-gray-200 block">깃허브</span>
                    <span className="text-sm text-gray-400 underline underline-offset-4">깃허브 둘러보기</span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </>
  );
}