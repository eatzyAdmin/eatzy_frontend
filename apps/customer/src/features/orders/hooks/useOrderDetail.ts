import { useState, useCallback } from "react";
import { orderApi } from "@repo/api";
import { OrderResponse } from "@repo/types";

export const useOrderDetail = () => {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async (orderId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrderById(orderId);
      if (response.statusCode === 200 || response.statusCode === 201) {
        setOrder(response.data ?? null);
      } else {
        setError(response.message || "Không thể tải thông tin đơn hàng");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải dữ liệu");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearOrder = useCallback(() => {
    setOrder(null);
    setError(null);
  }, []);

  return {
    order,
    isLoading,
    error,
    fetchOrder,
    clearOrder,
  };
};
