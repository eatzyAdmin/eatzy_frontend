'use client';

import { usePathname } from 'next/navigation';
import { useEffect, Suspense, useState, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useSearch } from '@/features/search/hooks/useSearch';

function StatusBarLogic() {
  const pathname = usePathname();
  const { isSearchMode } = useSearch();
  const { 
    isCartOpen, isOrdersDrawerOpen, isLocationPickerOpen, 
    isSavedAddressesOpen, isMenuOpen, isSearchOpen, isRecommendedMode 
  } = useUIStore();
  
  const [currentColor, setCurrentColor] = useState('#F7F7F7');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const isHomeRoute = pathname === '/' || pathname === '/home';
    
    // Check if any "Main" overlay is open (ones that should have a light status bar)
    const isMainOverlayOpen = 
      isCartOpen || 
      isOrdersDrawerOpen || 
      isLocationPickerOpen || 
      isSavedAddressesOpen || 
      isMenuOpen;

    // Dark bar only on Home, NOT in search/recommended modes, and NOT when main overlays are open
    // NOTE: isSearchOpen (the overlay) is EXCLUDED so it stays dark on Home
    const targetIsDark = 
      isHomeRoute && 
      !isSearchMode && 
      !isRecommendedMode && 
      !isMainOverlayOpen;

    const targetColor = targetIsDark ? '#262626' : '#F7F7F7';
    
    // Determine if this is a page navigation or just an overlay toggle
    const isNavigation = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    const updateStatusBar = (color: string) => {
      setCurrentColor(color);
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', color);
    };

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isNavigation) {
      // Instant update for navigation
      updateStatusBar(targetColor);
    } else {
      // Delayed update for overlays/modals (0.6s to match animation)
      timeoutRef.current = setTimeout(() => {
        updateStatusBar(targetColor);
      }, 600);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    pathname, isSearchMode, isRecommendedMode, 
    isCartOpen, isOrdersDrawerOpen, isLocationPickerOpen, 
    isSavedAddressesOpen, isMenuOpen, isSearchOpen
  ]);

  return null;
}

export default function StatusBarHandler() {
  return (
    <Suspense fallback={null}>
      <StatusBarLogic />
    </Suspense>
  );
}
