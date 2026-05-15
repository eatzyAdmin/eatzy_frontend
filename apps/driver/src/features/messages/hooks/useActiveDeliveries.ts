"use client";

import { useState, useCallback } from "react";

// Mock delivery data for the driver
const MOCK_DELIVERIES = [
  {
    id: "DEL-101",
    restaurant: {
      name: "Bún Bò Huế Oanh",
      imageUrl: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=400",
    },
    customer: {
      name: "Le Van C",
    },
    totalAmount: 125000,
    status: "PICKED_UP",
    orderItems: [
      { dish: { name: "Bún Bò Huế Đặc Biệt" } },
      { dish: { name: "Trà Đá" } }
    ]
  },
  {
    id: "DEL-102",
    restaurant: {
      name: "KFC - Tran Hung Dao",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400",
    },
    customer: {
      name: "Nguyen Thi D",
    },
    totalAmount: 250000,
    status: "PREPARING",
    orderItems: [
      { dish: { name: "Zinger Combo" } },
      { dish: { name: "Popcorn Chicken" } }
    ]
  }
];

export function useActiveDeliveries() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [deliveries, setDeliveries] = useState(MOCK_DELIVERIES);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  return {
    deliveries,
    isLoading,
    isError,
    refresh,
    refetch: refresh
  };
}
