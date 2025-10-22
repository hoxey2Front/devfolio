'use client';

import Link from "next/link";
import Image from 'next/image';
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Volume2 } from "@/components/animate-ui/icons/volume-2";
import { VolumeOff } from "@/components/animate-ui/icons/volume-off";
import { useEffect, useState, useRef } from "react";

// 타입 정의 시 interface 사용 (사용자 요청 사항 반영)
interface HeaderProps {
  showMiniProfile: boolean;
}

const Header = ({ showMiniProfile }: HeaderProps) => {
  const [profileViewCount, setProfileViewCount] = useState<number>(0);
  // 기본 볼륨을 0.3 (30%)로 설정
  const [volume] = useState<number>(0.3);
  // 기본적으로 음소거 상태로 시작
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Audio 객체를 저장할 useRef 선언
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Audio 객체 초기화 (최초 로드 시)
  useEffect(() => {
    // 오디오 객체는 한 번만 생성
    if (!audioRef.current) {
      // NOTE: /audio/self_introduce.mp3 파일은 프로젝트에 존재한다고 가정합니다.
      audioRef.current = new Audio('/audio/self_introduce.mp3');
      audioRef.current.loop = false;
      // 초기 muted 상태를 isMuted 상태 (true)에 동기화
      audioRef.current.muted = isMuted;
      audioRef.current.volume = volume;
    }

    // 클린업 함수: 컴포넌트 언마운트 시 오디오 정지
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

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

        // isMuted가 false일 때만 재생 시도 (사용자가 명시적으로 켰다고 가정)
        if (!isMuted) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => {
            // 브라우저 정책(NotAllowedError)으로 인해 자동 재생이 실패할 수 있음
            if (error.name !== 'AbortError') {
              console.warn("Audio play attempt failed on showMiniProfile change:", error.name);
            }
          });
        }
      } else {
        // showMiniProfile이 false일 때 (오디오 정지)
        if (!audioRef.current.paused) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0; // 재생 위치 초기화
        }
      }
    }
  }, [showMiniProfile, isMuted]);

  // 4. 아이콘 클릭 시 오디오 **토글** 및 **재생/일시정지** 핸들러
  const handleIconClick = () => {
    const willBeMuted = !isMuted;
    setIsMuted(willBeMuted);

    if (audioRef.current) {
      if (!willBeMuted) {
        // 음소거 해제 시 명시적으로 재생 시도 (브라우저 정책 통과 목적)
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Audio play failed on explicit click:", error);
          }
        });
      } else {
        // 음소거 설정 시 일시 정지
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

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-gray-900/80 transition-colors duration-500">
      <div className="flex w-full h-16 items-center justify-between px-4 md:px-6">

        {/* 1. 로고 (좌측) */}
        <Link
          href="/"
          className="text-base lg:text-lg font-bold transition-apply text-indigo-400 
            hover:scale-110
            hover:-rotate-2
            hover:drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]
            hover:animate-pulse
          "
        >Devfolio</Link>

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
          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full flex-shrink-0 border border-indigo-900 relative group">
            <Image
              src="/image/nomad_coder_happy.png"
              width={32}
              height={32}
              alt="Mini profile"
              unoptimized={true}
              className="rounded-full object-cover w-full h-full"
            />
            {/* 스피커 아이콘 (모든 해상도에서 표시) */}
            <div className="absolute -bottom-1 -right-1 rounded-full bg-indigo-400 p-0.5">
              <AnimateIcon
                key={profileViewCount}
                onClick={handleIconClick}
                {...animateProps}
                animateOnViewOnce={false}
              >
                <VolumeIcon className={'text-white h-2 w-2 lg:h-2.5 lg:w-2.5 hover:opacity-80'} fill={'currentColor'} />
              </AnimateIcon>
            </div>
          </div>

          {/* 텍스트 (모바일에서는 숨김, sm(태블릿) 이상에서 표시) */}
          <div className="hidden sm:block text-xs lg:text-sm font-bold text-indigo-400 whitespace-nowrap group">
            안녕하세요! <span className="text-gray-200">Front-End 개발자</span> 장한옥입니다.
          </div>
        </div>

        {/* 2. 우측 그룹 (프로필 + 내비게이션) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* 2b. 내비게이션 링크 */}
          <nav className="flex items-center space-x-4 md:space-x-6 text-xs lg:text-sm font-medium">
            <Link href="/portfolio" className="transition-apply hover:opacity-70">Portfolio</Link>
            <Link href="/blog" className="transition-apply hover:opacity-70">Blog</Link>
          </nav>
        </div>
      </div>
    </header >
  );
};

export default Header;
