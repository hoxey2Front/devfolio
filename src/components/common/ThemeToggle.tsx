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

  if (!mounted) {
    return (
      <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-secondary/20">
        <div className="w-5 h-5 md:w-6 md:h-6" />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-main"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 md:w-6 md:h-6 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <Sun
          className={`absolute w-full h-full text-main transition-all duration-500 transform ${isDark ? 'translate-y-10 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0'
            }`}
        />
        {/* Moon Icon */}
        <Moon
          className={`absolute w-full h-full text-main transition-all duration-500 transform ${isDark ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 -rotate-90'
            }`}
        />
      </div>

      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-main transition-opacity duration-300" />
    </button>
  );
};
