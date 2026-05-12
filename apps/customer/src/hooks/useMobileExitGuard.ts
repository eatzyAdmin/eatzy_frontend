"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";

/**
 * Custom hook to handle "double back to exit" behavior on mobile.
 * Specifically for the 4 main tabs correctly: Home, Order History, Favorites, Profile.
 * Now also includes Login page with framework-stability timeout.
 */
export function useMobileExitGuard() {
  const pathname = usePathname();
  const lastBackPressTime = useRef<number>(0);

  useEffect(() => {
    // Only on mobile (< 768px as per Customer app standard)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    // Main tabs and Login page
    const mainTabs = ["/home", "/order-history", "/favorites", "/profile", "/login", "/"];
    const isMainTab = mainTabs.includes(pathname || "");
    if (!isMainTab) return;

    // Push dummy state to capture back button
    // Using a 150ms timeout to ensure Next.js routing has stabilized on the Login page
    const timeoutId = setTimeout(() => {
      window.history.pushState({ isExitGuard: true }, "");
    }, 150);

    const handlePopState = (event: PopStateEvent) => {
      // Cooperative check: If we're moving to an overlay state (modal/section), 
      // or if an overlay is currently open (checked via body class),
      // do NOT trigger exit logic.
      const isOverlayOpen = typeof document !== 'undefined' && document.body.classList.contains('modal-open');
      if (event.state?.mobileBackId || isOverlayOpen) return;

      // If the current history state is NOT our exit guard, it means the user clicked back
      if (!event.state || !event.state.isExitGuard) {
        const now = Date.now();

        if (now - lastBackPressTime.current < 2000) {
          // Double back triggered within 2 seconds
          // 1. Try closing window (Works on many Android PWAs)
          window.close();

          // 2. Fallback: If still open, try to push them back out of the history stack
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              // This will attempt to go back to whatever was before the app started
              window.history.back();
            }
          }, 100);
        } else {
          // First back click
          lastBackPressTime.current = now;

          // Re-push the guard state to prevent actually leaving the page
          window.history.pushState({ isExitGuard: true }, "");

          // Show smooth notification
          sileo.warning({
            title: "Press back again to exit",
            description: "",
          });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearTimeout(timeoutId);

      // Cleanup: If the component unmounts (e.g. navigating to detail page),
      // remove the dummy state we added to keep history clean.
      if (window.history.state?.isExitGuard) {
        window.history.back();
      }
    };
  }, [pathname]);
}
