import { http } from "./http";
import type { IBackendRes, ReviewDTO, ReviewReplyRequest, CreateReviewRequest } from "../../types/src";
export type { ReviewDTO };

export type ReviewPage = {
  result: ReviewDTO[];
  meta: { page: number; pageSize: number; pages: number; total: number };
};
export type ReviewPageParams = { page?: number; size?: number };

function pageParams(params: ReviewPageParams = {}) {
  const page = params.page ?? 1;
  const size = params.size ?? 20;
  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(size) || size < 1) {
    throw new RangeError("Review page and size must be positive integers");
  }
  return new URLSearchParams({ page: String(page), size: String(Math.min(size, 100)) });
}

function reviewPage(path: string, params: URLSearchParams) {
  return http.get<IBackendRes<ReviewPage>>(`${path}?${params.toString()}`) as unknown as Promise<IBackendRes<ReviewPage>>;
}

// ======== Review API ========

export const reviewApi = {
  getReviewsByCustomerPage: (customerId: number, params?: ReviewPageParams) =>
    reviewPage(`/api/v1/reviews/customer/${customerId}/paginated`, pageParams(params)),

  getReviewsByOrderPage: (orderId: number, params?: ReviewPageParams) =>
    reviewPage(`/api/v1/reviews/order/${orderId}/paginated`, pageParams(params)),

  getReviewsByTargetPage: (reviewTarget: 'restaurant' | 'driver', targetName: string, params?: ReviewPageParams) => {
    const query = pageParams(params);
    query.set('reviewTarget', reviewTarget);
    query.set('targetName', targetName);
    return reviewPage('/api/v1/reviews/target/paginated', query);
  },

  /** Prefer stable IDs when restaurants or drivers can share a display name. */
  getReviewsByTargetId: (reviewTarget: 'restaurant' | 'driver', targetId: number, params?: ReviewPageParams) => {
    const query = pageParams(params);
    query.set('reviewTarget', reviewTarget);
    query.set('targetId', String(targetId));
    return reviewPage('/api/v1/reviews/target-id', query);
  },
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
  getAllReviews: (params?: { page?: number; size?: number; filter?: string; sort?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page !== undefined) queryParams.append('page', params.page.toString());
    if (params?.size !== undefined) queryParams.append('size', params.size.toString());
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.sort) queryParams.append('sort', params.sort);

    return http.get<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>(
      `/api/v1/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    ) as unknown as Promise<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>;
  },

  /**
   * Get reviews for current owner's restaurant
   * GET /api/v1/reviews/my-restaurant
   */
  getMyRestaurantReviews: () => {
    return http.get<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>(
      `/api/v1/reviews/my-restaurant`
    ) as unknown as Promise<IBackendRes<{ result: ReviewDTO[]; meta: { page: number; pages: number; total: number } }>>;
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
   * @deprecated Legacy array is limited to 100 results; use getReviewsByTargetId or getReviewsByTargetPage.
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
