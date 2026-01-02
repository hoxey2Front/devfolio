'use client';

import Link from "next/link";
import Image from 'next/image';
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useEffect, useState, useRef } from "react";
// Next.js의 현재 경로를 가져오기 위해 usePathname을 import 합니다.
import { usePathname } from "next/navigation";

// 타입 정의 시 interface 사용 (사용자 요청 사항 반영)
interface HeaderProps {
  showMiniProfile: boolean;
}

import { ShinyText } from '@/components/common/ShinyText';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const Header = ({ showMiniProfile }: HeaderProps) => {
  // 현재 라우트 경로를 가져옵니다.
  const pathname = usePathname();

  const [profileViewCount, setProfileViewCount] = useState<number>(0);
  // volume 상태는 변경되지 않지만, TS 경고를 피하기 위해 number 타입으로 명시
  const [volume] = useState<number>(0.3);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // useRef 타입 정의 시 interface 및 as 지양 규칙 준수 (HTMLAudioElement | null 명시)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ... (Audio 관련 useEffect 및 handler는 변경 없음) ...
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
    <header className="sticky top-0 z-40 w-full backdrop-blur transition-colors duration-500">
      <div className="flex w-full h-24 items-center justify-between px-6 md:px-10">

        {/* 1. 로고 (좌측) */}
        <Link
          href="/"
          className="transition-all"
        >
          <ShinyText
            text="Devfolio!"
            className="text-lg gradient-text lg:text-xl font-bold tracking-wide"
            initialColor="transparent"
          />
        </Link>

        {/* 2a. 프로필 섹션 (모바일-친화적 레이아웃) */}
        <div
          className={`
              flex items-center gap-1 rounded-full 
              transition-all duration-500 origin-top
              // showMiniProfile 상태에 따라 애니메이션 및 클릭 가능 여부 제어
              ${showMiniProfile ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}
            `}
        >
          {/* 이미지 컨테이너 (모든 해상도에서 표시) */}
          <div className="w-9 h-9 lg:w-12 lg:h-12 rounded-full flex-shrink-0 border-1 lg:border-2 border-transparent ring-2 ring-main relative hover:ring-main/80 transition-all group">
            <Image
              src="/image/nomad_coder_happy.png"
              width={32}
              height={32}
              alt="Mini profile"
              unoptimized={true}
              className="rounded-full object-cover w-full h-full"
            />
            {/* 스피커 아이콘 (모든 해상도에서 표시) */}
            <AnimateIcon
              key={profileViewCount}
              onClick={handleIconClick}
              {...animateProps}
              animateOnViewOnce={false}
              className="absolute -bottom-2 -right-2 rounded-full bg-main 
            group-hover:bg-main/80 transition-all cursor-pointer p-1"
            >
              <VolumeIcon className={'text-muted h-3 w-3 lg:h-3.5 lg:w-3.5 hover:opacity-80'} />
            </AnimateIcon>
          </div>

          {/* 텍스트 (모바일에서는 숨김, sm(태블릿) 이상에서 표시) */}
          <div className="hidden sm:block text-xs lg:text-sm font-bold text-body ml-2 whitespace-nowrap group">
            안녕하세요! <span className="gradient-text">Front-End 개발자</span> 장한옥입니다.
          </div>
        </div>

        {/* 2. 우측 그룹 (프로필 + 내비게이션) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* 2b. 내비게이션 링크 */}
          <nav className="flex items-center space-x-4 md:space-x-6 text-xs lg:text-sm font-semibold">
            <Link
              href="/portfolio"
              className={`transition-all hover:text-sub ${isLinkActive('/portfolio') ? 'text-main' : 'text-body'}`}
            >
              Portfolio
            </Link>
            <Link
              href="/blog"
              className={`transition-all hover:text-sub ${isLinkActive('/blog') ? 'text-main' : 'text-body'}`}
            >
              Blog
            </Link>
          </nav>

          {/* 테마 토글 버튼 추가 */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header >
  );
};

export default Header;