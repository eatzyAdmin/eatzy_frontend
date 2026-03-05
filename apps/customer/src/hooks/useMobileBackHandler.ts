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

  useEffect(() => {
    // Only handle on mobile (desktop follows normal flow)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile || !isOpen) return;

    // We are OPEN.
    const stateId = `mb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    window.history.pushState({ mobileBackId: stateId }, "");
    isBackTriggeredRef.current = false;

    const handlePopState = (e: PopStateEvent) => {
      // If the current history state is NO LONGER our specific ID,
      // it means our history entry was popped (user clicked back button).
      if (window.history.state?.mobileBackId !== stateId) {
        isBackTriggeredRef.current = true;
        onBackRef.current();
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);

      // If we are closing programmatically (e.g. 'X' button or overlay click),
      // or the component is unmounting while open, we must remove the dummy 
      // history entry we added to keep the history clean.
      if (!isBackTriggeredRef.current) {
        // Verify we're still at the top of history with our ID before popping
        if (window.history.state?.mobileBackId === stateId) {
          window.history.back();
        }
      }
      isBackTriggeredRef.current = false;
    };
  }, [isOpen]); // ONLY re-run when open/closed status toggles
}
