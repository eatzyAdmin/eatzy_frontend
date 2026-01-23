import { http } from "./http";
import type {
    IBackendRes,
    FullReportDTO,
    RevenueReportItemDTO,
    OrderReportItemDTO,
    MenuSummaryDTO,
    ReviewSummaryDTO
} from "../../types/src";

export type {
    FullReportDTO,
    RevenueReportItemDTO,
    OrderReportItemDTO,
    MenuSummaryDTO,
    ReviewSummaryDTO
};

/**
 * Report API endpoints
 * Handles restaurant analytics and reporting
 */
export const reportApi = {
    /**
     * Get full dashboard report for a restaurant
     * GET /api/v1/restaurants/reports/full
     * @param startDate Start date (ISO 8601 format)
     * @param endDate End date (ISO 8601 format)
     */
    getFullReport: async (startDate: string, endDate: string): Promise<IBackendRes<FullReportDTO>> => {
        return http.get<IBackendRes<FullReportDTO>>("/api/v1/restaurants/reports/full", {
            params: { startDate, endDate }
        }) as unknown as Promise<IBackendRes<FullReportDTO>>;
    },

    /**
     * Get revenue report for a restaurant
     * GET /api/v1/restaurants/reports/revenue
     * @param startDate Start date (ISO 8601 format)
     * @param endDate End date (ISO 8601 format)
     */
    getRevenueReport: async (startDate: string, endDate: string): Promise<IBackendRes<RevenueReportItemDTO[]>> => {
        return http.get<IBackendRes<RevenueReportItemDTO[]>>("/api/v1/restaurants/reports/revenue", {
            params: { startDate, endDate }
        }) as unknown as Promise<IBackendRes<RevenueReportItemDTO[]>>;
    },

    /**
     * Get orders report for a restaurant
     * GET /api/v1/restaurants/reports/orders
     * @param startDate Start date (ISO 8601 format)
     * @param endDate End date (ISO 8601 format)
     */
    getOrdersReport: async (startDate: string, endDate: string): Promise<IBackendRes<OrderReportItemDTO[]>> => {
        return http.get<IBackendRes<OrderReportItemDTO[]>>("/api/v1/restaurants/reports/orders", {
            params: { startDate, endDate }
        }) as unknown as Promise<IBackendRes<OrderReportItemDTO[]>>;
    },

    /**
     * Get menu analytics for a restaurant
     * GET /api/v1/restaurants/reports/menu
     */
    getMenuAnalytics: async (): Promise<IBackendRes<MenuSummaryDTO>> => {
        return http.get<IBackendRes<MenuSummaryDTO>>("/api/v1/restaurants/reports/menu") as unknown as Promise<IBackendRes<MenuSummaryDTO>>;
    },

    /**
     * Get review summary for a restaurant
     * GET /api/v1/restaurants/reports/reviews
     */
    getReviewSummary: async (): Promise<IBackendRes<ReviewSummaryDTO>> => {
        return http.get<IBackendRes<ReviewSummaryDTO>>("/api/v1/restaurants/reports/reviews") as unknown as Promise<IBackendRes<ReviewSummaryDTO>>;
    }
};
