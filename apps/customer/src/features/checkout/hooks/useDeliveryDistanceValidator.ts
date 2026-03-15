"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { systemConfigApi } from "@repo/api";
import { sileo } from "@/components/DynamicIslandToast";

export function useDeliveryDistanceValidator(currentDistance: number) {
  const [showWarning, setShowWarning] = useState(false);

  const { data: maxDistanceConfig } = useQuery({
    queryKey: ["system-config", "MAX_RESTAURANT_DISTANCE_KM"],
    queryFn: async () => {
      const res = await systemConfigApi.getConfigByKey("MAX_RESTAURANT_DISTANCE_KM");
      if (res.statusCode === 200 && res.data) {
        return Number(res.data.configValue);
      }
      return 20; // Default fallback
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const maxDistance = maxDistanceConfig ?? 20;
  const isOverDistance = currentDistance > maxDistance;

  useEffect(() => {
    if (isOverDistance) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [isOverDistance]);

  const handleRestrictedAction = () => {
    if (isOverDistance) {
      setShowWarning(true);
      return true;
    }
    return false;
  };

  return {
    isOverDistance,
    maxDistance,
    showWarning,
    setShowWarning,
    handleRestrictedAction,
  };
}
