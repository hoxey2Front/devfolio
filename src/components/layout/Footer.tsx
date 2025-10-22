'use client'

import { type ReactNode } from "react";
import { Bot } from "@/components/animate-ui/icons/bot";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Send } from "@/components/animate-ui/icons/send";
import { Star } from "@/components/animate-ui/icons/star";
import Link from "next/link";
// 💡 shadcn/ui Tooltip 컴포넌트 import (가정)
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquareMore } from "@/components/animate-ui/icons/message-square-more";


/**
 * AnimateIcon의 animateOnHover prop을 부모 Link의 hover 상태로 제어하는 컴포넌트
 * 이 컴포넌트 내부에서 Link의 hover 상태를 관리합니다.
 */
interface IconLinkProps {
  href: string;
  children: ReactNode;
  target?: string;
  // 💡 Tooltip에 표시될 텍스트 prop 추가
  tooltipText: string;
}

const IconLink = ({ href, children, target, tooltipText }: IconLinkProps) => {
  return (
    // ⭐️ Link를 Tooltip으로 감쌉니다.
    <Tooltip>
      {/* ⭐️ TooltipTrigger로 Link를 감싸서 Link에 hover/focus 시 툴팁을 활성화합니다. */}
      <TooltipTrigger asChild>
        <Link
          href={href}
          target={target}
          className="flex items-center rounded-full hover:bg-gray-700 transition-all duration-300 group"
        >
          <AnimateIcon
            animateOnHover
            loop
            loopDelay={600}
          >
            {children}
          </AnimateIcon>
        </Link>
      </TooltipTrigger>
      {/* ⭐️ TooltipContent에 표시될 텍스트를 전달합니다. */}
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// ---

const Footer = () => {
  return (
    // ⭐️ TooltipProvider로 전체 Footer를 감싸서 Tooltip 기능을 활성화합니다.
    <TooltipProvider>
      <footer className="
        mt-0
        py-4 sm:py-6 lg:py-8
        border-t border-gray-700
        bg-gray-900 
        text-sm text-gray-500
        
        /* ⭐️ 수정: flex로 기본 설정하고 justify-between을 적용하여 좌우로 붙입니다. */
        flex flex-wrap justify-between items-center 
        sm:grid grid-cols-3
        px-2 sm:px-4 md:px-8 
      ">

        {/* 1. 왼쪽 빈 공간 (첫 번째 컬럼) - sm 미만에서는 완전히 숨김 */}
        <div className="hidden sm:block sm:col-span-1">
          {/* 비워둠 */}
        </div>

        {/* 2. 저작권 텍스트 (두 번째 컬럼) - 모바일(sm 미만)에서 좌측에 배치됨 */}
        <span className="
          text-xs sm:text-sm 
          whitespace-nowrap 
          /* sm 미만에서 flex의 첫 번째 요소로 좌측에 배치, sm 이상에서 중앙 그리드 컬럼에 배치 */
          sm:col-span-1 sm:text-center
        ">
          © 2025 Jang HanOk. All rights reserved.
        </span>

        {/* 3. 연락처 섹션 (세 번째 컬럼) - 모바일(sm 미만)에서 우측에 배치됨 */}
        <div className="
          flex justify-end gap-0 sm:gap-4 items-center
          sm:col-span-1
        ">
          {/* justify-end로 아이콘들을 오른쪽 끝에 배치 */}

          {/* IconLink 컴포넌트 사용 및 tooltipText prop 추가 */}
          <IconLink href="tel:01032893377" tooltipText="전화 문의">
            <MessageSquareMore className="w-5 h-5 sm:w-8 sm:h-8 p-1 sm:p-2 group-hover:text-indigo-300" />
          </IconLink>

          <IconLink href="mailto:hoxey2react@gmail.com" tooltipText="이메일 문의">
            <Send className="w-5 h-5 sm:w-8 sm:h-8 p-1 sm:p-2 group-hover:text-indigo-300" />
          </IconLink>

          <IconLink href="/blog" target='_blank' tooltipText="기술 블로그">
            <Star className="w-5 h-5 sm:w-8 sm:h-8 p-1 sm:p-2 group-hover:text-indigo-300" />
          </IconLink>

          <IconLink href="https://github.com/hoxey2Front" target='_blank' tooltipText="GitHub">
            <Bot className="w-5 h-5 sm:w-8 sm:h-8 p-1 sm:p-2 group-hover:text-indigo-300" />
          </IconLink>
        </div>
      </footer>
    </TooltipProvider>
  );
};

export default Footer;