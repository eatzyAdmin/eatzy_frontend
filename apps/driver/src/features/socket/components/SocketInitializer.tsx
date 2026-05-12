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

  // WebSocket connects through API Gateway → routed to eatzy-communication-service
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
            title: "Connection Restored",
            description: "Real-time system is back online.",
            duration: 3000,
          });
        }
      }}
      onDisconnect={() => {
        // Only show the warning once to avoid spamming
        if (!isWarningShown.current) {
          sileo.warning({
            title: "Real-time connection lost",
            description: "Reconnecting... please keep the app open.",
            duration: 0, // 0 means it won't auto-close
          });
          isWarningShown.current = true;
        }
      }}
      onStompError={(frame) => {
        console.error("STOMP Error:", frame);
        sileo.error({
          title: "Connection Error",
          description: "Unable to sync real-time data. Retrying...",
          duration: 5000,
        });
      }}
    >
      {children}
    </SocketProvider>
  );
}
