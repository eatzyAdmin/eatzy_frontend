"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { orderApi } from "@repo/api";
import { sileo } from "@/components/DynamicIslandToast";
import { useRouter } from "next/navigation";
import type { CreateOrderRequest, OrderResponse } from "@repo/types";

interface UseCreateOrderOptions {
  onSuccess?: (order: OrderResponse) => void;
  onError?: (error: Error) => void;
  restaurantName?: string;
  avatarUrl?: string;
}

export function useCreateOrder(options: UseCreateOrderOptions = {}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const attempt = useRef<{ fingerprint: string; key: string } | null>(null);

  const mutation = useMutation({
    mutationFn: async (request: CreateOrderRequest) => {
      const fingerprint = JSON.stringify(request);
      if (attempt.current?.fingerprint !== fingerprint) {
        attempt.current = { fingerprint, key: crypto.randomUUID() };
      }
      const response = await orderApi.createOrder(request, attempt.current.key);
      if (![200, 201, 202].includes(response.statusCode ?? 0)) {
        throw new Error(response.message || "Không thể tạo đơn hàng");
      }
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.orderStatus === "REJECTED" || data?.workflowStatus === "REQUIRES_REVIEW") {
        if (data.orderStatus === "REJECTED") attempt.current = null;
        sileo.error({ title: "Đơn hàng cần kiểm tra", description: data.cancellationReason || `Vui lòng kiểm tra trạng thái đơn #${data.id}.` });
        options.onSuccess?.(data);
        return;
      }
      // Invalidate cart queries since cart items become order
      queryClient.invalidateQueries({ queryKey: ["carts"] });

      sileo.success({
        title: options.restaurantName || "Đặt hàng thành công",
        description: data?.workflowStatus && data.workflowStatus !== "ACTIVE"
          ? `Đã nhận đơn #${data.id}, hệ thống đang xử lý. Theo dõi trạng thái trong đơn hàng của bạn.`
          : `Mã đơn hàng: #ORD-${data?.id || "001"}`,
        actionType: "order_place",
        avatarUrl: options.avatarUrl,
        onViewOrder: () => {
          window.dispatchEvent(new CustomEvent("openOrdersDrawer"));
        },
      } as any);

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
