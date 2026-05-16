"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { systemConfigApi } from "@repo/api";
import type { DriverEarningsSummary } from "@repo/types";

export function useOrderEarnings(earnings: DriverEarningsSummary | undefined) {
  // Fetch commission rate configuration from system
  const { data: commissionConfig, isLoading: isConfigLoading } = useQuery({
    queryKey: ["system-config", "DRIVER_COMMISSION_RATE"],
    queryFn: () => systemConfigApi.getConfigByKey("DRIVER_COMMISSION_RATE"),
    staleTime: 1000 * 60 * 60, // Keep for 1 hour
  });

  const driverCommissionRate = useMemo(() => {
    if (commissionConfig?.data?.configValue) {
      return parseFloat(commissionConfig.data.configValue);
    }
    return 80; // Fallback to 80% if not found
  }, [commissionConfig]);

  const calculatedEarnings = useMemo(() => {
    if (!earnings) return undefined;

    // If backend already provides net earning, use it
    if (earnings.driverNetEarning !== null && earnings.driverNetEarning !== undefined) {
      return earnings;
    }

    // Otherwise, calculate estimated values based on delivery fee and system commission rate
    const deliveryFee = earnings.deliveryFee || 0;
    const commissionAmount = (deliveryFee * driverCommissionRate) / 100;
    const netEarning = deliveryFee - commissionAmount;

    return {
      ...earnings,
      driverCommissionAmount: commissionAmount,
      driverNetEarning: netEarning,
    } as DriverEarningsSummary;
  }, [earnings, driverCommissionRate]);

  return {
    earnings: calculatedEarnings,
    isConfigLoading,
    commissionRate: driverCommissionRate,
  };
}
