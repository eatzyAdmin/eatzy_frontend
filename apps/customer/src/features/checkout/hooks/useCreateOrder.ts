"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@repo/api";
import { sileo } from "@/components/DynamicIslandToast";
import { useRouter } from "next/navigation";
import type { CreateOrderRequest, OrderResponse } from "@repo/types";

interface UseCreateOrderOptions {
  onSuccess?: (order: OrderResponse) => void;
  onError?: (error: Error) => void;
}

export function useCreateOrder(options: UseCreateOrderOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      const response = await orderApi.createOrder(request);
      if (response.statusCode !== 201 && response.statusCode !== 200) {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate cart queries since cart items become order
      queryClient.invalidateQueries({ queryKey: ["carts"] });

      sileo.success({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đang được xử lý",
      });

      // If VNPAY payment, redirect to payment URL
      if (data?.vnpayPaymentUrl) {
        window.location.href = data.vnpayPaymentUrl;
        return;
      }

      // Redirect to home page after successful order
      router.push('/home');

      options.onSuccess?.(data!);
    },
    onError: (error: Error) => {
      sileo.error({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra khi đặt hàng",
      });
      options.onError?.(error);
    },
  });

  return {
    createOrder: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
}
