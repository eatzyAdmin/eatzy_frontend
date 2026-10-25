"use client";
import React, { Suspense } from "react";
import { SocketProvider } from "@repo/socket";
import { useAuthStore } from "@repo/store";
import { sileo } from "@/components/DynamicIslandToast";
import { getAccessToken, isMockModeEnabled } from "@repo/api";
import { GlobalMessageSubscriber } from "./GlobalMessageSubscriber";

/**
 * Socket Initializer for the Driver Application.
 * Provides the shared SocketProvider with the driver's current token and backend URL.
 */
export function SocketInitializer({ children }: { children: React.ReactNode }) {
  // Use local state for token to ensure it stays in sync with API memory
  const [token, setToken] = React.useState<string | null>(null);
  const isWarningShown = React.useRef(false);
  const mockActive = typeof window !== "undefined" ? isMockModeEnabled() : true;

  // Sync token from API memory since Zustand doesn't persist it across refreshes
  React.useEffect(() => {
    // Initial sync
    setToken(getAccessToken());

    // Check for token updates every 2 seconds (e.g. after refresh/login)
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
          console.info("⚡ WebSocket connected to " + WS_URL);
          // Clear any persistent warning toasts when connection is restored
          if (isWarningShown.current) {
            sileo.clear();
            isWarningShown.current = false;
            
            sileo.success({
              title: "Connection Restored",
              description: "Real-time system is back online.",
              duration: 3000,
            });
          }
        }
      }}
      onDisconnect={() => {
        if (!mockActive && !isWarningShown.current) {
          sileo.warning({
            title: "Real-time connection lost",
            description: "Reconnecting... please keep the app open.",
            duration: 0,
          });
          isWarningShown.current = true;
        }
      }}
      onStompError={(frame) => {
        if (!mockActive) {
          console.error("STOMP Error:", frame);
          sileo.error({
            title: "Connection Error",
            description: "Unable to sync real-time data. Retrying...",
            duration: 5000,
          });
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
