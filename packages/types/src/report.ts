
export interface RevenueReportItemDTO {
    date: string; // LocalDate as string
    foodRevenue: number;
    deliveryFee: number;
    discountAmount: number;
    commissionAmount: number;
    netRevenue: number;
    totalOrders: number;
}

export interface OrderStatusBreakdownDTO {
    status: string;
    count: number;
    percent: number;
}

export interface FullReportDTO {
    totalRevenue: number;
    netRevenue: number;
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    cancelRate: number;
    averageOrderValue: number;
    averageRating: number;
    totalReviews: number;
    topPerformingDish: string;
    revenueChart: RevenueReportItemDTO[];
    orderStatusBreakdown: OrderStatusBreakdownDTO[];
}

export interface OrderReportItemDTO {
    id: string; // Order ID
    orderCode: string;
    customerName: string;
    customerPhone: string;
    orderTime: string; // Instant/Date as string
    deliveredTime: string | null;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    subtotal: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    itemsCount: number;
    cancellationReason?: string;
}

export interface MenuAnalyticsItemDTO {
    dishId: string;
    dishName: string;
    categoryName: string;
    imageUrl: string;
    price: number;
    totalOrdered: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
    trend: string; // 'up' | 'down' | 'stable'
    trendPercent: number;
}

export interface CategoryAnalyticsItemDTO {
    categoryId: string;
    categoryName: string;
    totalDishes: number;
    totalOrdered: number;
    totalRevenue: number;
    percentOfTotal: number;
}

export interface MenuSummaryDTO {
    totalDishes: number;
    activeDishes: number;
    outOfStockDishes: number;
    topSellingDishes: MenuAnalyticsItemDTO[];
    lowPerformingDishes: MenuAnalyticsItemDTO[];
    categoryBreakdown: CategoryAnalyticsItemDTO[];
}

export interface ReviewReportItemDTO {
    id: string;
    orderId: string;
    orderCode: string; // Added from mock
    customerName: string;
    rating: number;
    comment: string;
    reply: string | null;
    dishNames: string[];
    createdAt: string;
}

export interface ReviewSummaryDTO {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
        oneStar: number;
        twoStar: number;
        threeStar: number;
        fourStar: number;
        fiveStar: number;
    };
    recentReviews: ReviewReportItemDTO[];
    responseRate: number;
    averageResponseTime: number;
}
