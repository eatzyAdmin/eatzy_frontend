import { useEffect, useRef, useCallback } from 'react';

// ======== Types ========

export interface UseScrollVisibilityOptions {
  /** Minimum scroll before triggering hide (default: 100) */
  hideThreshold?: number;
  /** Whether to control bottom nav visibility (default: true) */
  controlBottomNav?: boolean;
  /** Callback when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
}

export interface UseScrollVisibilityResult {
  /** Whether header/nav should be visible */
  isVisible: boolean;
}

// ======== Hook ========

/**
 * Hook to handle scroll direction visibility for headers/navs
 * Hides on scroll down, shows on scroll up
 * 
 * @example
 * ```tsx
 * const { isVisible } = useScrollVisibility({
 *   hideThreshold: 100,
 *   onVisibilityChange: (visible) => setBottomNav(visible),
 * });
 * 
 * return (
 *   <header className={isVisible ? 'visible' : 'hidden'}>
 *     ...
 *   </header>
 * );
 * ```
 */
export function useScrollVisibility({
  hideThreshold = 100,
  onVisibilityChange,
}: UseScrollVisibilityOptions = {}): UseScrollVisibilityResult {
  const lastScrollY = useRef(0);
  const isVisibleRef = useRef(true);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    let newVisible = isVisibleRef.current;

    if (currentScrollY > lastScrollY.current && currentScrollY > hideThreshold) {
      // Scrolling down & past threshold
      newVisible = false;
    } else if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      newVisible = true;
    }

    if (newVisible !== isVisibleRef.current) {
      isVisibleRef.current = newVisible;
      onVisibilityChange?.(newVisible);
    }

    lastScrollY.current = currentScrollY;
  }, [hideThreshold, onVisibilityChange]);

  useEffect(() => {
    let ticking = false;

    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => window.removeEventListener('scroll', scrollListener);
  }, [handleScroll]);

  return { isVisible: isVisibleRef.current };
}
