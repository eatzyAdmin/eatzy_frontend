"use client";
import React from "react";
import { SocketProvider } from "@repo/socket";
import { sileo } from "@/components/DynamicIslandToast";
import { getAccessToken } from "@repo/api";

/**
 * Socket Initializer for the Customer Application.
 * Provides the shared SocketProvider with the customer's current token and backend URL.
 */
export function SocketInitializer({ children }: { children: React.ReactNode }) {
  // Use local state for token to ensure it stays in sync with API memory
  const [token, setToken] = React.useState<string | null>(null);
  const isWarningShown = React.useRef(false);

  // Sync token from API memory
  React.useEffect(() => {
    // Initial sync
    setToken(getAccessToken());

    // Check for token updates every 2 seconds
    const interval = setInterval(() => {
      const currentToken = getAccessToken();
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [token]);

  // WebSocket connects through API Gateway → routed to eatzy-communication-service
  const WS_URL = "https://eatzy-be.hoanduong.net/ws";

  return (
    <SocketProvider
      url={WS_URL}
      token={token}
      onConnect={() => {
        console.info("⚡ [Customer] WebSocket connected to " + WS_URL);
        if (isWarningShown.current) {
          sileo.clear();
          isWarningShown.current = false;
          sileo.success({
            title: "Đã kết nối",
            description: "Hệ thống thời gian thực đã hoạt động trở lại.",
            duration: 3000,
          });
        }
      }}
      onDisconnect={() => {
        if (!isWarningShown.current) {
          sileo.warning({
            title: "Mất kết nối thời gian thực",
            description: "Đang thử kết nối lại...",
            duration: 0,
          });
          isWarningShown.current = true;
        }
      }}
      onStompError={(frame: any) => {
        console.error("STOMP Error:", frame);
      }}
    >
      {children}
    </SocketProvider>
  );
}
