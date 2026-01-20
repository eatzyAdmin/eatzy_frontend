// ============================================================================
// Report Service for Restaurant App
// Defines types and mock data for restaurant analytics/reports
// ============================================================================

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'MOMO' | 'ZALOPAY' | 'VNPAY' | 'CARD';

// Revenue Report Item (daily)
export interface RevenueReportItem {
  date: string;
  foodRevenue: number;      // Doanh thu từ món ăn
  deliveryFee: number;      // Phí giao hàng (platform thu)
  discountAmount: number;   // Số tiền giảm giá
  commissionAmount: number; // Hoa hồng trả platform
  netRevenue: number;       // Doanh thu thực nhận
  totalOrders: number;      // Số đơn hàng
}

// Order Report Item
export interface OrderReportItem {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  orderTime: string;
  deliveredTime: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  itemsCount: number;
  cancellationReason?: string;
}

// Menu Analytics Item
export interface MenuAnalyticsItem {
  dishId: string;
  dishName: string;
  categoryName: string;
  imageUrl: string;
  price: number;
  totalOrdered: number;     // Tổng số lượng đã bán
  totalRevenue: number;     // Tổng doanh thu
  averageRating: number;    // Đánh giá trung bình
  reviewCount: number;      // Số lượt đánh giá
  trend: 'up' | 'down' | 'stable'; // Xu hướng so với kỳ trước
  trendPercent: number;     // % thay đổi
}

// Category Analytics
export interface CategoryAnalyticsItem {
  categoryId: string;
  categoryName: string;
  totalDishes: number;
  totalOrdered: number;
  totalRevenue: number;
  percentOfTotal: number;
}

// Menu Summary DTO
export interface MenuSummaryDto {
  totalDishes: number;
  activeDishes: number;
  outOfStockDishes: number;
  topSellingDishes: MenuAnalyticsItem[];
  lowPerformingDishes: MenuAnalyticsItem[];
  categoryBreakdown: CategoryAnalyticsItem[];
}

// Review Report Item
export interface ReviewReportItem {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  rating: number;
  comment: string;
  reply: string | null;
  dishNames: string[];
  createdAt: string;
}

// Review Summary
export interface ReviewSummaryDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    oneStar: number;
    twoStar: number;
    threeStar: number;
    fourStar: number;
    fiveStar: number;
  };
  recentReviews: ReviewReportItem[];
  responseRate: number;       // % đánh giá đã trả lời
  averageResponseTime: number; // Thời gian trả lời trung bình (phút)
}

// Full Dashboard Report
export interface FullReportDto {
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
  revenueChart: RevenueReportItem[];
  orderStatusBreakdown: {
    status: OrderStatus;
    count: number;
    percent: number;
  }[];
}

// ============================================================================
// HARDCODED CONSTANTS - SINGLE SOURCE OF TRUTH
// ============================================================================
const CONSTANTS = {
  // Revenue (30 days period)
  TOTAL_FOOD_REVENUE_30_DAYS: 186_500_000,    // 186.5M VND
  TOTAL_DELIVERY_FEE_30_DAYS: 12_450_000,     // 12.45M VND (platform thu)
  TOTAL_DISCOUNT_30_DAYS: 18_650_000,         // 10% tổng doanh thu
  TOTAL_COMMISSION_30_DAYS: 27_975_000,       // 15% hoa hồng platform
  NET_REVENUE_30_DAYS: 152_325_000,           // Doanh thu thực nhận

  // Orders
  TOTAL_ORDERS: 856,
  COMPLETED_ORDERS: 789,
  CANCELLED_ORDERS: 67,
  CANCEL_RATE: 7.8, // %

  // Averages
  AVG_ORDER_VALUE: 217_874, // VND
  AVG_RATING: 4.6,
  TOTAL_REVIEWS: 423,

  // Top performer
  TOP_DISH: 'Phở Bò Tái Nạm',
};

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

const getDeterministicVariation = (dayIndex: number): number => {
  return Math.sin(dayIndex * 0.5) * 0.2;
};

