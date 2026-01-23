"use client";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { DriverOrderOffer, DriverActiveOrder, DriverEarningsSummary, DriverOrderPhase, OrderResponse, PaymentMethod } from "@repo/types";
import { orderApi } from "@repo/api";

export const orderOffersKeys = {
  all: ["order-offers"] as const,
  myOffers: () => [...orderOffersKeys.all, "my-offers"] as const,
};

export default function useOrderOffers(online: boolean) {
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoAcceptRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: orderOffersKeys.myOffers(),
    queryFn: async () => {
      // Use explicit status filtering for better compatibility with backend Spring Filter
      const ACTIVE_STATUSES = ['PREPARING', 'DRIVER_ASSIGNED', 'READY', 'PICKED_UP', 'ARRIVED'];
      const statusFilter = ACTIVE_STATUSES.map(s => `orderStatus~'${s}'`).join(' or ');
      
      const response = await orderApi.getMyDriverOrders({
        filter: statusFilter,
      });
      return response.data;
    },
    enabled: online,
    refetchInterval: 5000, // 5s polling
  });

  const orders = ordersData?.result || [];

  useEffect(() => {
    if (online) {
      console.log("DEBUG: Driver is online, orders fetched:", orders);
    }
  }, [orders, online]);

  const { currentOffer, activeOrder } = useMemo(() => {
    console.log("DEBUG: Processing orders for panels, total orders:", orders.length);
    // Current Panel statuses: AFTER PREPARING
    const CURRENT_PANEL_STATUSES = ['DRIVER_ASSIGNED', 'READY', 'PICKED_UP', 'ARRIVED'];
    
    // An order is an active order (Current Panel) if its status is in CURRENT_PANEL_STATUSES
    const active = orders.find(o => CURRENT_PANEL_STATUSES.includes(o.orderStatus));
    console.log("DEBUG: Found active order (Current Panel):", active?.id, "Status:", active?.orderStatus);

    // If there's an active order, we show the Current Panel
    if (active) {
      const activeOrder: DriverActiveOrder = {
        id: active.id.toString(),
        phase: (active.orderStatus === 'PICKED_UP' || active.orderStatus === 'ARRIVED') ? 'DELIVERY' : 'PICKUP',
        orderStatus: active.orderStatus,
        pickup: {
          name: active.restaurant.name,
          address: active.restaurant.address || '',
          lng: active.restaurant.longitude || 0,
          lat: active.restaurant.latitude || 0,
        },
        dropoff: {
          address: active.deliveryAddress,
          lng: active.deliveryLongitude,
          lat: active.deliveryLatitude,
        },
        driverLocation: {
          lng: active.driver?.longitude || 0,
          lat: active.driver?.latitude || 0,
        },
        customer: {
          id: active.customer?.id,
          name: active.customer?.name,
          phoneNumber: active.customer?.phoneNumber,
        },
        paymentMethod: active.paymentMethod as PaymentMethod,
        earnings: {
          orderId: active.id.toString(),
          orderSubtotal: active.subtotal,
          deliveryFee: active.deliveryFee,
          driverNetEarning: active.driverNetEarning || 0,
        } as DriverEarningsSummary,
        distanceKm: active.distance,
      };
      return { currentOffer: null, activeOrder };
    }

    // Otherwise, it's an offer (Recommend Panel)
    const offer = orders.find(o => !CURRENT_PANEL_STATUSES.includes(o.orderStatus));
    console.log("DEBUG: Found offer (Recommend Panel):", offer?.id, "Status:", offer?.orderStatus);

    if (offer) {
      const currentOffer: DriverOrderOffer = {
        id: offer.id.toString(),
        netEarning: offer.driverNetEarning || 0,
        orderValue: offer.totalAmount,
        paymentMethod: offer.paymentMethod as PaymentMethod,
        distanceKm: offer.distance || 0,
        pickup: {
          name: offer.restaurant.name,
          address: offer.restaurant.address || '',
          lng: offer.restaurant.longitude || 0,
          lat: offer.restaurant.latitude || 0,
        },
        dropoff: {
          address: offer.deliveryAddress,
          lng: offer.deliveryLongitude,
          lat: offer.deliveryLatitude,
        },
        expireSeconds: 30,
      };
      return { currentOffer, activeOrder: null };
    }

    return { currentOffer: null, activeOrder: null };
  }, [orders]);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const acceptMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await orderApi.acceptOrderByDriver(parseInt(orderId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderOffersKeys.all });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (orderId: string) => {
      return await orderApi.rejectOrderByDriver(parseInt(orderId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderOffersKeys.all });
    },
  });

  const offerId = currentOffer?.id;

  // Handle countdown and auto-accept
  useEffect(() => {
    if (offerId && currentOffer) {
      setCountdown(30);
      clearCountdown();
      
      countdownRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearCountdown();
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      // Auto-accept after 30 seconds
      if (autoAcceptRef.current) clearTimeout(autoAcceptRef.current);
      autoAcceptRef.current = setTimeout(() => {
        acceptMutation.mutate(currentOffer.id);
      }, 30000);
    } else {
      setCountdown(0);
      clearCountdown();
      if (autoAcceptRef.current) {
        clearTimeout(autoAcceptRef.current);
        autoAcceptRef.current = null;
      }
    }

    return () => {
      clearCountdown();
      if (autoAcceptRef.current) {
        clearTimeout(autoAcceptRef.current);
        autoAcceptRef.current = null;
      }
    };
  }, [offerId, clearCountdown, acceptMutation]);

  const acceptOffer = useCallback(() => {
    if (currentOffer) {
      acceptMutation.mutate(currentOffer.id);
    }
  }, [currentOffer, acceptMutation]);

  const rejectOffer = useCallback(() => {
    if (currentOffer) {
      rejectMutation.mutate(currentOffer.id);
    }
  }, [currentOffer, rejectMutation]);

  return { 
    currentOffer, 
    activeOrder,
    countdown, 
    acceptOffer, 
    rejectOffer,
    isLoading 
  };
}

