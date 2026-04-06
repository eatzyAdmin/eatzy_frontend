"use client";
import React from "react";
import { SocketProvider } from "@repo/socket";
import { useAuthStore } from "@repo/store";
import { sileo } from "@/components/DynamicIslandToast";

import { getAccessToken } from "@repo/api";

/**
 * Socket Initializer for the Driver Application.
 * Provides the shared SocketProvider with the driver's current token and backend URL.
 */
export function SocketInitializer({ children }: { children: React.ReactNode }) {
  // Use local state for token to ensure it stays in sync with API memory
  const [token, setToken] = React.useState<string | null>(null);
  const isWarningShown = React.useRef(false);

  // Sync token from API memory since Zustand doesn't persist it across refreshes
  React.useEffect(() => {
    // Initial sync
    setToken(getAccessToken());

    // Check for token updates every 2 seconds (e.g. after refresh/login)
    const interval = setInterval(() => {
      const currentToken = getAccessToken();
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  // Use the production backend URL found in next.config.mjs
  const WS_URL = "https://eatzy-be.hoanduong.net/ws";

  return (
    <SocketProvider
      url={WS_URL}
      token={token}
      onConnect={() => {
        console.info("⚡ WebSocket connected to " + WS_URL);
        // Clear any persistent warning toasts when connection is restored
        if (isWarningShown.current) {
          sileo.clear();
          isWarningShown.current = false;
          
          sileo.success({
            title: "Đã khôi phục kết nối",
            description: "Hệ thống real-time đã hoạt động trở lại.",
            duration: 3000,
          });
        }
      }}
      onDisconnect={() => {
        // Only show the warning once to avoid spamming
        if (!isWarningShown.current) {
          sileo.warning({
            title: "Mất kết nối real-time",
            description: "Hệ thống đang thử kết nối lại, vui lòng giữ ứng dụng mở...",
            duration: 0, // 0 means it won't auto-close
          });
          isWarningShown.current = true;
        }
      }}
      onStompError={(frame) => {
        console.error("STOMP Error:", frame);
        sileo.error({
          title: "Lỗi đường truyền",
          description: "Không thể đồng bộ dữ liệu real-time. Đang thử lại...",
          duration: 5000,
        });
      }}
    >
      {children}
    </SocketProvider>
  );
}
