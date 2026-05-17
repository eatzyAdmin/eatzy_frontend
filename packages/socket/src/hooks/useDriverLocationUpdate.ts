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
  const lastPositionRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active tracking logic using watchPosition (warm stream, zero cold-start timeouts)
  useEffect(() => {
    if (!isAvailable || !connected) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation is not available on this device");
      return;
    }

    // Start a warm position watch
    console.info("⚡ [Geolocation] Khởi chạy watchPosition để theo dõi vị trí thực tế...");
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        lastPositionRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.debug("📍 [Geolocation] Cập nhật vị trí thực tế mới:", lastPositionRef.current);
      },
      (error) => {
        console.error("❌ [Geolocation] Lỗi luồng vị trí thực tế:", error.message);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000, 
        maximumAge: 5000 
      }
    );

    // Publish the latest genuine coordinate periodically
    intervalRef.current = setInterval(() => {
      if (lastPositionRef.current) {
        const payload = {
          latitude: lastPositionRef.current.latitude,
          longitude: lastPositionRef.current.longitude,
          timestamp: new Date().toISOString()
        };
        
        publish("/app/driver/location", payload);
        console.info(`📍 [Socket] Đã đẩy vị trí thực tế lên Server: ${payload.latitude}, ${payload.longitude}`);
      } else {
        console.warn("⚠️ [Socket] Chưa có vị trí thực tế hợp lệ từ thiết bị để gửi.");
      }
    }, intervalMs);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAvailable, connected, publish, intervalMs]);

  // Clean, manual trigger that utilizes current geolocation to fetch once if needed
  const forceUpdate = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lastPositionRef.current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date().toISOString()
        };
        publish("/app/driver/location", payload);
      },
      (err) => console.error("❌ [Socket] Force update failed:", err.message),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [publish]);

  return { forceUpdate };
}
