"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DriverOrderOffer, DriverActiveOrder, DriverEarningsSummary, DriverOrderPhase } from "@repo/types";
import { getMockOffer } from "@/features/orders/data/mockOffers";

export default function useOrderOffers(online: boolean, hasActiveOrder: boolean) {
  const [currentOffer, setCurrentOffer] = useState<DriverOrderOffer | null>(null);
  const [countdown, setCountdown] = useState(0);
  const offerIndexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCountdown = useCallback(() => { if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; } }, []);
  const startCountdown = useCallback((seconds: number) => {
    clearCountdown();
    setCountdown(seconds);
    countdownRef.current = setInterval(() => { setCountdown((c) => { if (c <= 1) { clearCountdown(); setCurrentOffer(null); return 0; } return c - 1; }); }, 1000);
  }, [clearCountdown]);

  useEffect(() => {
    if (!online || hasActiveOrder) { setCurrentOffer(null); clearCountdown(); if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } return; }
    if (timerRef.current) return;
    const tick = () => {
      const next = getMockOffer(offerIndexRef.current++);
      setCurrentOffer(next);
      startCountdown(next.expireSeconds);
    };
    timerRef.current = setInterval(tick, 20000);
    // trigger immediately for demo
    tick();
    return () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } clearCountdown(); };
  }, [online, hasActiveOrder, startCountdown, clearCountdown]);

  const acceptOffer = () => {
    if (!currentOffer) return null;
    const offer = currentOffer;
    setCurrentOffer(null);
    clearCountdown();
    const order: DriverActiveOrder = {
      id: offer.id,
      phase: "PICKUP" as DriverOrderPhase,
      pickup: offer.pickup,
      dropoff: offer.dropoff,
      paymentMethod: offer.paymentMethod,
      earnings: {
        orderId: offer.id,
        orderSubtotal: offer.orderValue,
        deliveryFee: 0,
        driverNetEarning: offer.netEarning,
      } as DriverEarningsSummary,
      distanceKm: offer.distanceKm,
    };
    return order;
  };

  const rejectOffer = () => { setCurrentOffer(null); clearCountdown(); };

  return { currentOffer, countdown, acceptOffer, rejectOffer };
}

