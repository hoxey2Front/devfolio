'use client';

import Link from "next/link";
import Image from 'next/image';

interface HeaderProps { // 사용자 요청에 따라 interface 유지
  showMiniProfile: boolean;
}

const Header = ({ showMiniProfile }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-gray-900/80 transition-colors duration-500">
      <div className="relative flex w-full h-16 items-center px-4 md:px-6 space-x-4 sm:justify-between sm:space-x-0">
        <Link
          href="/"
          className="text-xl font-bold transition-apply text-indigo-400 
          * 👈 임팩트 효과 유지 */
            hover:scale-110
            hover:-rotate-2

            /* 👈 색상 변경: 밝은 청록색(Cyan) 및 네온 효과 적용 */
            hover:drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]
            hover:animate-pulse
            /* 👆 hover:text-cyan-300에 맞춘 청록색(#67E8F9) 네온 효과 */
          "
        >Devfolio</Link>

        {/* 👈 작은 프로필 이미지 + 텍스트 그룹 (절대 위치, 중앙 배치, 전환 효과) */}
        <div
          className={`
                absolute 
                left-1/2 
                top-1/2 
                -translate-x-1/2 
                -translate-y-1/2 
                items-center gap-1
                rounded-full 
                transition-all 
                duration-500
                origin-top            
                pointer-events-none 
                /* 👈 추가: 모바일(sm 이하)에서 숨기고, sm 이상에서만 보이도록 설정 */
                hidden sm:flex 
                
                /* showMiniProfile 상태에 따라 투명도와 크기 조절 */
                ${showMiniProfile ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} 
            `}
        >
          {/* 이미지 컨테이너 (크기 유지) */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-indigo-900">
            <Image
              src="/image/nomad_coder_happy.png"
              width={32}
              height={32}
              alt="Mini profile"
              unoptimized={true} // 👈 최적화 비활성화
              className="rounded-full object-cover w-full h-full"
            />
          </div>

          {/* 텍스트 */}
          <div className="text-sm font-bold text-indigo-400 whitespace-nowrap">
            안녕하세요! <span className="text-gray-200">Front-End 개발자</span> 장한옥입니다.
          </div>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/portfolio" className="transition-apply hover:opacity-70">Portfolio</Link>
          <Link href="/blog" className="transition-apply hover:opacity-70">Blog</Link>
        </nav>
      </div>
    </header >
  );
};

export default Header;
