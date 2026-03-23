'use client';

import Link from "next/link";
import Image from 'next/image';
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useEffect, useState, useRef } from "react";
// Next.js의 현재 경로를 가져오기 위해 usePathname을 import 합니다.
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAdmin } from "@/contexts/AdminContext";

// 타입 정의 시 interface 사용 (사용자 요청 사항 반영)
interface HeaderProps {
  showMiniProfile: boolean;
}


import { ThemeToggle } from '@/components/common/ThemeToggle';

const Header = ({ showMiniProfile }: HeaderProps) => {
  // 현재 라우트 경로를 가져옵니다.
  const pathname = usePathname();
  const { isAdmin } = useAdmin();

  const [profileViewCount, setProfileViewCount] = useState<number>(0);
  // volume 상태는 변경되지 않지만, TS 경고를 피하기 위해 number 타입으로 명시
  const [volume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // useRef 타입 정의 시 interface 및 as 지양 규칙 준수 (HTMLAudioElement | null 명시)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 헤더 노출 여부 상태
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const touchStartY = useRef(0);

  // 1. Audio 객체 초기화 (최초 로드 시)
  useEffect(() => {
    // 클라이언트 사이드에서만 Audio 객체 생성
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('/audio/self_introduce.mp3');
      audioRef.current.loop = false;
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
    // isMuted와 volume이 변경될 때마다 Audio 객체 속성을 업데이트하도록 의존성 배열에 추가할 수도 있지만,
    // 초기화 로직이므로 빈 배열을 유지하고 싶다면 eslint-disable을 사용하거나,
    // 현재 로직상 isMuted와 volume이 바뀌면 다른 useEffect에서 처리하므로 여기서는 초기화만 담당합니다.
    // 하지만 경고를 없애기 위해 의존성에 추가하고 내부 로직을 방어적으로 작성하는 것이 좋습니다.
    // 여기서는 간단히 경고를 억제하거나 추가합니다. 
    // 사용자 요청이 'build pass'이므로 의존성을 추가해도 동작에 문제가 없는지 확인.
    // 이미 아래 useEffect들에서 속성 업데이트를 하고 있으므로, 여기서는 초기 생성만 담당.
    // 의존성을 추가하면 Audio 객체가 재생성될 수 있으므로 주의.
    // Audio 객체는 ref로 관리되므로 의존성이 바뀌어도 리렌더링 시 재실행되더라도 `!audioRef.current` 체크 때문에 중복 생성 안됨.
  }, [isMuted, volume]);

  // 2. Audio 객체의 muted 속성을 isMuted 상태에 동기화
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // 3. showMiniProfile 값이 변경될 때 오디오 재생/정지 시도
  useEffect(() => {
    if (audioRef.current) {
      if (showMiniProfile) {
        setProfileViewCount(prev => prev + 1);

        if (!isMuted) {
          audioRef.current.currentTime = 0;
          // .play()는 Promise를 반환합니다.
          audioRef.current.play().catch(error => {
            // 'AbortError'는 사용자의 상호작용 없이 자동 재생이 차단될 때 발생할 수 있습니다.
            if (error.name !== 'AbortError') {
              console.warn("Audio play attempt failed on showMiniProfile change:", error.name);
            }
          });
        }
      } else {
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    }
  }, [showMiniProfile, isMuted]); // isMuted를 추가하여 오디오 재생 결정 시 최신 상태를 참조하도록 함

  // 스크롤/휠/스와이프 방향 감지 로직
  useEffect(() => {
    // 1. 일반적인 스크롤 감지 (블로그 등 일반 페이지용)
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // 아래로 50px 이상 스크롤했고, 이전보다 더 내려갔다면 숨김
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    // 2. 휠 이벤트 감지 (랜딩페이지 Swiper 및 일반 페이지 겸용)
    const handleWheel = (e: WheelEvent) => {
      // deltaY > 0 이면 아래로 스크롤 (내림)
      if (e.deltaY > 5) {
        setIsVisible(false);
      } else if (e.deltaY < -5) {
        setIsVisible(true);
      }
    };

    // 3. 터치 이벤트 감지 (모바일용 스와이프)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (deltaY > 10) {
        setIsVisible(false); // 아래로 스와이프 -> 숨김
      } else if (deltaY < -10) {
        setIsVisible(true);  // 위로 스와이프 -> 보임
      }
      touchStartY.current = touchEndY;
    };

    // 4. Swiper 전용 커스텀 이벤트 감지
    const handleSwiperScroll = (e: any) => {
      if (e.detail?.direction === 'down') {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // capture: true를 사용하여 Swiper의 stopPropagation을 우회합니다.
    window.addEventListener('wheel', handleWheel, { capture: true, passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { capture: true, passive: true });
    window.addEventListener('swiperScroll', handleSwiperScroll as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('swiperScroll', handleSwiperScroll as EventListener);
    };
  }, []);

  // 4. 아이콘 클릭 시 오디오 **토글** 및 **재생/일시정지** 핸들러
  const handleIconClick = () => {
    const willBeMuted = !isMuted;
    setIsMuted(willBeMuted);

    if (audioRef.current) {
      // 🚨 원본 코드의 'f(!willBeMuted)'를 유효한 JavaScript 구문 'if (!willBeMuted)'로 수정했습니다.
      if (!willBeMuted) {
        // 음소거 해제 시 재생 시작
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Audio play failed on explicit click:", error);
          }
        });
      } else {
        // 음소거 설정 시 정지
        audioRef.current.pause();
      }
    }

    setProfileViewCount(prev => prev + 1);
  };

  const VolumeIcon = isMuted ? VolumeOff : Volume2;
  const animateProps = isMuted ? {
    animateOnView: false,
    animateOnHover: false,
  } : {
    animateOnView: showMiniProfile,
    animateOnHover: true,
  };


  // **경로 비교 함수**
  const isLinkActive = (href: string) => {
    // pathname이 정확히 일치하거나, pathname이 href로 시작하는지 확인 (중첩 라우트 고려)
    // 예: href가 '/portfolio' 일 때, pathname이 '/portfolio' 또는 '/portfolio/detail/1' 이면 활성화
    return pathname === href || pathname.startsWith(`${href}/`);
  };


  return (
    <header
      className="fixed top-0 z-40 w-full flex flex-col transition-colors duration-300"
    >
      {/* 1층: 로고 및 미니 프로필 - 항상 보임 */}
      <div className="flex w-full h-16 md:h-20 items-center justify-between px-6 md:px-10 border-b border-border/10 bg-background/80 backdrop-blur-md">
        {/* 로고 (좌측) - 심플한 색상 효과 */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl lg:text-3xl font-black text-foreground group-hover:text-main transition-colors duration-300 tracking-wider">
            Devfolio<span className="text-main">.</span>
          </span>
        </Link>

        {/* 미니 프로필 (우측) */}
        <div
          className={`
              flex items-center gap-1 rounded-full 
              transition-all duration-500 origin-right
              ${showMiniProfile ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}
            `}
        >
          {/* 텍스트 (모바일 숨김) */}
          <div className="hidden sm:block text-xs lg:text-sm font-bold text-body mr-3 group">
            안녕하세요! <span className="text-main">Front-End 개발자</span> 장한옥입니다.
          </div>

          {/* 이미지 컨테이너 */}
          <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
            <motion.div
              className="absolute inset-0 rounded-full bg-main"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative w-full h-full rounded-full flex-shrink-0 border-2 border-background ring-1 ring-main/50 hover:ring-main/80 transition-all group z-10 backdrop-blur">
              <Image
                src="/image/nomad_coder_happy.png"
                width={32}
                height={32}
                alt="Mini profile"
                unoptimized={true}
                className="rounded-full object-cover w-full h-full"
              />
              <AnimateIcon
                key={profileViewCount}
                onClick={handleIconClick}
                {...animateProps}
                animateOnViewOnce={false}
                className="absolute -bottom-2 -right-2 rounded-full bg-main text-background hover:bg-main/80 transition-all cursor-pointer p-1"
              >
                <VolumeIcon className={'h-3 w-3 lg:h-3.5 lg:w-3.5'} />
              </AnimateIcon>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${isVisible ? 'flex' : 'hidden'} w-full overflow-hidden bg-background/60 backdrop-blur-sm border-b border-border/10 items-center justify-between px-6 md:px-10 h-12 md:h-14`}
      >
        <nav className="flex items-center space-x-6 md:space-x-8 text-sm lg:text-base font-bold">
          {/* 포트폴리오를 랜딩페이지에 통합했으므로 메인으로 가도록 처리, 블로그는 그대로 유지 */}
          <Link
            href="/"
            className={`transition-colors duration-300 hover:text-main ${pathname === '/' ? 'text-main' : 'text-body'}`}
          >
            Home
          </Link>
          <Link
            href="/blog"
            className={`transition-colors duration-300 hover:text-main ${isLinkActive('/blog') ? 'text-main' : 'text-body'}`}
          >
            Blog
          </Link>
          {isAdmin && (
            <Link
              href="/admin/stats"
              className={`transition-colors duration-300 hover:text-main ${isLinkActive('/admin/stats') ? 'text-main' : 'text-body'}`}
            >
              Stats
            </Link>
          )}
        </nav>

        {/* 테마 토글 버튼 추가 */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;