'use client';

import { useEffect } from 'react';

export function VisitorTracker() {
  useEffect(() => {
    // Track visitor on page load
    fetch('/api/track', { 
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // Silently fail - don't break the page for tracking errors
    });
  }, []);
  
  return null;
}
