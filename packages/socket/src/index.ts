"use client";

// Client exports
export { SocketClient, type SocketConfig } from "./socket-client";
export { SocketProvider, useSocket } from "./SocketProvider";

// Integration hooks for apps
export { useDriverLocationUpdate } from "./hooks/useDriverLocationUpdate";
export { useOrderNotifications } from "./hooks/useOrderNotifications";

// Types
export interface OrderNotification {
  type: "NEW_ORDER" | "ORDER_ASSIGNED" | "ORDER_UPDATE" | "ORDER_STATUS_CHANGED";
  orderId: number;
  message: string;
  data: any;
}
