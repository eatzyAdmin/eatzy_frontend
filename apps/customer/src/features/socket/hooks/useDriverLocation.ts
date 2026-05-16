"use client";
import { useState, useEffect } from "react";
import { useSocket } from "@repo/socket";

interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Hook to subscribe to real-time driver location updates for a specific order.
 * Follows the clean architecture pattern by separating socket logic from UI components.
 * 
 * @param initialLocation The initial location from the REST API (OrderResponse)
 * @returns The current (possibly updated via WebSocket) driver location
 */
export function useDriverLocation(initialLocation?: LatLng) {
  const { subscribe, unsubscribe } = useSocket();
  const [currentLocation, setCurrentLocation] = useState<LatLng | undefined>(initialLocation);

  // Sync with prop when it changes (e.g. on initial load or API refresh)
  useEffect(() => {
    if (initialLocation) {
      setCurrentLocation(initialLocation);
    }
  }, [initialLocation]);

  // Listen for real-time location updates via WebSocket
  useEffect(() => {
    // Topic defined in eatzy-communication-service: /user/queue/driver-location
    const topic = "/user/queue/driver-location";
    
    const handler = (payload: any) => {
      if (payload.latitude && payload.longitude) {
        console.info("⚡ [Socket] Nhận vị trí mới của tài xế:", payload.latitude, payload.longitude);
        setCurrentLocation({
          lat: Number(payload.latitude),
          lng: Number(payload.longitude)
        });
      }
    };

    subscribe(topic, handler);
    
    return () => {
      unsubscribe(topic);
    };
  }, [subscribe, unsubscribe]);

  return currentLocation;
}
