// components/RelativeTimeBadge.tsx
'use client';

import React from 'react';
import { formatDistanceToNowStrict, formatDistanceToNow, formatDistance } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

// 상대 시간 문자열을 생성하는 안전한 헬퍼
function toRelativeTime(dateInput: string | number | Date, options?: { strict?: boolean; addSuffix?: boolean }) {
  const { strict = false, addSuffix = true } = options || {};
  const date = new Date(dateInput);

  // 엣지 케이스: Invalid Date
  if (isNaN(date.getTime())) return '알 수 없음';

  const now = new Date();

  // 미래 날짜인 경우: "X 후"로 표시
  const isFuture = date.getTime() > now.getTime();

  try {
    if (strict) {
      // 단위 경계를 엄격히 따르는 버전 (예: 59분→59분, 61분→1시간)
      const text = formatDistanceToNowStrict(date, { addSuffix, locale: ko });
      return text;
    }
    // 좀 더 자연스러운 버전 (예: 59분→약 1시간 전)
    const text = formatDistanceToNow(date, { addSuffix, locale: ko });
    // date-fns는 미래일 경우 "후"를 자동 처리
    return text;
  } catch {
    // 포맷팅 실패 시 fallback
    const text = formatDistance(date, now, { addSuffix, locale: ko });
    return isFuture ? `${text}` : `${text}`;
  }
}

interface TimelinBadgeProps {
  createdAt: string | number | Date; // ISO string, timestamp, Date 모두 허용
  strict?: boolean;                  // true면 경계를 엄격히, false면 자연스럽게
  live?: boolean;                    // true면 1분 간격으로 갱신
  className?: string;
};

// 배지 컴포넌트: shadcn/ui Badge 대체 또는 그대로 className만 전달해도 됨
export function TimelinBadge({
  createdAt,
  strict = false,
  live = true,
}: TimelinBadgeProps) {
  const [label, setLabel] = React.useState(() => toRelativeTime(createdAt, { strict }));

  // 시간이 흐를 때 자동 업데이트 (기본 1분)
  React.useEffect(() => {
    if (!live) return;

    // 경계가 바뀌는 시점에 더 세밀히 갱신하려면 간격 계산을 동적으로 바꿔도 됨
    const interval = setInterval(() => {
      setLabel(toRelativeTime(createdAt, { strict }));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [createdAt, strict, live]);

  // 접근성: 정확한 날짜를 title로 제공
  const dateObj = new Date(createdAt);
  const iso = !isNaN(dateObj.getTime()) ? dateObj.toISOString() : undefined;

  return (
    <Badge className='tracking-wide'
      title={iso ?? '알 수 없음'}
      aria-label={label}
    >
      {label}
    </Badge>
  );
}
