'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // SSR 하이드레이션 오류 방지
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-secondary/20 hover:bg-secondary/40 transition-all duration-200 focus:outline-none disabled:cursor-default"
      aria-label="Toggle theme"
      disabled={!mounted}
    >
      <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`absolute w-full h-full text-foreground transition-all duration-100 transform ${!mounted
            ? 'opacity-0 scale-50'
            : isDark
              ? '-translate-y-8 opacity-0 scale-50'
              : 'translate-y-0 opacity-100 scale-100'
            }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`absolute w-full h-full text-transparent fill-main transition-all duration-100 transform ${!mounted
            ? 'opacity-0 scale-50'
            : isDark
              ? 'translate-y-0 opacity-100 scale-100'
              : '-translate-y-8 opacity-0 scale-50'
            }`}
        />

        {/* Placeholder while mounting to avoid layout jump and empty look */}
        {!mounted && (
          <div className="w-full h-full rounded-full bg-secondary/30 animate-pulse" />
        )}
      </div>

      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-main transition-opacity duration-300" />
    </button>
  );
};
