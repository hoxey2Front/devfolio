import * as React from 'react';

// 타입 정의를 interface로 했습니다.
export interface KbdProps extends React.PropsWithChildren {
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={`inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border bg-muted px-1.5 text-xs font-medium text-muted-foreground ${className ?? ''}`}
    >
      {children}
    </kbd>
  );
}