"use client";
import { useEffect } from "react";
import { useSocket } from "../SocketProvider";

/**
 * Hook to subscribe to user-specific order notifications.
 * Works for Customers (order updates), Restaurants (new orders), and Drivers (assignments).
 * 
 * @param onReceive Callback function when a notification is received
 */
export function useOrderNotifications(onReceive: (data: any) => void) {
  const { connected, subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    if (!connected) return;

    // Standard queue for order-related notifications from the backend
    const destination = "/user/queue/orders";
    
    subscribe(destination, onReceive);

    return () => {
      unsubscribe(destination);
    };
  }, [connected, subscribe, unsubscribe, onReceive]);

  return { connected };
}
