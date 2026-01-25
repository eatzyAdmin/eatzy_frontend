import { http } from "./http";
import type { IBackendRes, Voucher } from "../../types/src";

// ======== Voucher API ========

export const voucherApi = {
  /**
   * Status: Management Methods
   */

  /**
   * Create new voucher
   * Endpoint: POST /api/v1/vouchers
   */
  createVoucher: (voucher: Partial<Voucher>) => {
    return http.post<IBackendRes<Voucher>>(
      `/api/v1/vouchers`,
      voucher
    ) as unknown as Promise<IBackendRes<Voucher>>;
  },

  /**
   * Update voucher
   * Endpoint: PUT /api/v1/vouchers
   */
  updateVoucher: (voucher: Partial<Voucher>) => {
    return http.put<IBackendRes<Voucher>>(
      `/api/v1/vouchers`,
      voucher
    ) as unknown as Promise<IBackendRes<Voucher>>;
  },

  /**
   * Get all vouchers (paginated)
   * Endpoint: GET /api/v1/vouchers
   */
  getAllVouchers: (params?: any) => {
    return http.get<IBackendRes<any>>(
      `/api/v1/vouchers`,
      { params }
    ) as unknown as Promise<IBackendRes<any>>;
  },

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

  /**
   * Delete voucher by id
   * Endpoint: DELETE /api/v1/vouchers/{id}
   */
  deleteVoucher: (id: number) => {
    return http.delete<IBackendRes<void>>(
      `/api/v1/vouchers/${id}`
    ) as unknown as Promise<IBackendRes<void>>;
  },

  /**
   * Toggle voucher active status
   * Endpoint: PUT /api/v1/vouchers/{id}/toggle
   */
  toggleVoucherActive: (id: number) => {
    return http.put<IBackendRes<Voucher>>(
      `/api/v1/vouchers/${id}/toggle`
    ) as unknown as Promise<IBackendRes<Voucher>>;
  },
};
