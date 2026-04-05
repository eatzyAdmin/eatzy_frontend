import { useEffect, useRef, useCallback } from 'react';

// ======== Types ========

export interface UseScrollVisibilityOptions {
  /** Minimum scroll before triggering hide (default: 100) */
  hideThreshold?: number;
  /** Whether to control bottom nav visibility (default: true) */
  controlBottomNav?: boolean;
  /** Callback when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
  /** Optional container ref to listen to instead of window */
  containerRef?: React.RefObject<HTMLElement>;
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
  containerRef,
}: UseScrollVisibilityOptions = {}): UseScrollVisibilityResult {
  const lastScrollPos = useRef(0);
  const isVisibleRef = useRef(true);

  const handleScroll = useCallback(() => {
    // Get current scroll position based on source (container or window)
    const currentScrollPos = containerRef?.current
      ? containerRef.current.scrollTop
      : window.scrollY;

    const threshold = hideThreshold;
    let newVisible = isVisibleRef.current;

    // Logic: 
    // 1. If scrolling down AND passed threshold -> hide
    // 2. If scrolling up -> show
    if (currentScrollPos > lastScrollPos.current && currentScrollPos > threshold) {
      newVisible = false;
    } else if (currentScrollPos < lastScrollPos.current) {
      newVisible = true;
    }

    // Edge case: if we are at the very top, always show
    if (currentScrollPos <= 0) {
      newVisible = true;
    }

    if (newVisible !== isVisibleRef.current) {
      isVisibleRef.current = newVisible;
      onVisibilityChange?.(newVisible);
    }

    lastScrollPos.current = currentScrollPos;
  }, [hideThreshold, onVisibilityChange, containerRef]);

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

    const target = containerRef?.current || window;

    target.addEventListener('scroll', scrollListener, { passive: true });
    return () => target.removeEventListener('scroll', scrollListener);
  }, [handleScroll, containerRef?.current]);

  return { isVisible: isVisibleRef.current };
}
