"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";

/**
 * Custom hook to handle "double back to exit" behavior on mobile.
 * Specifically for the main tabs and login page in Driver App.
 * EXPLICITLY MATCHED WITH CUSTOMER APP LOGIC.
 */
export function useMobileExitGuard() {
  const pathname = usePathname();
  const lastBackPressTime = useRef<number>(0);

  useEffect(() => {
    // Enable for mobile and tablets (< 1024px)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
    if (!isMobile) return;

    // Main tabs strictly for protected content and login page
    const mainTabs = ["/home", "/history", "/wallet", "/settings", "/profile", "/login"];
    const isMainTab = mainTabs.includes(pathname || "");
    if (!isMainTab) return;

    // Push dummy state to capture back button
    // Using a small timeout to ensure Next.js routing has stabilized
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
            title: "Nhấn quay lại thêm lần nữa để thoát",
            description: "",
          });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearTimeout(timeoutId);

      // Cleanup: If the component unmounts (e.g. navigating or logging out),
      // remove the dummy state we added to keep history clean.
      if (window.history.state?.isExitGuard) {
        window.history.back();
      }
    };
  }, [pathname]);
}
