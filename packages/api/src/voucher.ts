import { http } from "./http";
import type { IBackendRes, Voucher } from "../../types/src";

// ======== Voucher API ========

export const voucherApi = {
  /**
   * Get vouchers for a specific restaurant
   * Endpoint: GET /api/v1/vouchers/restaurant/{restaurantId}
   */
  getVouchersByRestaurantId: (restaurantId: number) => {
    return http.get<IBackendRes<Voucher[]>>(
      `/api/v1/vouchers/restaurant/${restaurantId}`
    ) as unknown as Promise<IBackendRes<Voucher[]>>;
  },

  /**
   * Get voucher by code
   * Endpoint: GET /api/v1/vouchers/code/{code}
   */
  getVoucherByCode: (code: string) => {
    return http.get<IBackendRes<Voucher>>(
      `/api/v1/vouchers/code/${code}`
    ) as unknown as Promise<IBackendRes<Voucher>>;
  },

  /**
   * Get voucher by ID
   * Endpoint: GET /api/v1/vouchers/{id}
   */
  getVoucherById: (id: number) => {
    return http.get<IBackendRes<Voucher>>(
      `/api/v1/vouchers/${id}`
    ) as unknown as Promise<IBackendRes<Voucher>>;
  },

  /**
   * Get available vouchers for an order
   * Endpoint: GET /api/v1/vouchers/available/order/{orderId}
   */
  getAvailableVouchersForOrder: (orderId: number) => {
    return http.get<IBackendRes<Voucher[]>>(
      `/api/v1/vouchers/available/order/${orderId}`
    ) as unknown as Promise<IBackendRes<Voucher[]>>;
  },
};
