"use client";

import { useState, useCallback } from "react";

// Mock order data for the driver to match customer structure
const MOCK_ORDERS = [
  {
    id: "EAT-101",
    restaurant: {
      name: "Bún Bò Huế Oanh",
      imageUrl: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=400",
    },
    driver: {
      name: "Nguyen Van A",
    },
    totalAmount: 125000,
    status: "PICKED_UP",
    orderItems: [
      { dish: { name: "Bún Bò Huế Đặc Biệt" } },
      { dish: { name: "Trà Đá" } }
    ]
  },
  {
    id: "EAT-102",
    restaurant: {
      name: "KFC - Tran Hung Dao",
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400",
    },
    driver: {
      name: "Tran Thi B",
    },
    totalAmount: 250000,
    status: "PREPARING",
    orderItems: [
      { dish: { name: "Zinger Combo" } },
      { dish: { name: "Popcorn Chicken" } }
    ]
  }
];

export function useCurrentOrders() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [orders, setOrders] = useState(MOCK_ORDERS);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  }, []);

  return {
    orders,
    isLoading,
    isError,
    refresh,
    refetch: refresh
  };
}
