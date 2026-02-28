"use client";
import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@repo/api";
import { useSwipeConfirmation } from "@repo/ui";
import { sileo } from "@/components/DynamicIslandToast";
import type { CreateReviewRequest, ReviewDTO } from "@repo/types";

// ======== Query Keys ========
const reviewKeys = {
  all: ["reviews"] as const,
  byOrder: (orderId: number) => [...reviewKeys.all, "order", orderId] as const,
};

// ======== Types ========
export interface UseReviewResult {
  /** Existing reviews for the current order */
  reviews: ReviewDTO[];
  /** Existing restaurant review if any */
  restaurantReview?: ReviewDTO;
  /** Existing driver review if any */
  driverReview?: ReviewDTO;
  /** Whether reviews are being loaded */
  isLoading: boolean;
  /** Whether restaurant has already been reviewed */
  isRestaurantReviewed: boolean;
  /** Whether driver has already been reviewed */
  isDriverReviewed: boolean;
  /** Submit a restaurant review with confirmation */
  handleReviewRestaurant: (rating: number, comment: string) => void;
  /** Submit a driver review with confirmation */
  handleReviewDriver: (rating: number, comment: string) => void;
  /** Whether a review submission is in progress */
  isSubmitting: boolean;
}

/**
 * Hook để xử lý review cho một order cụ thể.
 * - Tự fetch danh sách reviews hiện có theo orderId
 * - Quản lý việc gửi đánh giá, bao gồm cả thông báo và xác nhận vuốt.
 */
export function useReview(
  orderId: number, 
  restaurantAvatar?: string, 
  driverAvatar?: string
): UseReviewResult {
  const queryClient = useQueryClient();
  const { confirm } = useSwipeConfirmation();

  // Fetch existing reviews for this order
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: reviewKeys.byOrder(orderId),
    queryFn: async () => {
      const response = await reviewApi.getReviewsByOrderId(orderId);
      if (response.statusCode === 200 && response.data) {
        return response.data as unknown as ReviewDTO[];
      }
      return [];
    },
    enabled: orderId > 0,
    staleTime: 5 * 60 * 1000,
  });

  // Check if restaurant/driver already reviewed
  const restaurantReview = reviews.find((r: ReviewDTO) => r.reviewTarget === "restaurant");
  const driverReview = reviews.find((r: ReviewDTO) => r.reviewTarget === "driver");

  const isRestaurantReviewed = !!restaurantReview;
  const isDriverReviewed = !!driverReview;

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewApi.createReview(data),
    onSuccess: (_, variables: CreateReviewRequest) => {
      const isRestaurant = variables.reviewTarget === "restaurant";
      const target = isRestaurant ? "nhà hàng" : "tài xế";
      const actionType = isRestaurant ? "review_restaurant_success" : "review_driver_success";
      const avatarUrl = isRestaurant ? restaurantAvatar : driverAvatar;
      
      sileo.success({
        title: `Đánh giá ${target} thành công`,
        description: "Review đã được ghi nhận. Cảm ơn bạn nhé!",
        actionType,
        avatarUrl,
      } as any);
      queryClient.invalidateQueries({ queryKey: reviewKeys.byOrder(orderId) });
    },
    onError: (error: any, variables: CreateReviewRequest) => {
      const message = error?.message || "Có lỗi xảy ra khi gửi đánh giá";
      const actionType = variables.reviewTarget === "restaurant" ? "review_restaurant_error" : "review_driver_error";
      sileo.error({
        title: "Opps, đã có lỗi xảy ra!",
        description: message,
        actionType,
      } as any);
    },
  });

  const handleReviewRestaurant = useCallback(
    (rating: number, comment: string) => {
      if (rating === 0 || !comment.trim()) {
        sileo.warning({
          title: "Vui lòng chọn sao & nhận xét",
          actionType: "review_validation"
        } as any);
        return;
      }

      confirm({
        title: "Gửi đánh giá nhà hàng?",
        type: "success",
        description: "Vuốt để xác nhận gửi đánh giá của bạn",
        onConfirm: async () => {
          await createMutation.mutateAsync({
            order: { id: orderId },
            reviewTarget: "restaurant",
            rating,
            comment: comment.trim(),
          });
        },
      });
    },
    [orderId, createMutation, confirm]
  );

  const handleReviewDriver = useCallback(
    (rating: number, comment: string) => {
      if (rating === 0 || !comment.trim()) {
        sileo.warning({
          title: "Vui lòng chọn sao & nhận xét",
          actionType: "review_validation"
        } as any);
        return;
      }

      confirm({
        title: "Gửi đánh giá tài xế?",
        type: "success",
        description: "Vuốt để xác nhận gửi đánh giá của bạn",
        onConfirm: async () => {
          await createMutation.mutateAsync({
            order: { id: orderId },
            reviewTarget: "driver",
            rating,
            comment: comment.trim(),
          });
        },
      });
    },
    [orderId, createMutation, confirm]
  );

  return {
    reviews,
    restaurantReview,
    driverReview,
    isLoading,
    isRestaurantReviewed,
    isDriverReviewed,
    handleReviewRestaurant,
    handleReviewDriver,
    isSubmitting: createMutation.isPending,
  };
}
