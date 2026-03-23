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

  useEffect(() => {
    // Determine the theme color based on current route and overlay states
    const isHomeRoute = pathname === '/' || pathname === '/home';
    
    // Check if any overlay is open
    const isAnyOverlayOpen = 
      isCartOpen || 
      isOrdersDrawerOpen || 
      isLocationPickerOpen || 
      isSavedAddressesOpen || 
      isMenuOpen ||
      isSearchOpen;

    // Dark bar only on Home, NOT in search/recommended modes, and NOT when overlays are open
    const targetIsDark = 
      isHomeRoute && 
      !isSearchMode && 
      !isRecommendedMode && 
      !isAnyOverlayOpen;

    const targetColor = targetIsDark ? '#262626' : '#F7F7F7';
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay the update by 0.6 seconds
    timeoutRef.current = setTimeout(() => {
      setCurrentColor(targetColor);
      
      // Update theme-color meta tag
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', targetColor);
    }, 600);

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
