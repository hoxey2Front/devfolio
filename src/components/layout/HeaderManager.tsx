'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '@/components/layout/Header';
// next/navigation에서 usePathname 임포트
import { usePathname } from 'next/navigation';

/**
 * 뷰포트 감지 로직을 담당하고 Header에 showMiniProfile 상태를 전달하는 클라이언트 컴포넌트.
 * ID가 'in-view-detector'인 요소를 감지합니다.
 */
const HeaderManager = () => {
  const [showHeaderProfile, setShowHeaderProfile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 현재 경로 가져오기
  const pathname = usePathname();

  // pathname이 변경될 때마다 로직을 다시 실행합니다.
  useEffect(() => {
    // 1. 이전 Observer가 있다면 정리 (클린업 로직)
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // 2. 경로 체크: Home 페이지가 아닐 경우 미니 프로필을 표시하고 종료
    if (pathname !== '/') {
      setShowHeaderProfile(false);
      return;
    }

    // 3. Home 페이지일 경우: Intersection Observer 로직 실행

    // Home 페이지의 감지 요소 찾기
    const targetElement = document.getElementById('in-view-detector');

    if (targetElement) {
      // Intersection Observer 설정
      const observer = new IntersectionObserver(
        ([entry]) => {
          // targetElement가 뷰포트 밖에 있을 때 (!isIntersecting) 미니 프로필을 표시합니다 (true).
          setShowHeaderProfile(!entry.isIntersecting);
        },
        {
          root: null, // 뷰포트를 root로 사용
          threshold: 0,
        }
      );

      observerRef.current = observer;

      // 감지 시작
      observer.observe(targetElement);

      // 초기 렌더링 시, 요소의 현재 상태에 따라 초기 showHeaderProfile 상태를 결정
      // Intersection Observer는 observe() 호출 시 동기적으로 콜백을 실행하여 초기 상태를 설정합니다.

    } else {
      // Home 페이지에서 요소를 찾을 수 없는 경우 (예외 상황)
      setShowHeaderProfile(false);
    }

    // 4. 클린업 (컴포넌트 언마운트 또는 pathname 변경 시 실행)
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [pathname]); // 👈 pathname이 변경될 때마다 useEffect 재실행

  return (
    <>
      <Header showMiniProfile={showHeaderProfile} />
    </>
  );
};

export default HeaderManager;