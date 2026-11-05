'use client';

import React, { Suspense, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function generateVisitorId(): string {
  const rand = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  return 'vid_' + Date.now().toString(36) + '_' + rand;
}

function TrackerInternal() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedKeyRef = useRef<string>('');
  const lastTrackedTimeRef = useRef<number>(0);

  useEffect(() => {
    // Skip tracking for admin and API endpoints
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    const now = Date.now();

    // Prevent duplicate tracking within 4 seconds for the same URL
    if (lastTrackedKeyRef.current === currentUrl && now - lastTrackedTimeRef.current < 4000) {
      return;
    }

    lastTrackedKeyRef.current = currentUrl;
    lastTrackedTimeRef.current = now;

    try {
      // Check existing visitor ID in cookie or localStorage
      let visitorId = getCookie('ace_vid');
      let isNew = false;

      if (!visitorId) {
        try {
          visitorId = localStorage.getItem('ace_vid');
        } catch {}
      }

      if (!visitorId) {
        visitorId = generateVisitorId();
        isNew = true;
      }

      // Persist visitor ID in both cookie and localStorage
      setCookie('ace_vid', visitorId, 365);
      try {
        localStorage.setItem('ace_vid', visitorId);
      } catch {}

      const payload = {
        visitorId,
        isNew,
        pageUrl: currentUrl,
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
      };

      // Non-blocking beacon or fetch call
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/visitor', blob);
      } else {
        fetch('/api/analytics/visitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Analytics should never throw or break user interaction
    }
  }, [pathname, searchParams]);

  return null;
}

export function SiteVisitorTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInternal />
    </Suspense>
  );
}
