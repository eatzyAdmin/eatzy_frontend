import type {
  Order,
  OrderResponse,
  Dish,
  MenuCategory,
  Restaurant,
  RestaurantDetail,
  Driver,
  DriverProfile,
  Customer,
  Voucher,
  SystemParameter,
  ReviewDTO,
  FullReportDTO,
  RevenueReportItemDTO,
  OrderReportItemDTO,
  MenuSummaryDTO,
  ReviewSummaryDTO,
  IAddress,
  DriverOrderOffer,
  DriverActiveOrder,
  ResultPaginationDTO,
  Cart,
  AddToCartRequest,
  FavoriteResponse,
  ChatMessageDTO,
  WalletResponse,
  WalletTransactionResponse,
} from "@repo/types";

import { MOCK_AUTH_USERS, getMockAuthByRole } from "../data/auth.mock";
import { MOCK_CATEGORIES, ExtendedCategory } from "../data/categories.mock";
import {
  MOCK_RESTAURANTS,
  MockFullRestaurant,
  toTypeRestaurant,
  toRestaurantDetail,
  toBackendRestaurantDetailDTO,
  toBackendRestaurantMenuDTO,
} from "../data/restaurants.mock";
import { MOCK_DISHES, MOCK_MENU_CATEGORIES } from "../data/dishes.mock";
import {
  MOCK_ORDERS,
  generateAdminMockOrders,
  toOrderResponse,
  MOCK_DRIVER_OFFER,
  MOCK_DRIVER_ACTIVE_ORDER,
} from "../data/orders.mock";
import { MOCK_DRIVERS_LIST, MOCK_CURRENT_DRIVER_PROFILE } from "../data/drivers.mock";
import {
  MOCK_CUSTOMERS_LIST,
  MOCK_CUSTOMER_PROFILE,
  MOCK_SAVED_ADDRESSES,
} from "../data/customers.mock";
import {
  MOCK_RESTAURANT_WALLET,
  MOCK_DRIVER_WALLET,
  WalletData,
  MOCK_RESTAURANT_WALLET_RESPONSE,
  MOCK_DRIVER_WALLET_RESPONSE,
  MOCK_WALLET_TRANSACTIONS_LIST,
} from "../data/wallets.mock";
import { MOCK_VOUCHERS } from "../data/vouchers.mock";
import { MOCK_REVIEWS } from "../data/reviews.mock";
import { MOCK_SYSTEM_PARAMETERS } from "../data/systemConfig.mock";
import {
  MOCK_RESTAURANT_REPORT,
  MOCK_REVENUE_REPORT,
  MOCK_ORDERS_REPORT,
  MOCK_MENU_REPORT,
  MOCK_REVIEWS_REPORT,
} from "../data/reports.mock";
import { MOCK_CHAT_SESSIONS, MockChatSession } from "../data/chats.mock";

/**
 * Stateful in-memory mock database for Eatzy Frontend
 */
class MockDatabase {
  private orders: Order[] = [...MOCK_ORDERS];
  private adminOrders: OrderResponse[] = generateAdminMockOrders();
  private restaurants: MockFullRestaurant[] = [...MOCK_RESTAURANTS];
  private dishes: Dish[] = [...MOCK_DISHES];
  private menuCategories: MenuCategory[] = [...MOCK_MENU_CATEGORIES];
  private currentDriver: DriverProfile = { ...MOCK_CURRENT_DRIVER_PROFILE };
  private driverOffer: DriverOrderOffer | null = { ...MOCK_DRIVER_OFFER };
  private driverActiveOrder: DriverActiveOrder | null = { ...MOCK_DRIVER_ACTIVE_ORDER };
  private restaurantWallet: WalletData = { ...MOCK_RESTAURANT_WALLET };
  private driverWallet: WalletData = { ...MOCK_DRIVER_WALLET };
  private walletTransactions: WalletTransactionResponse[] = [...MOCK_WALLET_TRANSACTIONS_LIST];
  private addresses: IAddress[] = [...MOCK_SAVED_ADDRESSES];
  private vouchers: Voucher[] = [...MOCK_VOUCHERS];
  private reviews: ReviewDTO[] = [...MOCK_REVIEWS];
  private systemParams: SystemParameter[] = [...MOCK_SYSTEM_PARAMETERS];
  private chatSessions: MockChatSession[] = [...MOCK_CHAT_SESSIONS];
  private isDriverOnline: boolean = true;
  private isRestaurantOpen: boolean = true;

