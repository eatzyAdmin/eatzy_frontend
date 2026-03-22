'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function StatusBarHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Determine the theme color based on current route
    const isHome = pathname === '/' || pathname === '/home';
    const color = isHome ? '#1A1A1A' : '#F7F7F7';
    
    // Update theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', color);
  }, [pathname]);

  return null;
}
