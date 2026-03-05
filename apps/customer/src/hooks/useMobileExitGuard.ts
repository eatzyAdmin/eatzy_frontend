"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";

/**
 * Custom hook to handle "double back to exit" behavior on mobile.
 * Specifically for the 4 main tabs: Home, Order History, Favorites, Profile.
 */
export function useMobileExitGuard() {
  const pathname = usePathname();
  const lastBackPressTime = useRef<number>(0);

  useEffect(() => {
    // Only on mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) return;

    // Only on main tabs
    const mainTabs = ["/home", "/order-history", "/favorites", "/profile"];
    const isMainTab = mainTabs.includes(pathname || "");
    if (!isMainTab) return;

    // Push dummy state to capture back button
    // This state will be at the TOP of the history stack
    window.history.pushState({ isExitGuard: true }, "");

    const handlePopState = (event: PopStateEvent) => {
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

      // Cleanup: If the component unmounts (e.g. navigating to detail page),
      // remove the dummy state we added to keep history clean.
      if (window.history.state?.isExitGuard) {
        window.history.back();
      }
    };
  }, [pathname]);
}
