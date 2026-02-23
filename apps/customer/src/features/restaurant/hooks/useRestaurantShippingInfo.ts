"use client";
import { useQuery } from "@tanstack/react-query";
import { orderApi, voucherApi } from "@repo/api";
import { useDeliveryLocationStore } from "@/store/deliveryLocationStore";
import { useMemo } from "react";
import type { Voucher } from "@repo/types";

export function useRestaurantShippingInfo(restaurantId: number | null) {
  const { selectedLocation } = useDeliveryLocationStore();

  // Fetch delivery fee and distance
  const { data: deliveryInfo, isLoading: isLoadingFee } = useQuery({
    queryKey: ['delivery-info', restaurantId, selectedLocation?.latitude, selectedLocation?.longitude],
    queryFn: async () => {
      if (!restaurantId || !selectedLocation?.latitude || !selectedLocation?.longitude) return null;
      const res = await orderApi.calculateDeliveryFee({
        restaurantId,
        deliveryLatitude: selectedLocation.latitude,
        deliveryLongitude: selectedLocation.longitude,
      });
      if (res.statusCode === 200 && res.data) {
        return res.data;
      }
      return null;
    },
    enabled: !!restaurantId && !!selectedLocation?.latitude && !!selectedLocation?.longitude,
  });

  // Fetch vouchers to find the best FREESHIP one
  const { data: vouchers, isLoading: isLoadingVouchers } = useQuery({
    queryKey: ['vouchers', 'restaurant', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const res = await voucherApi.getVouchersByRestaurantId(restaurantId);
      if (res.statusCode === 200 && res.data) {
        return res.data;
      }
      return [];
    },
    enabled: !!restaurantId,
  });

  const baseFee = deliveryInfo?.deliveryFee || 0;
  const distance = deliveryInfo?.distance || 0;

  // Find the best FREESHIP voucher
  const bestFreeshipVoucher = useMemo(() => {
    if (!vouchers) return null;

    // Filter FREESHIP vouchers and find the one with highest maxDiscountAmount (or if null, it covers full baseFee)
    const freeshipVouchers = vouchers.filter(v => v.discountType === 'FREESHIP');
    if (freeshipVouchers.length === 0) return null;

    return freeshipVouchers.reduce((prev: Voucher | null, curr) => {
      if (!prev) return curr;
      const prevMax = prev.maxDiscountAmount ?? Infinity;
      const currMax = curr.maxDiscountAmount ?? Infinity;
      return currMax > prevMax ? curr : prev;
    }, null);
  }, [vouchers]);

  const maxShippingDiscount = useMemo(() => {
    if (!bestFreeshipVoucher) return 0;
    if (bestFreeshipVoucher.maxDiscountAmount) {
      return Math.min(baseFee, bestFreeshipVoucher.maxDiscountAmount);
    }
    return baseFee;
  }, [bestFreeshipVoucher, baseFee]);

  const finalFee = Math.max(0, baseFee - maxShippingDiscount);
  const minOrderForDiscount = bestFreeshipVoucher?.minOrderValue || 0;

  return {
    baseFee,
    finalFee,
    distance,
    maxShippingDiscount,
    minOrderForDiscount,
    hasFreeship: !!bestFreeshipVoucher,
    isLoading: isLoadingFee || isLoadingVouchers,
    selectedLocation,
  };
}
