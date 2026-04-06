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
          title: "Đã có mạng trở lại",
          duration: 3500,
        });

        isOfflineToastShown.current = false;
      }
    };

    const handleOffline = () => {
      if (!isOfflineToastShown.current) {
        sileo.error({
          title: "Mất kết nối Internet",
          description: "Vui lòng kiểm tra lại đường truyền WiFi/4G để tiếp tục sử dụng.",
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