// Revenue data cache
let revenueCache: Map<string, RevenueReportItem[]> = new Map();

const generateRevenueData = (startDate: Date, days: number): RevenueReportItem[] => {
  const cacheKey = `${startDate.toISOString()}-${days}`;
  if (revenueCache.has(cacheKey)) {
    return revenueCache.get(cacheKey)!;
  }

  const data = Array.from({ length: days }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const variation = getDeterministicVariation(i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const weekendBonus = isWeekend ? 1.3 : 1;

    const dailyFoodRevenue = (CONSTANTS.TOTAL_FOOD_REVENUE_30_DAYS / days) * (1 + variation) * weekendBonus;
    const dailyDeliveryFee = (CONSTANTS.TOTAL_DELIVERY_FEE_30_DAYS / days) * (1 + variation) * weekendBonus;
    const dailyDiscount = (CONSTANTS.TOTAL_DISCOUNT_30_DAYS / days) * (1 + variation);
    const dailyCommission = (CONSTANTS.TOTAL_COMMISSION_30_DAYS / days) * (1 + variation);
    const dailyOrders = Math.floor((CONSTANTS.TOTAL_ORDERS / days) * (1 + variation) * weekendBonus);

    return {
      date: date.toISOString(),
      foodRevenue: Math.floor(dailyFoodRevenue),
      deliveryFee: Math.floor(dailyDeliveryFee),
      discountAmount: Math.floor(dailyDiscount),
      commissionAmount: Math.floor(dailyCommission),
      netRevenue: Math.floor(dailyFoodRevenue - dailyCommission - dailyDiscount),
      totalOrders: dailyOrders,
    };
  });

  revenueCache.set(cacheKey, data);
  return data;
};

// Mock orders
const customerNames = [
  'Nguyễn Văn Anh', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức',
  'Hoàng Thị Em', 'Vũ Đình Phong', 'Đặng Thị Giang', 'Bùi Quang Hải',
  'Ngô Thị Inh', 'Trịnh Văn Khôi', 'Mai Thị Lan', 'Đỗ Minh Long',
];

