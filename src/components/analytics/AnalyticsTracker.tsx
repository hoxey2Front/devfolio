'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackWebVitals } from '@/lib/analytics';
import { onLCP, onCLS, onFCP, onINP, onTTFB } from 'web-vitals';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    onLCP(trackWebVitals);
    onCLS(trackWebVitals);
    onFCP(trackWebVitals);
    onINP(trackWebVitals);
    onTTFB(trackWebVitals);
  }, []);

  return null;
}
