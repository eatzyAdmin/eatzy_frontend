"use client";
import React, { Suspense } from "react";
import { SocketProvider } from "@repo/socket";
import { sileo } from "@/components/DynamicIslandToast";
import { getAccessToken, isMockModeEnabled } from "@repo/api";
import { GlobalMessageSubscriber } from "./GlobalMessageSubscriber";

/**
 * Socket Initializer for the Customer Application.
 * Provides the shared SocketProvider with the customer's current token and backend URL.
 */
export function SocketInitializer({ children }: { children: React.ReactNode }) {
  // Use local state for token to ensure it stays in sync with API memory
  const [token, setToken] = React.useState<string | null>(null);
  const isWarningShown = React.useRef(false);
  const mockActive = typeof window !== "undefined" ? isMockModeEnabled() : true;

  // Sync token from API memory
  React.useEffect(() => {
    // Initial sync
    setToken(getAccessToken());

    // Check for token updates every 2 seconds
    const interval = setInterval(() => {
      const currentToken = getAccessToken();
      setToken((prev) => (prev !== currentToken ? currentToken : prev));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // In mock mode, use a safe mock URL so SockJS doesn't spam connection errors to the broken backend
  const WS_URL = mockActive ? "mock://" : "https://eatzy-be.hoanduong.net/ws";

  return (
    <SocketProvider
      url={WS_URL}
      token={mockActive ? "mock_token" : token}
      onConnect={() => {
        if (!mockActive) {
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
        }
      }}
      onDisconnect={() => {
        if (!mockActive && !isWarningShown.current) {
          sileo.warning({
            title: "Mất kết nối thời gian thực",
            description: "Đang thử kết nối lại...",
            duration: 0,
          });
          isWarningShown.current = true;
        }
      }}
      onStompError={(frame: any) => {
        if (!mockActive) {
          console.error("STOMP Error:", frame);
        }
      }}
    >
      <Suspense fallback={null}>
        {!mockActive && <GlobalMessageSubscriber />}
      </Suspense>
      {children}
    </SocketProvider>
  );
}
