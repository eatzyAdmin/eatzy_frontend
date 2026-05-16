"use client";
import { useDriverLocationUpdate, useSocket } from "@repo/socket";
import { useDriverStatus } from "@/features/online/hooks/useDriverStatus";
import { useEffect } from "react";

/**
 * Component to handle global background WebSocket tasks for the Driver app.
 * This includes pushing live location updates when online.
 */
export default function GlobalSocketHandlers() {
  const { status } = useDriverStatus();
  const { connected } = useSocket();

  // Push location updates if status is AVAILABLE or UNAVAILABLE (busy delivering)
  const shouldTrack = status?.toUpperCase() === "AVAILABLE" || status?.toUpperCase() === "UNAVAILABLE";

  useDriverLocationUpdate(shouldTrack);

  useEffect(() => {
    console.group("🔍 [Socket Debug] Kiểm tra trạng thái Tài xế");
    console.log("- Status hiện tại:", status);
    console.log("- Trạng thái kết nối Socket:", connected ? "✅ ĐÃ KẾT NỐI" : "❌ MẤT KẾT NỐI");
    console.log("- Nên kích hoạt Tracker không (shouldTrack):", shouldTrack);
    console.groupEnd();

    if (shouldTrack) {
      console.info("✅ ⚡ Background Location Tracking: ACTIVE");
    } else {
      console.warn("⚠️ ⚡ Background Location Tracking: INACTIVE (Lý do: Status không phải AVAILABLE)");
    }
  }, [shouldTrack, status]);

  return null;
}