  // Favorites store
  private favorites: FavoriteResponse[] = [
    {
      id: 1,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 101,
        name: "Cơm Tấm Ba Ghiền",
        slug: "com-tam-ba-ghien",
        address: "84 Đặng Văn Ngữ, P. 10, Q. Phú Nhuận, TP.HCM",
        description: "Cơm tấm sườn bì chả nướng than hoa trứ danh Sài Gòn",
        averageRating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
        status: "OPEN",
        restaurantTypes: [{ id: 2, name: "Cơm Tấm & Món Việt" }],
      },
    },
    {
      id: 2,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 102,
        name: "Phở Thìn Lò Đúc - Chi Nhánh Sài Gòn",
        slug: "pho-thin-lo-duc",
        address: "110 Lê Thị Hồng Gấm, Phường Nguyễn Thái Bình, Quận 1, TP.HCM",
        description: "Phở tái lăn xào lăn lửa lớn béo ngậy chuẩn vị Hà Thành",
        averageRating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=600",
        status: "OPEN",
        restaurantTypes: [{ id: 1, name: "Phở & Bún" }],
      },
    },
    {
      id: 3,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 103,
        name: "Tokyo Sushi Omakase House",
        slug: "tokyo-sushi-omakase",
        address: "24 Hai Bà Trưng, Bến Nghé, Quận 1, TP.HCM",
        description: "Sashimi cá hồi Na Uy tươi rói vận chuyển hàng không mỗi ngày",
        averageRating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600",
        status: "OPEN",
        restaurantTypes: [{ id: 3, name: "Sushi & Sashimi" }],
      },
    },
    {
      id: 4,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 106,
        name: "Phúc Long Coffee & Tea",
        slug: "phuc-long-coffee-tea",
        address: "325 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM",
        description: "Trà sữa đậm đà trứ danh và trà trái cây thanh nhiệt số 1 Việt Nam",
        averageRating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600",
        status: "OPEN",
        restaurantTypes: [{ id: 6, name: "Trà Sữa & Đồ Uống" }],
      },
    },
    {
      id: 5,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 105,
        name: "Pizza 4P's - Pizza Kiểu Nhật",
        slug: "pizza-4ps",
        address: "8/15 Lê Thánh Tôn, Bến Nghé, Quận 1, TP.HCM",
        description: "Pizza phô mai tự làm thủ công và mì ý cua sốt kem thơm ngậy",
        averageRating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        status: "OPEN",
        restaurantTypes: [{ id: 4, name: "Pizza & Món Âu" }],
      },
    },
  ];

  // Carts store
  private carts: Cart[] = [
    // Cart 1: Cơm Tấm Ba Ghiền (101)
    {
      id: 1,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 101,
        name: "Cơm Tấm Ba Ghiền",
        address: "84 Đặng Văn Ngữ, P. 10, Q. Phú Nhuận, TP.HCM",
        status: "OPEN",
      },
      cartItems: [
        {
          id: 1,
          dish: {
            id: 1,
            name: "Cơm Tấm Sườn Bì Chả Đặc Biệt",
            price: 85000,
            image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
          },
          quantity: 2,
          totalPrice: 190000,
          cartItemOptions: [
            {
              id: 1,
              menuOption: {
                id: 101,
                name: "Trứng ốp la lòng đào",
                priceAdjustment: 10000,
              },
            },
          ],
        },
        {
          id: 2,
          dish: {
            id: 2,
            name: "Canh Khổ Qua Nhồi Thịt",
            price: 25000,
            image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
          },
          quantity: 1,
          totalPrice: 25000,
        },
      ],
    },

    // Cart 2: Phúc Long Coffee & Tea (106)
    {
      id: 2,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 106,
        name: "Phúc Long Coffee & Tea",
        address: "325 Lý Tự Trọng, Phường Bến Thành, Quận 1, TP.HCM",
        status: "OPEN",
      },
      cartItems: [
        {
          id: 3,
          dish: {
            id: 201,
            name: "Trà Sữa Phúc Long Truyền Thống",
            price: 45000,
            image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
          },
          quantity: 2,
          totalPrice: 114000,
          cartItemOptions: [
            {
              id: 201,
              menuOption: {
                id: 201,
                name: "Trân châu trắng giòn (70% đường, 70% đá)",
                priceAdjustment: 12000,
              },
            },
          ],
        },
        {
          id: 4,
          dish: {
            id: 202,
            name: "Trà Đào Cam Sả Tươi",
            price: 52000,
            image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
          },
          quantity: 1,
          totalPrice: 52000,
        },
      ],
    },

    // Cart 3: Phở Thìn Lò Đúc (102)
    {
      id: 3,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 102,
        name: "Phở Thìn Lò Đúc - Chi Nhánh Sài Gòn",
        address: "110 Lê Thị Hồng Gấm, Phường Nguyễn Thái Bình, Quận 1, TP.HCM",
        status: "OPEN",
      },
      cartItems: [
        {
          id: 5,
          dish: {
            id: 301,
            name: "Phở Bò Tái Lăn Hà Nội",
            price: 75000,
            image: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=400&q=80",
          },
          quantity: 2,
          totalPrice: 170000,
          cartItemOptions: [
            {
              id: 301,
              menuOption: {
                id: 301,
                name: "Đĩa quẩy giòn (3 cái)",
                priceAdjustment: 10000,
              },
            },
          ],
        },
      ],
    },

    // Cart 4: Tokyo Sushi Omakase House (103)
    {
      id: 4,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: 103,
        name: "Tokyo Sushi Omakase House",
        address: "24 Hai Bà Trưng, Bến Nghé, Quận 1, TP.HCM",
        status: "OPEN",
      },
      cartItems: [
        {
          id: 6,
          dish: {
            id: 401,
            name: "Sashimi Cá Hồi Na Uy Thượng Hạng (5 lát)",
            price: 135000,
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
          },
          quantity: 1,
          totalPrice: 135000,
        },
        {
          id: 7,
          dish: {
            id: 402,
            name: "Dragon Roll - Cuộn Tôm Chiên & Bơ",
            price: 165000,
            image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80",
          },
          quantity: 1,
          totalPrice: 165000,
        },
      ],
    },
  ];

  // Users store for Super-Admin
  private users = [
    { id: 1, name: "Nguyễn Văn Nam", email: "customer@eatzy.vn", role: "CUSTOMER", isActive: true, createdAt: "2026-01-15T08:00:00Z" },
    { id: 2, name: "Cơm Tấm Ba Ghiền", email: "restaurant@eatzy.vn", role: "RESTAURANT_OWNER", isActive: true, createdAt: "2026-01-10T08:00:00Z" },
    { id: 3, name: "Lê Hoàng Phúc", email: "driver@eatzy.vn", role: "DRIVER", isActive: true, createdAt: "2026-02-01T08:00:00Z" },
    { id: 4, name: "Trần Super Admin", email: "superadmin@eatzy.vn", role: "SUPER_ADMIN", isActive: true, createdAt: "2026-01-01T08:00:00Z" },
    { id: 5, name: "Trần Văn Bình", email: "driver2@eatzy.vn", role: "DRIVER", isActive: true, createdAt: "2026-02-10T08:00:00Z" },
    { id: 6, name: "Đặng Minh Quân", email: "customer2@eatzy.vn", role: "CUSTOMER", isActive: true, createdAt: "2026-02-15T08:00:00Z" },
  ];

  // =================== AUTH ===================
  getMockUserByRole(role: "customer" | "restaurant" | "driver" | "superAdmin") {
    return getMockAuthByRole(role);
  }

  // =================== RESTAURANTS ===================
  getAllRestaurants(params?: { page?: number; size?: number; filter?: string; search?: string }): ResultPaginationDTO<Restaurant[]> {
    const page = params?.page || 1;
    const size = params?.size || 15;
    let list = this.restaurants.map(toTypeRestaurant);

    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || (r.address || "").toLowerCase().includes(q));
    }

    const total = list.length;
    const pages = Math.ceil(total / size) || 1;
    const start = (page - 1) * size;
    const result = list.slice(start, start + size);

    return {
      meta: { page, pageSize: size, pages, total },
      result,
    };
  }

  getNearbyRestaurants(params?: { latitude?: number; longitude?: number; typeId?: number; page?: number; size?: number }): ResultPaginationDTO<any[]> {
    const page = params?.page || 1;
    const size = params?.size || 10;
    let list = [...this.restaurants];

    if (params?.typeId) {
      list = list.filter((r) => r.category.id === String(params.typeId));
    }

    const total = list.length;
    const pages = Math.ceil(total / size) || 1;
    const start = (page - 1) * size;
    const paginated = list.slice(start, start + size);

    const result = paginated.map((r) => {
      const restDishes = this.dishes.filter((d) => d.restaurantId === String(r.id));
      const magazineDishes = (restDishes.length > 0 ? restDishes : this.dishes.filter((d) => d.restaurantId === "101"))
        .slice(0, 4)
        .map((d) => ({
          id: Number(d.id.replace(/\D/g, "")) || 100,
          name: d.name,
          price: d.price,
          imageUrl: d.imageUrl,
          description: d.description || "",
        }));

      const categoryArray = [
        {
          id: Number(r.category.id) || 1,
          name: r.category.name,
          dishes: magazineDishes,
        },
      ];

      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        address: r.address,
        latitude: r.latitude,
        longitude: r.longitude,
        phone: r.phone,
        rating: r.rating,
        averageRating: r.rating,
        imageUrl: r.imageUrl,
        coverImageUrl: r.coverImageUrl,
        avatarUrl: r.avatarUrl,
        description: r.description,
        status: r.status,
        category: categoryArray,
        reviewCount: r.reviewCount,
        distance: 1.8,
        priceRange: r.priceRange,
        dishes: restDishes,
      };
    });

    return {
      meta: { page, pageSize: size, pages, total },
      result,
    };
  }

  getRestaurantDetail(idOrSlug: string | number): RestaurantDetail | null {
    const found = this.restaurants.find(
      (r) => String(r.id) === String(idOrSlug) || r.slug === String(idOrSlug)
    );
    if (!found) return null;
    return toRestaurantDetail(found);
  }

  getBackendRestaurantDetail(idOrSlug: string | number) {
    const found = this.restaurants.find(
      (r) => String(r.id) === String(idOrSlug) || r.slug === String(idOrSlug)
    ) || this.restaurants[0]!;
    return toBackendRestaurantDetailDTO(found);
  }

  getBackendRestaurantMenu(restaurantId: string | number) {
    const found = this.restaurants.find(
      (r) => String(r.id) === String(restaurantId) || r.slug === String(restaurantId)
    ) || this.restaurants[0]!;
    return toBackendRestaurantMenuDTO(found.id, found.name, this.dishes, this.menuCategories);
  }

  getMyRestaurant(): MockFullRestaurant {
    return this.restaurants[0]!;
  }

  toggleRestaurantStatus(): boolean {
    this.isRestaurantOpen = !this.isRestaurantOpen;
    const target = this.restaurants[0];
    if (target) {
      target.status = this.isRestaurantOpen ? "OPEN" : "CLOSED";
    }
    return this.isRestaurantOpen;
  }

  isStoreOpen(): boolean {
    return this.isRestaurantOpen;
  }

  // =================== CATEGORIES ===================
  getCategories(): ExtendedCategory[] {
    return MOCK_CATEGORIES;
  }

  // =================== DISHES & MENUS ===================
  getDishesByRestaurant(restaurantId: string | number): Dish[] {
    return this.dishes.filter((d) => String(d.restaurantId) === String(restaurantId));
  }

  getMenuCategories(restaurantId: string | number): MenuCategory[] {
    return this.menuCategories.filter((c) => String(c.restaurantId) === String(restaurantId));
  }

  toggleDishAvailability(dishId: string): boolean {
    const dish = this.dishes.find((d) => d.id === dishId);
    if (dish) {
      dish.isAvailable = !dish.isAvailable;
      return !!dish.isAvailable;
    }
    return false;
  }

  // =================== ORDERS ===================
  getMyRestaurantOrders(filterStr?: string): OrderResponse[] {
    let list = this.orders.filter((o) => o.restaurantId === "101").map(toOrderResponse);
    if (filterStr) {
      const upper = filterStr.toUpperCase();
      if (upper.includes("DELIVERED")) {
        list = list.filter((o) => o.orderStatus === "DELIVERED");
      } else if (upper.includes("PLACED") || upper.includes("PREPARING")) {
        list = list.filter((o) => !["DELIVERED", "CANCELLED", "REJECTED"].includes(o.orderStatus));
      }
    }
    return list;
  }

  getMyCustomerOrders(filterStr?: string): OrderResponse[] {
    let list = this.orders.filter((o) => o.customer?.id === 1).map(toOrderResponse);

    if (!filterStr) {
      return list;
    }

    const upper = filterStr.toUpperCase();

    // Check status constraints
    if (upper.includes("DELIVERED") && !upper.includes("PLACED") && !upper.includes("PREPARING")) {
      if (upper.includes("CANCELLED") || upper.includes("REJECTED")) {
        // "ALL" in Order History: show DELIVERED, CANCELLED, REJECTED
        list = list.filter((o) => ["DELIVERED", "CANCELLED", "REJECTED"].includes(o.orderStatus));
      } else {
        // "Completed" tab
        list = list.filter((o) => o.orderStatus === "DELIVERED");
      }
    } else if (upper.includes("CANCELLED") || upper.includes("REJECTED")) {
      // "Cancelled" tab
      list = list.filter((o) => ["CANCELLED", "REJECTED"].includes(o.orderStatus));
    } else if (upper.includes("PLACED") || upper.includes("PREPARING") || upper.includes("ARRIVED") || upper.includes("READY")) {
      // Current / Active orders drawer
      list = list.filter((o) => !["DELIVERED", "CANCELLED", "REJECTED"].includes(o.orderStatus));
    }

    // Search query: e.g. `(id : s or restaurant.name ~ '*s*' or deliveryAddress ~ '*s*')`
    const searchMatch = filterStr.match(/\*([^*]+)\*/);
    if (searchMatch && searchMatch[1]) {
      const q = searchMatch[1].trim().toLowerCase();
      if (q) {
        list = list.filter((o) =>
          o.restaurant.name.toLowerCase().includes(q) ||
          (o.deliveryAddress || "").toLowerCase().includes(q) ||
          String(o.id).includes(q) ||
          o.orderItems.some((item) => item.dish.name.toLowerCase().includes(q))
        );
      }
    }

    return list;
  }

  getMyDriverOrders(statusFilter?: string): OrderResponse[] {
    let list = this.orders.map(toOrderResponse);
    if (statusFilter) {
      const upper = statusFilter.toUpperCase();
      if (upper.includes("DELIVERED")) {
        list = list.filter((o) => o.orderStatus === "DELIVERED");
      } else if (upper.includes("ACTIVE") || upper.includes("ASSIGNED") || upper.includes("ARRIVED")) {
        list = list.filter((o) => !["DELIVERED", "CANCELLED", "REJECTED"].includes(o.orderStatus));
      }
    }
    return list;
  }

  getAllOrders(params?: { size?: number }): ResultPaginationDTO<OrderResponse[]> {
    const size = params?.size || 100;
    const result = this.adminOrders.slice(0, size);
    return {
      meta: {
        page: 1,
        pageSize: size,
        pages: 1,
        total: this.adminOrders.length,
      },
      result,
    };
  }

  getOrderById(id: string | number): OrderResponse | null {
    const found = this.orders.find((o) => String(o.id) === String(id));
    if (found) return toOrderResponse(found);
    const adminFound = this.adminOrders.find((o) => String(o.id) === String(id));
    return adminFound || null;
  }

  acceptOrder(orderId: string | number): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "PREPARED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  rejectOrder(orderId: string | number, reason: string = "Quán đang quá tải"): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "CANCELLED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  markOrderReady(orderId: string | number): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "PICKED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  driverAcceptOrder(orderId: string | number): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "PICKED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  driverRejectOrder(orderId: string | number): OrderResponse | null {
    return this.getOrderById(orderId);
  }

  driverPickupOrder(orderId: string | number): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "PICKED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  driverArrivedOrder(orderId: string | number): OrderResponse | null {
    return this.getOrderById(orderId);
  }

  driverDeliveredOrder(orderId: string | number): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "DELIVERED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  customerCancelOrder(orderId: string | number, reason?: string): OrderResponse | null {
    const order = this.orders.find((o) => String(o.id) === String(orderId));
    if (order) {
      order.status = "CANCELLED";
      return toOrderResponse(order);
    }
    return this.getOrderById(orderId);
  }

  // =================== DRIVER OFFERS & STATE ===================
  getDriverOffers(): DriverOrderOffer | null {
    return this.driverOffer;
  }

  getActiveDriverOrder(): DriverActiveOrder | null {
    return this.driverActiveOrder;
  }

  acceptDriverOffer(offerId: string): boolean {
    this.driverOffer = null;
    this.driverActiveOrder = { ...MOCK_DRIVER_ACTIVE_ORDER, id: offerId };
    return true;
  }

  rejectDriverOffer(_offerId: string): boolean {
    this.driverOffer = null;
    return true;
  }

  toggleDriverOnline(): boolean {
    this.isDriverOnline = !this.isDriverOnline;
    this.currentDriver.status = this.isDriverOnline ? "AVAILABLE" : "OFFLINE";
    return this.isDriverOnline;
  }

  getIsDriverOnline(): boolean {
    return this.isDriverOnline;
  }

  getMyDriverProfile(): DriverProfile {
    return this.currentDriver;
  }

  getAllDrivers(): Driver[] {
    return MOCK_DRIVERS_LIST;
  }

  // =================== CUSTOMER ===================
  getMyCustomerProfile(): any {
    return {
      user: {
        id: 1,
        name: MOCK_CUSTOMER_PROFILE.name,
        email: MOCK_CUSTOMER_PROFILE.email,
        phoneNumber: MOCK_CUSTOMER_PROFILE.phone,
        isActive: true,
        avatar: MOCK_CUSTOMER_PROFILE.profilePhoto,
        address: MOCK_CUSTOMER_PROFILE.address,
      },
      date_of_birth: MOCK_CUSTOMER_PROFILE.dateOfBirth,
      hometown: MOCK_CUSTOMER_PROFILE.hometown,
    };
  }

  getAllCustomers(): Customer[] {
    return MOCK_CUSTOMERS_LIST;
  }

  getSavedAddresses(): IAddress[] {
    return this.addresses;
  }

  addSavedAddress(addr: Partial<IAddress>): IAddress {
    const newAddr: IAddress = {
      id: this.addresses.length + 1,
      label: addr.label || "Địa chỉ mới",
      addressLine: addr.addressLine || addr.address_line || "",
      address_line: addr.addressLine || addr.address_line || "",
      latitude: addr.latitude || 10.7725,
      longitude: addr.longitude || 106.698,
      customer: { id: 1 },
    };
    this.addresses.push(newAddr);
    return newAddr;
  }

  // =================== CARTS ===================
  getMyCarts(): Cart[] {
    return this.carts;
  }

  saveOrUpdateCart(req: AddToCartRequest): Cart {
    const restId = req.restaurant.id;
    let existingCart = this.carts.find((c) => c.restaurant.id === restId);

    if (!existingCart) {
      const rest = this.restaurants.find((r) => r.id === restId) || this.restaurants[0]!;
      existingCart = {
        id: this.carts.length + 1,
        customer: { id: req.customer.id, name: "Nguyễn Văn Nam" },
        restaurant: { id: rest.id, name: rest.name, address: rest.address, status: rest.status },
        cartItems: [],
      };
      this.carts.push(existingCart);
    }

    req.cartItems.forEach((reqItem) => {
      const dish = this.dishes.find((d) => Number(d.id.replace(/\D/g, "")) === reqItem.dish.id) || this.dishes[0]!;
      const existingItem = existingCart!.cartItems.find((ci) => ci.dish.id === reqItem.dish.id);

      if (existingItem) {
        existingItem.quantity += reqItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.dish.price;
      } else {
        existingCart!.cartItems.push({
          id: existingCart!.cartItems.length + 1,
          dish: {
            id: reqItem.dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.imageUrl,
          },
          quantity: reqItem.quantity,
          totalPrice: dish.price * reqItem.quantity,
        });
      }
    });

    return existingCart;
  }

  deleteCart(cartId: number): boolean {
    this.carts = this.carts.filter((c) => c.id !== cartId);
    return true;
  }

  // =================== FAVORITES ===================
  getMyFavorites(): FavoriteResponse[] {
    return this.favorites;
  }

  addFavorite(restaurantId: number): FavoriteResponse {
    const rest = this.restaurants.find((r) => r.id === restaurantId) || this.restaurants[0]!;
    const existing = this.favorites.find((f) => f.restaurant.id === restaurantId);
    if (existing) return existing;

    const newFav: FavoriteResponse = {
      id: this.favorites.length + 1,
      customer: { id: 1, name: "Nguyễn Văn Nam" },
      restaurant: {
        id: rest.id,
        name: rest.name,
        slug: rest.slug,
        address: rest.address,
        description: rest.description,
        averageRating: rest.rating,
        imageUrl: rest.imageUrl,
        status: rest.status,
        restaurantTypes: [{ id: Number(rest.category.id), name: rest.category.name }],
      },
    };
    this.favorites.push(newFav);
    return newFav;
  }

  removeFavorite(idOrRestaurantId: number): boolean {
    this.favorites = this.favorites.filter(
      (f) => f.id !== idOrRestaurantId && f.restaurant.id !== idOrRestaurantId
    );
    return true;
  }

  // =================== WALLETS ===================
  getRestaurantWallet(): WalletData {
    return this.restaurantWallet;
  }

  getDriverWallet(): WalletData {
    return this.driverWallet;
  }

  getWalletResponse(role: string): WalletResponse {
    return role === "driver" ? MOCK_DRIVER_WALLET_RESPONSE : MOCK_RESTAURANT_WALLET_RESPONSE;
  }

  getWalletTransactionsResponse(role: string, params?: any): ResultPaginationDTO<WalletTransactionResponse[]> {
    let list = [...this.walletTransactions];
    if (role === "driver") {
      list = list.filter((tx) => tx.wallet.id === 201);
    } else if (role === "restaurant") {
      list = list.filter((tx) => tx.wallet.id === 101);
    }

    const page = params?.page || 1;
    const size = params?.size || 15;
    const total = list.length;
    const pages = Math.ceil(total / size) || 1;
    const start = (page - 1) * size;
    const result = list.slice(start, start + size);

    return {
      meta: { page, pageSize: size, pages, total },
      result,
    };
  }

  requestWithdrawal(amount: number, userType: "restaurant" | "driver"): boolean {
    const wallet = userType === "restaurant" ? this.restaurantWallet : this.driverWallet;
    if (wallet.availableBalance >= amount) {
      wallet.availableBalance -= amount;
      wallet.totalWithdrawn += amount;
      wallet.transactions.unshift({
        id: `TX-WD-${Date.now()}`,
        type: "WITHDRAWAL",
        amount: -amount,
        description: `Yêu cầu rút tiền về ngân hàng`,
        timestamp: new Date().toISOString(),
        status: "COMPLETED",
        balanceAfter: wallet.availableBalance,
      });

      this.walletTransactions.unshift({
        id: Date.now(),
        wallet: { id: wallet.id, user: { id: userType === "driver" ? 3 : 2, name: userType === "driver" ? "Lê Hoàng Phúc" : "Cơm Tấm Ba Ghiền" } },
        order: null,
        amount: -amount,
        transactionType: "WITHDRAWAL",
        description: "Yêu cầu rút tiền về ngân hàng",
        status: "SUCCESS",
        balanceAfter: wallet.availableBalance,
        createdAt: new Date().toISOString(),
        transactionDate: new Date().toISOString(),
      });
      return true;
    }
    return false;
  }

  // =================== VOUCHERS ===================
  getVouchers(): Voucher[] {
    return this.vouchers;
  }

  getVouchersByRestaurantId(restaurantId: number): Voucher[] {
    return this.vouchers.filter(
      (v) => v.applyToAll || (v.code === "BAGHIEN30" && restaurantId === 101)
    );
  }

  getVoucherByCode(code: string): Voucher | null {
    return this.vouchers.find((v) => v.code.toUpperCase() === code.toUpperCase()) || null;
  }

  toggleVoucherActive(id: number): Voucher | null {
    const found = this.vouchers.find((v) => v.id === id);
    if (found) {
      found.active = !found.active;
      return found;
    }
    return null;
  }

  // =================== CHATS ===================
  getOrderChatHistory(orderId: number): ChatMessageDTO[] {
    const session = this.chatSessions.find((s) => s.orderId === Number(orderId));
    return session ? session.messages : [];
  }

  getMessageCount(orderId: number): number {
    const session = this.chatSessions.find((s) => s.orderId === Number(orderId));
    return session ? session.messages.length : 0;
  }

  getChatUnreadCount(orderId: number): number {
    const session = this.chatSessions.find((s) => s.orderId === Number(orderId));
    return session ? session.unreadCount : 0;
  }

  markChatAsRead(orderId: number): boolean {
    const session = this.chatSessions.find((s) => s.orderId === Number(orderId));
    if (session) {
      session.unreadCount = 0;
      return true;
    }
    return false;
  }

  // =================== REVIEWS ===================
  getReviews(): ReviewDTO[] {
    return this.reviews;
  }

  replyReview(reviewId: number, replyText: string): boolean {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.reply = replyText;
      return true;
    }
    return false;
  }

  // =================== SYSTEM CONFIG ===================
  getSystemParameters(): SystemParameter[] {
    return this.systemParams;
  }

  updateSystemParameter(id: number, value: string): boolean {
    const param = this.systemParams.find((p) => p.id === id);
    if (param) {
      param.configValue = value;
      param.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // =================== REPORTS ===================
  getRestaurantReport(): FullReportDTO {
    return MOCK_RESTAURANT_REPORT;
  }

  getRevenueReport(): RevenueReportItemDTO[] {
    return MOCK_REVENUE_REPORT;
  }

  getOrdersReport(): OrderReportItemDTO[] {
    return MOCK_ORDERS_REPORT;
  }

  getMenuReport(): MenuSummaryDTO {
    return MOCK_MENU_REPORT;
  }

  getReviewsReport(): ReviewSummaryDTO {
    return MOCK_REVIEWS_REPORT;
  }

  // =================== USERS (SUPER ADMIN) ===================
  getAllUsers(params?: any): ResultPaginationDTO<any[]> {
    const page = params?.page || 1;
    const size = params?.size || 15;
    const total = this.users.length;
    const pages = Math.ceil(total / size) || 1;
    const start = (page - 1) * size;
    const result = this.users.slice(start, start + size);

    return {
      meta: { page, pageSize: size, pages, total },
      result,
    };
  }

  toggleUserStatus(userId: number, isActive: boolean): any {
    const u = this.users.find((user) => user.id === userId);
    if (u) {
      u.isActive = isActive;
      return u;
    }
    return null;
  }
}

// Global singleton instance
export const mockDb = new MockDatabase();
