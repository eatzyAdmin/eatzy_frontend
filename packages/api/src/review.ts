import { http } from "./http";
import type { IBackendRes, ReviewDTO, ReviewReplyRequest, CreateReviewRequest } from "../../types/src";

// ======== Review API ========

export const reviewApi = {
  /**
   * Create a new review (customer is auto-assigned from JWT token)
   * POST /api/v1/reviews
   */
  createReview: (data: CreateReviewRequest) => {
    return http.post<IBackendRes<ReviewDTO>>(`/api/v1/reviews`, data) as unknown as Promise<IBackendRes<ReviewDTO>>;
  },

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
    return http.get<IBackendRes<ReviewDTO>>(`/api/v1/reviews/${id}`) as unknown as Promise<IBackendRes<ReviewDTO>>;
  },

  /**
   * Reply to a review (update review with reply)
   * PUT /api/v1/reviews
   */
  replyToReview: (reviewId: number, reply: string) => {
    return http.put<IBackendRes<ReviewDTO>>(`/api/v1/reviews`, {
      id: reviewId,
      reply
    }) as unknown as Promise<IBackendRes<ReviewDTO>>;
  },

  /**
   * Get reviews by order ID
   * GET /api/v1/reviews/order/{orderId}
   */
  getReviewsByOrderId: (orderId: number) => {
    return http.get<IBackendRes<ReviewDTO[]>>(`/api/v1/reviews/order/${orderId}`) as unknown as Promise<IBackendRes<ReviewDTO[]>>;
  },

  /**
   * Get reviews by target (restaurant or driver name)
   * GET /api/v1/reviews/target
   */
  getReviewsByTarget: (reviewTarget: 'restaurant' | 'driver', targetName: string) => {
    const params = new URLSearchParams();
    params.append('reviewTarget', reviewTarget);
    params.append('targetName', targetName);
    return http.get<IBackendRes<ReviewDTO[]>>(`/api/v1/reviews/target?${params.toString()}`) as unknown as Promise<IBackendRes<ReviewDTO[]>>;
  }
};
