'use client'

import { type ReactNode, useState, useEffect } from "react";
import { Bot } from "@/components/animate-ui/icons/bot";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Send } from "@/components/animate-ui/icons/send";
import { Star } from "@/components/animate-ui/icons/star";
import Link from "next/link";
import { Lock } from "@/components/animate-ui/icons/lock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageSquareMore } from "@/components/animate-ui/icons/message-square-more";
import AdminLoginDialog from "@/components/common/AdminLoginDialog";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * AnimateIcon의 animateOnHover prop을 부모 Link의 hover 상태로 제어하는 컴포넌트
 * 이 컴포넌트 내부에서 Link의 hover 상태를 관리합니다.
 */
interface IconLinkProps {
  // 💡 href를 optional로 변경하거나 Link 대신 div를 사용하도록 구조 변경
  // Admin 버튼은 클릭 핸들러를 사용하므로 href는 제외합니다.
  href?: string;
  children: ReactNode;
  target?: string;
  tooltipText: string;
  // 💡 클릭 핸들러 prop 추가
  onClick?: () => void;
  // 💡 Tooltip variant prop 추가
  tooltipVariant?: "default" | "destructive";
}

// 💡 IconLink 컴포넌트 수정: href가 있으면 Link 사용, 없으면 button 역할의 div 사용 (asChild=true인 TooltipTrigger가 처리)
const IconLink = ({ href, children, target, tooltipText, onClick, tooltipVariant = "default" }: IconLinkProps) => {

  const content = (
    <div
      onClick={onClick}
      // href가 없으면 cursor-pointer를 추가하여 클릭 가능함을 명시
      className={`flex items-center rounded-full transition-all duration-300 group ${!href ? 'cursor-pointer' : ''}`}
    >
      <AnimateIcon
        animateOnHover
        loop
        loopDelay={600}
      >
        {children}
      </AnimateIcon>
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href ? (
          <Link href={href} target={target}>
            {content}
          </Link>
        ) : (
          // href가 없으면 직접 div를 렌더링 (onClick을 사용)
          content
        )}
      </TooltipTrigger>
      <TooltipContent variant={tooltipVariant}>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const Footer = () => {
  const { isAdmin, logout } = useAdmin();

  // 💡 Dialog 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // 💡 관리자 버튼 표시 여부 상태
  const [showAdminButton, setShowAdminButton] = useState(false);

  // 💡 컴포넌트 마운트 시 로컬 스토리지에서 관리자 모드 상태 읽기
  useEffect(() => {
    const adminMode = localStorage.getItem('adminModeEnabled');
    if (adminMode === 'true') {
      setShowAdminButton(true);
    }

    // 💡 Escape 단축키 감지 (3번 연속으로 눌러야 토글)
    let pressCount = 0;
    let pressTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape 키 감지
      if (e.key === 'Escape') {
        e.preventDefault();

        pressCount++;
        console.log(`🔑 관리자 버튼 토글: ${pressCount}/3`);

        // 3번 누르면 관리자 버튼 토글
        if (pressCount >= 3) {
          setShowAdminButton(current => {
            const newState = !current;

            // 로컬 스토리지에 상태 저장
            if (newState) {
              localStorage.setItem('adminModeEnabled', 'true');
              console.log('🔓 관리자 버튼이 활성화되었습니다!');
            } else {
              localStorage.removeItem('adminModeEnabled');
              console.log('🔒 관리자 버튼이 숨겨졌습니다!');
            }

            return newState;
          });

          pressCount = 0; // 카운터 리셋
        }

        // 2초 후 카운터 리셋 (연속으로 눌러야 함)
        clearTimeout(pressTimer);
        pressTimer = setTimeout(() => {
          pressCount = 0;
        }, 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(pressTimer);
    };
  }, []);

  // 💡 관리자 로그인 성공 핸들러
  const handleLoginSuccess = () => {
    // 성공 시 아무 동작도 하지 않음 (전역 상태는 AdminLoginDialog에서 업데이트됨)
  };

  // ... existing code ...

  // 💡 로그아웃 핸들러 (다이얼로그 열기)
  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  // 💡 로그아웃 확정 핸들러
  const handleLogoutConfirm = () => {
    logout();
    toast.success('로그아웃되었습니다.');
    setIsLogoutDialogOpen(false);
  };

  return (
    // ⭐️ TooltipProvider로 전체 Footer를 감싸서 Tooltip 기능을 활성화합니다.
    <TooltipProvider>
      <footer className="
        py-4 sm:py-6 lg:py-8
        border-t border-caption/40
        text-sm text-body
        
        /* ⭐️ 수정: flex로 기본 설정하고 justify-between을 적용하여 좌우로 붙입니다. */
        flex flex-wrap justify-between items-center 
        sm:grid grid-cols-3
        px-2 sm:px-4 md:px-8 
      ">

        {/* 1. 왼쪽 빈 공간 (첫 번째 컬럼) - sm 미만에서는 완전히 숨김 */}
        <div className="
          hidden sm:flex sm:col-span-1 
          justify-start
        ">
          {/* 💡 관리자 버튼: showAdminButton이 true일 때만 표시 (애니메이션 적용) */}
          <AnimatePresence mode="wait">
            {showAdminButton && (
              <motion.div
                key="admin-button"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.3
                }}
              >
                {isAdmin ? (
                  // 로그인 상태: 로그아웃 버튼
                  <IconLink
                    tooltipText="로그아웃"
                    onClick={handleLogout}
                    tooltipVariant="destructive"
                  >
                    <LogOut className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-destructive" />
                  </IconLink>
                ) : (
                  // 비로그인 상태: 로그인 버튼
                  <IconLink
                    tooltipText="관리자 로그인"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-main" />
                  </IconLink>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. 저작권 텍스트 (두 번째 컬럼) - 모바일(sm 미만)에서 좌측에 배치됨 */}
        <div className="
          text-xs sm:text-sm 
          whitespace-nowrap 
          /* sm 미만에서 flex의 첫 번째 요소로 좌측에 배치, sm 이상에서 중앙 그리드 컬럼에 배치 */
          sm:col-span-1 sm:text-center
        ">
          © 2025 <span className="gradient-text">DevFolio</span> Develop by Next.js
        </div>

        {/* 3. 연락처 섹션 (세 번째 컬럼) - 모바일(sm 미만)에서 우측에 배치됨 */}
        <div className="
          flex justify-end gap-2 sm:gap-4 items-center
          sm:col-span-1
        ">
          {/* justify-end로 아이콘들을 오른쪽 끝에 배치 */}

          {/* IconLink 컴포넌트 사용 및 tooltipText prop 추가 */}
          <IconLink href="tel:01032893377" tooltipText="전화 문의">
            <MessageSquareMore className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-main" />
          </IconLink>

          <IconLink href="mailto:hoxey2react@gmail.com" tooltipText="이메일 문의">
            <Send className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-main" />
          </IconLink>

          <IconLink href="/blog" target='_blank' tooltipText="기술 블로그">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-main" />
          </IconLink>

          <IconLink href="https://github.com/hoxey2Front" target='_blank' tooltipText="GitHub">
            <Bot className="w-8 h-8 sm:w-10 sm:h-10 p-1.5 sm:p-2 group-hover:text-main" />
          </IconLink>
        </div>
      </footer>

      {/* 💡 AdminLoginDialog 추가 */}
      <AdminLoginDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 💡 로그아웃 확인 Dialog */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>로그아웃 하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              관리자 권한이 해제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm}>로그아웃</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default Footer;