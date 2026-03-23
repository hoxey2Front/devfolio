'use client'

import { type ReactNode, useState, useEffect, useRef } from "react";
import { Bot } from "@/components/animate-ui/icons/bot";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { Send } from "@/components/animate-ui/icons/send";
import { Star } from "@/components/animate-ui/icons/star";
import Link from "next/link";
import { Lock, Phone, Mail, MapPin } from "lucide-react";
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
import { trackEvent } from "@/lib/analytics";

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

  // 3D Tilt Effect Logic
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const degX = (y - centerY) / 10;
    const degY = (centerX - x) / 10;
    setRotateX(degX * 0.5); // Reduce tilt intensity for subtler look
    setRotateY(degY * 0.5);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

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
    <TooltipProvider>
      <footer className="w-full pt-20 pb-12 px-6 overflow-hidden">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ rotateX, rotateY }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-white/10 dark:border-white/5 shadow-2xl group/card"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Card Background Overlay */}
          <div className="absolute inset-0 bg-white dark:bg-[#121212] opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-br from-main/5 via-transparent to-main/10 opacity-50" />
          <div className="absolute -inset-[100%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,var(--main)_360deg)] opacity-10 group-hover/card:opacity-20 transition-opacity" />

          {/* Card Content */}
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row justify-between items-start gap-12 group/content">
            {/* Left Section: Branding */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl md:text-4xl font-black gradient-text tracking-tighter">
                    DevFolio
                  </h2>
                  <div className="h-6 w-px bg-caption/30 rotate-12" />
                </div>
                <p className="text-body text-xs max-w-xs leading-relaxed">
                  열정과 기술, 그리고 창의적인 시각으로 <br className="hidden sm:block" />
                  완성도 높은 디지털 경험을 만들어갑니다.
                </p>
              </div>

              {/* Hidden Admin Trigger */}
            {showAdminButton && (
              <div className="inline-block">
                {isAdmin ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive hover:text-white transition-all"
                  >
                    <LogOut size={14} /> ADMIN SIGN OUT
                  </button>
                ) : (
                  <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-main/20 text-main text-xs font-bold hover:bg-main hover:text-black transition-all"
                  >
                    <Lock size={14} /> ADMIN ACCESS
                  </button>
                )}
              </div>
            )}
            </div>

            {/* Right Section: Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 w-full md:w-auto">
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-caption uppercase tracking-[0.3em] mb-2 opacity-50 text-right md:text-left">
                  Contact
                </h3>

                <div className="flex flex-wrap md:flex-col justify-end md:justify-start gap-4">
                  <a
                    href="mailto:hoxey2react@gmail.com"
                    className="flex items-center gap-3 text-body hover:text-main transition-colors group/link p-2 -m-2"
                    onClick={() => trackEvent('CLICK_EMAIL', { email: 'hoxey2react@gmail.com' })}
                  >
                    <div className="size-10 rounded-xl bg-body/5 flex-center group-hover/link:bg-main/10 group-hover/link:scale-110 transition-all">
                      <Mail size={15} />
                    </div>
                    <span className="hidden lg:inline text-xs">hoxey2react@gmail.com</span>
                  </a>

                  <a
                    href="tel:01032893377"
                    className="flex items-center gap-3 text-body hover:text-main transition-colors group/link p-2 -m-2"
                    onClick={() => trackEvent('CLICK_PHONE', { phone: '010-3289-3377' })}
                  >
                    <div className="size-10 rounded-xl bg-body/5 flex-center group-hover/link:bg-main/10 group-hover/link:scale-110 transition-all">
                      <Phone size={15} />
                    </div>
                    <span className="hidden lg:inline text-xs">+82 10-3289-3377</span>
                  </a>

                  <div className="flex gap-4 pt-2 md:pt-4">
                    <IconLink
                      href="/blog"
                      target='_blank'
                      tooltipText="기술 블로그"
                      onClick={() => trackEvent('NAVIGATE_BLOG_EXTERNAL')}
                    >
                      <Star className="w-9 h-9 p-2 group-hover:text-main" />
                    </IconLink>
                    <IconLink
                      href="https://github.com/hoxey2Front"
                      target='_blank'
                      tooltipText="GitHub"
                      onClick={() => trackEvent('NAVIGATE_GITHUB')}
                    >
                      <Bot className="w-9 h-9 p-2 group-hover:text-main" />
                    </IconLink>
                    <IconLink
                      href="#"
                      tooltipText="South Korea"
                      onClick={() => trackEvent('CLICK_ADDRESS')}
                    >
                      <MapPin className="w-9 h-9 p-2 group-hover:text-main" />
                    </IconLink>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Strip */}
          <div className="border-t border-white/5 dark:border-white/[0.03] p-6 text-center">
            <span className="text-xs uppercase tracking-[0.5em] text-caption font-medium">
              © 2025 DevFolio • ALL RIGHTS RESERVED • DEVELOPED WITH NEXT.JS
            </span>
          </div>
        </motion.div>
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