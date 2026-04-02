"use client";

import { useEffect, useRef } from "react";

/**
 * Hook to handle mobile back button for overlays/modals/side-pages.
 * When enabled (isOpen is true and is mobile), it pushes a state to history.
 * If the user clicks back, it calls onBack.
 * If the component is closed programmatically, it pops the history state.
 */
export function useMobileBackHandler(isOpen: boolean, onBack: () => void) {
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const isBackTriggeredRef = useRef(false);
  const stateIdRef = useRef<string | null>(null);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (!isMobile) return;

    let isUnmounted = false;
    let hasPushed = false;

    if (isOpen) {
      const stateId = `mb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      stateIdRef.current = stateId;

      // Small delay to prevent immediate popstate interference during mounting
      const pushTimer = setTimeout(() => {
        if (isUnmounted) return;
        window.history.pushState({ mobileBackId: stateId }, "");
        hasPushed = true;
      }, 50);

      const handlePopState = (e: PopStateEvent) => {
        if (e.state?.mobileBackId !== stateId) {
          isBackTriggeredRef.current = true;
          onBackRef.current();
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        isUnmounted = true;
        clearTimeout(pushTimer);
        window.removeEventListener("popstate", handlePopState);

        if (!isBackTriggeredRef.current && hasPushed) {
          if (window.history.state?.mobileBackId === stateId) {
            window.history.back();
          }
        }
        isBackTriggeredRef.current = false;
        stateIdRef.current = null;
      };
    }
  }, [isOpen]);
}
