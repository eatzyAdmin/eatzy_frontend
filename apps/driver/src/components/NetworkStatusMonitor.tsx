"use client";

import { useEffect, useRef } from "react";
import { sileo } from "@/components/DynamicIslandToast";

/**
 * Monitor network status and show/clear sileo notifications
 */
export function NetworkStatusMonitor() {
  const isOfflineToastShown = useRef(false);

  useEffect(() => {
    const handleOnline = () => {
      if (isOfflineToastShown.current) {
        // Clear the red persistent "Offline" toast
        sileo.clear();

        // Show success "Online" toast
        sileo.success({
          title: "Back Online",
          duration: 3500,
        });

        isOfflineToastShown.current = false;
      }
    };

    const handleOffline = () => {
      if (!isOfflineToastShown.current) {
        sileo.error({
          title: "No Internet Connection",
          description: "Please check your WiFi or mobile data connection.",
          duration: 0, // Persistent until manually cleared or connection back
        });

        isOfflineToastShown.current = true;
      }
    };

    // Check initial status
    if (typeof window !== "undefined" && !window.navigator.onLine) {
      handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return null;
}