const generateOrdersData = (): OrderReportItem[] => {
  const orders: OrderReportItem[] = [];
  const statuses: OrderStatus[] = ['DELIVERED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'CANCELLED', 'PREPARING', 'READY'];
  const paymentMethods: PaymentMethod[] = ['MOMO', 'ZALOPAY', 'CASH', 'VNPAY', 'CARD'];

  for (let i = 0; i < 50; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    orderDate.setHours(Math.floor(Math.random() * 14) + 8); // 8AM - 10PM

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const subtotal = Math.floor(150000 + Math.random() * 300000);
    const deliveryFee = 15000 + Math.floor(Math.random() * 20000);
    const discountAmount = Math.random() > 0.7 ? Math.floor(subtotal * 0.1) : 0;

    const deliveredTime = status === 'DELIVERED'
      ? new Date(orderDate.getTime() + 30 * 60 * 1000 + Math.random() * 20 * 60 * 1000).toISOString()
      : null;

    orders.push({
      id: `order-${i + 1}`,
      orderCode: `EZ${String(100000 + i).slice(1)}`,
      customerName: customerNames[i % customerNames.length],
      customerPhone: `0${9}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      orderTime: orderDate.toISOString(),
      deliveredTime,
      status,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentStatus: status === 'CANCELLED' ? 'REFUNDED' : 'PAID',
      subtotal,
      deliveryFee,
      discountAmount,
      totalAmount: subtotal + deliveryFee - discountAmount,
      itemsCount: Math.floor(Math.random() * 5) + 1,
      cancellationReason: status === 'CANCELLED' ? 'Khách hàng hủy đơn' : undefined,
    });
  }

  return orders.sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime());
};

// Mock menu analytics
const mockDishes: MenuAnalyticsItem[] = [
  {
    dishId: 'dish-1',
    dishName: 'Phở Bò Tái Nạm',
    categoryName: 'Phở & Bún',
    imageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=200',
    price: 55000,
    totalOrdered: 234,
    totalRevenue: 12870000,
    averageRating: 4.8,
    reviewCount: 89,
    trend: 'up',
    trendPercent: 15.2,
  },
  {
    dishId: 'dish-2',
    dishName: 'Bún Bò Huế',
    categoryName: 'Phở & Bún',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200',
    price: 60000,
    totalOrdered: 189,
    totalRevenue: 11340000,
    averageRating: 4.7,
    reviewCount: 67,
    trend: 'up',
    trendPercent: 8.5,
  },
  {
    dishId: 'dish-3',
    dishName: 'Cơm Tấm Sườn Bì',
    categoryName: 'Cơm',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200',
    price: 50000,
    totalOrdered: 156,
    totalRevenue: 7800000,
    averageRating: 4.5,
    reviewCount: 45,
    trend: 'stable',
    trendPercent: 2.1,
  },
  {
    dishId: 'dish-4',
    dishName: 'Bánh Mì Thịt Nướng',
    categoryName: 'Bánh Mì',
    imageUrl: 'https://images.unsplash.com/photo-1600859722032-dc9b8b4d8c6c?w=200',
    price: 35000,
    totalOrdered: 312,
    totalRevenue: 10920000,
    averageRating: 4.6,
    reviewCount: 78,
    trend: 'up',
    trendPercent: 22.3,
  },
  {
    dishId: 'dish-5',
    dishName: 'Gỏi Cuốn Tôm Thịt',
    categoryName: 'Món Cuốn',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76978ae2f6b?w=200',
    price: 45000,
    totalOrdered: 98,
    totalRevenue: 4410000,
    averageRating: 4.4,
    reviewCount: 34,
    trend: 'down',
    trendPercent: -5.8,
  },
  {
    dishId: 'dish-6',
    dishName: 'Chả Giò Chiên',
    categoryName: 'Món Chiên',
    imageUrl: 'https://images.unsplash.com/photo-1606502973842-f64bc2785fe5?w=200',
    price: 40000,
    totalOrdered: 145,
    totalRevenue: 5800000,
    averageRating: 4.3,
    reviewCount: 42,
    trend: 'stable',
    trendPercent: 1.2,
  },
];

const generateMenuSummary = (): MenuSummaryDto => {
  const sortedByRevenue = [...mockDishes].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const totalRevenue = mockDishes.reduce((sum, d) => sum + d.totalRevenue, 0);

  const categoryMap = new Map<string, CategoryAnalyticsItem>();
  mockDishes.forEach(dish => {
    const existing = categoryMap.get(dish.categoryName);
    if (existing) {
      existing.totalDishes++;
      existing.totalOrdered += dish.totalOrdered;
      existing.totalRevenue += dish.totalRevenue;
    } else {
      categoryMap.set(dish.categoryName, {
        categoryId: `cat-${categoryMap.size + 1}`,
        categoryName: dish.categoryName,
        totalDishes: 1,
        totalOrdered: dish.totalOrdered,
        totalRevenue: dish.totalRevenue,
        percentOfTotal: 0,
      });
    }
  });

  const categories = Array.from(categoryMap.values()).map(cat => ({
    ...cat,
    percentOfTotal: Math.round((cat.totalRevenue / totalRevenue) * 100),
  }));

  return {
    totalDishes: mockDishes.length,
    activeDishes: mockDishes.length - 1,
    outOfStockDishes: 1,
    topSellingDishes: sortedByRevenue.slice(0, 5),
    lowPerformingDishes: sortedByRevenue.slice(-2).reverse(),
    categoryBreakdown: categories.sort((a, b) => b.totalRevenue - a.totalRevenue),
  };
};

// Mock reviews
const reviewComments = [
  'Món ăn rất ngon, phục vụ nhanh!',
  'Phở ngon, nước dùng đậm đà',
  'Giao hàng hơi chậm nhưng đồ ăn ổn',
  'Sẽ quay lại lần sau',
  'Bánh mì giòn, thịt vừa miệng',
  'Bún bò cay vừa phải, ngon!',
  'Đóng gói cẩn thận, thức ăn còn nóng',
  'Giá hơi cao so với chất lượng',
];

const generateReviewSummary = (): ReviewSummaryDto => {
  const reviews: ReviewReportItem[] = [];

  for (let i = 0; i < 20; i++) {
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 30));

    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly

    reviews.push({
      id: `review-${i + 1}`,
      orderId: `order-${i + 1}`,
      orderCode: `EZ${String(100000 + i).slice(1)}`,
      customerName: customerNames[i % customerNames.length],
      rating,
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
      reply: Math.random() > 0.4 ? 'Cảm ơn quý khách đã ủng hộ! Chúng tôi rất vui khi bạn hài lòng.' : null,
      dishNames: mockDishes.slice(0, Math.floor(Math.random() * 3) + 1).map(d => d.dishName),
      createdAt: reviewDate.toISOString(),
    });
  }

  return {
    averageRating: 4.6,
    totalReviews: 423,
    ratingDistribution: {
      oneStar: 8,
      twoStar: 15,
      threeStar: 42,
      fourStar: 156,
      fiveStar: 202,
    },
    recentReviews: reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    responseRate: 67.5,
    averageResponseTime: 45,
  };
};

// Generate full dashboard report
const generateFullReport = (startDate: Date, endDate: Date): FullReportDto => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.min(30, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  const revenueData = generateRevenueData(startDate, diffDays);

  return {
    totalRevenue: CONSTANTS.TOTAL_FOOD_REVENUE_30_DAYS,
    netRevenue: CONSTANTS.NET_REVENUE_30_DAYS,
    totalOrders: CONSTANTS.TOTAL_ORDERS,
    completedOrders: CONSTANTS.COMPLETED_ORDERS,
    cancelledOrders: CONSTANTS.CANCELLED_ORDERS,
    cancelRate: CONSTANTS.CANCEL_RATE,
    averageOrderValue: CONSTANTS.AVG_ORDER_VALUE,
    averageRating: CONSTANTS.AVG_RATING,
    totalReviews: CONSTANTS.TOTAL_REVIEWS,
    topPerformingDish: CONSTANTS.TOP_DISH,
    revenueChart: revenueData,
    orderStatusBreakdown: [
      { status: 'DELIVERED', count: 789, percent: 92.2 },
      { status: 'CANCELLED', count: 67, percent: 7.8 },
    ],
  };
};

// ============================================================================
// SERVICE EXPORTS
// ============================================================================

export const reportService = {
  getRevenueReport: async (restaurantId: string, startDate: Date, endDate: Date): Promise<RevenueReportItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return generateRevenueData(startDate, diffDays);
  },

  getOrdersReport: async (restaurantId: string, startDate: Date, endDate: Date): Promise<OrderReportItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateOrdersData();
  },

  getMenuAnalytics: async (restaurantId: string): Promise<MenuSummaryDto> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateMenuSummary();
  },

  getReviewSummary: async (restaurantId: string): Promise<ReviewSummaryDto> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return generateReviewSummary();
  },

  getFullReport: async (restaurantId: string, startDate: Date, endDate: Date): Promise<FullReportDto> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return generateFullReport(startDate, endDate);
  },

  getStats: async (restaurantId: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      totalRevenue: CONSTANTS.TOTAL_FOOD_REVENUE_30_DAYS,
      netRevenue: CONSTANTS.NET_REVENUE_30_DAYS,
      totalOrders: CONSTANTS.TOTAL_ORDERS,
      completedOrders: CONSTANTS.COMPLETED_ORDERS,
      cancelledOrders: CONSTANTS.CANCELLED_ORDERS,
      avgOrderValue: CONSTANTS.AVG_ORDER_VALUE,
      avgRating: CONSTANTS.AVG_RATING,
      totalReviews: CONSTANTS.TOTAL_REVIEWS,
    };
  },
};
