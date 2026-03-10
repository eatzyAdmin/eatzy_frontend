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
    // Only handle on mobile (desktop follows normal flow)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    if (isOpen) {
      // We are OPENING.
      const stateId = `mb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      stateIdRef.current = stateId;
      window.history.pushState({ mobileBackId: stateId }, "");
      isBackTriggeredRef.current = false;

      const handlePopState = (e: PopStateEvent) => {
        // Use e.state which is the state we just LANDED on.
        // If we landed on a state that is NOT our stateId, it means 
        // a back action (or some navigation) occurred from our state.
        if (e.state?.mobileBackId !== stateId) {
          isBackTriggeredRef.current = true;
          onBackRef.current();
        }
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);

        // If we are closing programmatically (e.g. 'X' button or overlay click),
        // we must remove the history entry we added.
        if (!isBackTriggeredRef.current) {
          // Verify we're still at the top or at least that our state is the current one 
          // before potentially affecting history.
          if (window.history.state?.mobileBackId === stateId) {
            window.history.back();
          }
        }
        isBackTriggeredRef.current = false;
        stateIdRef.current = null;
      };
    }
  }, [isOpen]); // ONLY re-run when status toggles
}
