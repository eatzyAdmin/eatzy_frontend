import { http } from "./http";
import type { IBackendRes } from "../../types/src";

// ======== Review Types ========

export interface ReviewDTO {
  id: number;
  order: {
    id: number;
  };
  customer: {
    id: number;
    name: string;
  };
  reviewTarget: 'restaurant' | 'driver';
  targetName: string;
  rating: number;
  comment: string;
  reply: string | null;
  createdAt: string;
}

export interface ReviewReplyRequest {
  id: number;
  reply: string;
}

// ======== Review API ========

export const reviewApi = {
  /**
   * Get all reviews with pagination and filtering
   * GET /api/v1/reviews
   */
  getAllReviews: (params?: { page?: number; size?: number; filter?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.filter) queryParams.append('filter', params.filter);

    return http.get<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>(
      `/api/v1/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    ) as unknown as Promise<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>;
  },

  /**
   * Get reviews for current owner's restaurant
   * GET /api/v1/reviews/my-restaurant
   */
  getMyRestaurantReviews: () => {
    return http.get<IBackendRes<ReviewDTO[]>>(
      `/api/v1/reviews/my-restaurant`
    ) as unknown as Promise<IBackendRes<ReviewDTO[]>>;
  },

  /**
   * Get review by ID
   * GET /api/v1/reviews/{id}
   */
  getReviewById: (id: number) => {
    return http.get<IBackendRes<ReviewDTO>>(`/api/v1/reviews/${id}`);
  },

  /**
   * Reply to a review (update review with reply)
   * PUT /api/v1/reviews
   */
  replyToReview: (reviewId: number, reply: string) => {
    return http.put<IBackendRes<ReviewDTO>>(`/api/v1/reviews`, {
      id: reviewId,
      reply
    });
  },

  /**
   * Get reviews by order ID
   * GET /api/v1/reviews/order/{orderId}
   */
  getReviewsByOrderId: (orderId: number) => {
    return http.get<IBackendRes<ReviewDTO[]>>(`/api/v1/reviews/order/${orderId}`);
  },

  /**
   * Get reviews by target (restaurant or driver name)
   * GET /api/v1/reviews/target
   */
  getReviewsByTarget: (reviewTarget: 'restaurant' | 'driver', targetName: string) => {
    const params = new URLSearchParams();
    params.append('reviewTarget', reviewTarget);
    params.append('targetName', targetName);
    return http.get<IBackendRes<ReviewDTO[]>>(`/api/v1/reviews/target?${params.toString()}`);
  }
};
