import { supabase } from './supabase';

export type AnalyticsType = 'page_view' | 'click' | 'web_vitals';

export interface AnalyticsPayload {
  type: AnalyticsType;
  session_id?: string | null;
  path?: string;
  referrer?: string;
  browser?: string;
  device?: 'mobile' | 'tablet' | 'desktop';
  event_name?: string;
  value?: any;
}

const getSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('devfolio_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('devfolio_session_id', sessionId);
  }
  return sessionId;
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getBrowserName = (): string => {
  if (typeof window === 'undefined') return 'Other';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
};

export const trackPageView = async (path: string) => {
  try {
    const payload: AnalyticsPayload = {
      type: 'page_view',
      session_id: getSessionId(),
      path,
      referrer: document.referrer || 'direct',
      browser: getBrowserName(),
      device: getDeviceType(),
    };

    await supabase.from('analytics').insert(payload);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

export const trackEvent = async (eventName: string, value?: any) => {
  try {
    const payload: AnalyticsPayload = {
      type: 'click',
      session_id: getSessionId(),
      path: window.location.pathname,
      event_name: eventName,
      value: value,
      browser: getBrowserName(),
      device: getDeviceType(),
    };

    await supabase.from('analytics').insert(payload);
  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

export const trackWebVitals = async (metric: any) => {
  try {
    const payload: AnalyticsPayload = {
      type: 'web_vitals',
      session_id: getSessionId(),
      path: window.location.pathname,
      event_name: metric.name,
      value: {
        id: metric.id,
        value: metric.value,
        rating: metric.rating,
      },
      browser: getBrowserName(),
      device: getDeviceType(),
    };

    await supabase.from('analytics').insert(payload);
  } catch (error) {
    console.error('Failed to track web vitals:', error);
  }
};
