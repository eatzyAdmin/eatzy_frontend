"use client";
import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "../SocketProvider";

/**
 * Hook to share driver's live position with the server via WebSocket.
 * Used by the Driver App to ensure they are searchable by radius for orders.
 * 
 * @param isAvailable True if driver is in AVAILABLE status
 * @param intervalMs How often to push position (default: 20 seconds)
 */
export function useDriverLocationUpdate(isAvailable: boolean, intervalMs = 20000) {
  const { publish, connected } = useSocket();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendLatestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation is not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString()
        };
        
        publish("/app/driver/location", payload);
        console.info(`📍 [Socket] Đã đẩy vị trí lên Server: ${payload.latitude}, ${payload.longitude}`);
      },
      (error) => {
        console.error("❌ [Socket] Lỗi lấy vị trí tài xế:", error.message);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 15000, // Tăng lên 15 giây để tránh lỗi Timeout ở vùng sóng yếu
        maximumAge: 5000 
      }
    );
  }, [publish]);

  // Handle periodic updates
  useEffect(() => {
    if (!isAvailable || !connected) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial immediate update when both available and connected
    sendLatestLocation();

    // Setup heartbeat
    intervalRef.current = setInterval(sendLatestLocation, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAvailable, connected, sendLatestLocation, intervalMs]);

  return { forceUpdate: sendLatestLocation };
}
