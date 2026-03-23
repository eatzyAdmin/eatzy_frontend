'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useUIStore } from '@/store/uiStore';
import { useSearch } from '@/features/search/hooks/useSearch';

export default function StatusBarHandler() {
  const pathname = usePathname();
  const { isSearchMode } = useSearch();
  const { 
    isCartOpen, isOrdersDrawerOpen, isLocationPickerOpen, 
    isSavedAddressesOpen, isMenuOpen, isSearchOpen, isRecommendedMode 
  } = useUIStore();

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
    const shouldShowDarkBar = 
      isHomeRoute && 
      !isSearchMode && 
      !isRecommendedMode && 
      !isAnyOverlayOpen;

    const color = shouldShowDarkBar ? '#262626' : '#F7F7F7';
    
    // Update theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.setAttribute('content', color);
  }, [
    pathname, isSearchMode, isRecommendedMode, 
    isCartOpen, isOrdersDrawerOpen, isLocationPickerOpen, 
    isSavedAddressesOpen, isMenuOpen, isSearchOpen
  ]);

  return null;
}
