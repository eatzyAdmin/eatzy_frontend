import {
  mockDb,
  mockAuthenticate,
  getMockAuthByRole,
} from "@repo/mock";
import type { IBackendRes } from "@repo/types";

/**
 * Determine current app role based on port, host, or path
 */
export function getCurrentAppRole(): "customer" | "restaurant" | "driver" | "superAdmin" {
  if (typeof window !== "undefined") {
    const port = window.location.port;
    if (port === "3001") return "driver";
    if (port === "3002") return "restaurant";
    if (port === "3003" || port === "3004") return "superAdmin";
    if (port === "3000") return "customer";

    const host = window.location.hostname.toLowerCase();
    const path = window.location.pathname.toLowerCase();
    if (host.includes("driver") || path.includes("driver")) return "driver";
    if (host.includes("restaurant") || path.includes("restaurant")) return "restaurant";
    if (host.includes("admin") || path.includes("admin")) return "superAdmin";

    const savedRole = window.localStorage.getItem("eatzy_mock_role") as any;
    if (savedRole && ["customer", "restaurant", "driver", "superAdmin"].includes(savedRole)) {
      return savedRole;
    }
  }
  return "customer";
}

/**
 * Helper to wrap data into IBackendRes format
 */
function wrapRes<T>(data: T, message: string = "Thành công", statusCode: number = 200): IBackendRes<T> {
  return {
    statusCode,
    message,
    data,
  };
}

/**
 * Extract resource ID from a REST URL
 * e.g., /api/v1/orders/1001/restaurant/accept -> 1001
 * e.g., /api/v1/restaurants/101 -> 101
 */
function extractIdFromUrl(url: string, prefix: string): string | null {
  const regex = new RegExp(`${prefix}/(\\d+)`);
  const match = url.match(regex);
  return match ? match[1]! : null;
}

/**
 * Handle incoming Axios request with mock data
 */
export async function handleMockRequest(url: string, method: string = "GET", data?: any, params?: any): Promise<any | null> {
  const cleanUrl = url.split("?")[0] || "";
  const role = getCurrentAppRole();
  const normalizedMethod = method.toUpperCase();

  // Simulated slight latency (40ms) to ensure smooth realistic UI transitions
  await new Promise((r) => setTimeout(r, 40));

  // ===================== AUTH =====================
  if (cleanUrl.includes("/auth/account")) {
    const userAuth = mockDb.getMockUserByRole(role);
    return wrapRes({ user: userAuth.user });
  }

  if (cleanUrl.includes("/auth/login")) {
    const authRes = mockAuthenticate(data?.username || data?.email, data?.password);
    return wrapRes(authRes);
  }

  if (cleanUrl.includes("/auth/refresh")) {
    const userAuth = mockDb.getMockUserByRole(role);
    return wrapRes(userAuth);
  }

  if (cleanUrl.includes("/auth/logout")) {
    return wrapRes(null, "Đăng xuất thành công");
  }

  // ===================== RESTAURANT TYPES / CATEGORIES =====================
  if (cleanUrl.includes("/restaurant-types") || cleanUrl.includes("/categories")) {
    const typeId = cleanUrl.match(/\/restaurant-types\/(\d+)/)?.[1];
    if (typeId) {
      const cat = mockDb.getCategories().find((c) => c.id === typeId) || mockDb.getCategories()[0]!;
      return wrapRes(cat);
    }
    const categories = mockDb.getCategories();
    return wrapRes({
      meta: { page: 1, pageSize: categories.length, pages: 1, total: categories.length },
      result: categories,
    });
  }

  // ===================== RESTAURANT REPORTS =====================
  if (cleanUrl.includes("/reports/full")) {
    return wrapRes(mockDb.getRestaurantReport());
  }
  if (cleanUrl.includes("/reports/revenue")) {
    return wrapRes(mockDb.getRevenueReport());
  }
  if (cleanUrl.includes("/reports/orders")) {
    return wrapRes(mockDb.getOrdersReport());
  }
  if (cleanUrl.includes("/reports/menu")) {
    return wrapRes(mockDb.getMenuReport());
  }
  if (cleanUrl.includes("/reports/reviews")) {
    return wrapRes(mockDb.getReviewsReport());
  }
  if (cleanUrl.includes("/reports") || cleanUrl.includes("/report")) {
    return wrapRes(mockDb.getRestaurantReport());
  }

  // ===================== RESTAURANTS =====================
  if (cleanUrl.includes("/restaurants/nearby")) {
    const nearby = mockDb.getNearbyRestaurants(params);
    return wrapRes(nearby);
  }

  // Current owner restaurant menu (MUST match before /restaurants/my-restaurant)
  if (cleanUrl.includes("/restaurants/my-restaurant/menu")) {
    return wrapRes(mockDb.getBackendRestaurantMenu(101));
  }

  // Current owner restaurant detail
  if (cleanUrl.includes("/restaurants/my-restaurant")) {
    if (normalizedMethod === "PUT" || normalizedMethod === "PATCH") {
      return wrapRes(mockDb.getBackendRestaurantDetail(101), "Cập nhật thông tin quán thành công");
    }
    return wrapRes(mockDb.getBackendRestaurantDetail(101));
  }

  // Restaurant by slug: /restaurants/slug/:slug
  const slugMatch = cleanUrl.match(/\/restaurants\/slug\/([^/]+)/);
  if (slugMatch) {
    const slug = slugMatch[1]!;
    return wrapRes(mockDb.getBackendRestaurantDetail(slug));
  }

  // Restaurant menu by ID: /restaurants/:id/menu
  const menuMatch = cleanUrl.match(/\/restaurants\/(\d+)\/menu/);
  if (menuMatch) {
    const restId = menuMatch[1]!;
    return wrapRes(mockDb.getBackendRestaurantMenu(restId));
  }

  // Open/Close restaurant status
  if (cleanUrl.match(/\/restaurants\/(\d+)\/open/)) {
    const id = cleanUrl.match(/\/restaurants\/(\d+)\/open/)?.[1]!;
    return wrapRes(mockDb.getBackendRestaurantDetail(id));
  }
  if (cleanUrl.match(/\/restaurants\/(\d+)\/close/)) {
    const id = cleanUrl.match(/\/restaurants\/(\d+)\/close/)?.[1]!;
    return wrapRes(mockDb.getBackendRestaurantDetail(id));
  }

  // Restaurant detail by numeric ID: /restaurants/:id
  const restIdMatch = cleanUrl.match(/\/restaurants\/(\d+)$/);
  if (restIdMatch) {
    const id = restIdMatch[1]!;
    if (normalizedMethod === "DELETE") {
      return wrapRes(null, "Xóa nhà hàng thành công");
    }
    return wrapRes(mockDb.getBackendRestaurantDetail(id));
  }

  // All restaurants / Create restaurant
  if (cleanUrl.includes("/restaurants")) {
    if (normalizedMethod === "POST") {
      return wrapRes({ id: 101, ...data }, "Tạo nhà hàng thành công");
    }
    if (normalizedMethod === "PUT") {
      return wrapRes({ id: data?.id || 101, ...data }, "Cập nhật nhà hàng thành công");
    }
    const all = mockDb.getAllRestaurants(params);
    return wrapRes(all);
  }

  // ===================== DISHES & MENUS =====================
  if (cleanUrl.includes("/dishes")) {
    if (cleanUrl.includes("/status")) {
      const dishId = extractIdFromUrl(cleanUrl, "/dishes") || "1";
      const isAvailable = mockDb.toggleDishAvailability(dishId);
      return wrapRes({ isAvailable }, "Cập nhật trạng thái món thành công");
    }
    if (normalizedMethod === "POST" || normalizedMethod === "PUT") {
      return wrapRes({ id: 101, ...data }, "Lưu món ăn thành công");
    }
    if (normalizedMethod === "DELETE") {
      return wrapRes(null, "Xóa món ăn thành công");
    }
    const dishes = mockDb.getDishesByRestaurant(params?.restaurantId || 101);
    return wrapRes({
      meta: { page: 1, pageSize: dishes.length, pages: 1, total: dishes.length },
      result: dishes,
    });
  }

  if (cleanUrl.includes("/menu-categories")) {
    const cats = mockDb.getMenuCategories(params?.restaurantId || 101);
    return wrapRes({
      meta: { page: 1, pageSize: cats.length, pages: 1, total: cats.length },
      result: cats,
    });
  }

  // ===================== CARTS =====================
  if (cleanUrl.includes("/carts/my-carts")) {
    return wrapRes(mockDb.getMyCarts());
  }

  const cartIdMatch = cleanUrl.match(/\/carts\/(\d+)$/);
  if (cartIdMatch) {
    const cartId = Number(cartIdMatch[1]);
    if (normalizedMethod === "DELETE") {
      mockDb.deleteCart(cartId);
      return wrapRes(null, "Đã xóa giỏ hàng");
    }
    const foundCart = mockDb.getMyCarts().find((c) => c.id === cartId) || null;
    return wrapRes(foundCart);
  }

  if (cleanUrl.includes("/carts")) {
    if (normalizedMethod === "POST") {
      const updatedCart = mockDb.saveOrUpdateCart(data);
      return wrapRes(updatedCart, "Đã thêm món vào giỏ hàng!");
    }
    return wrapRes(mockDb.getMyCarts());
  }

  // ===================== FAVORITES =====================
  if (cleanUrl.includes("/favorites/my-favorites")) {
    return wrapRes(mockDb.getMyFavorites());
  }

  const favIdMatch = cleanUrl.match(/\/favorites\/(\d+)$/);
  if (favIdMatch) {
    const favId = Number(favIdMatch[1]);
    if (normalizedMethod === "DELETE") {
      mockDb.removeFavorite(favId);
      return wrapRes(null, "Đã xóa khỏi danh sách yêu thích");
    }
  }

  if (cleanUrl.includes("/favorites")) {
    if (normalizedMethod === "POST") {
      const fav = mockDb.addFavorite(data?.restaurant?.id || 101);
      return wrapRes(fav, "Đã thêm vào danh sách yêu thích!");
    }
    return wrapRes(mockDb.getMyFavorites());
  }

  // ===================== ORDERS & TRANSITIONS =====================
  if (cleanUrl.includes("/orders/delivery-fee")) {
    return wrapRes({
      deliveryFee: 16000,
      distance: 2.4,
      distanceKm: 2.4,
      estimatedMinutes: 20,
    });
  }

  if (cleanUrl.includes("/orders/my-restaurant")) {
    const restOrders = mockDb.getMyRestaurantOrders(params?.filter);
    return wrapRes({
      meta: { page: 1, pageSize: restOrders.length, pages: 1, total: restOrders.length },
      result: restOrders,
    });
  }

  if (cleanUrl.includes("/orders/my-driver")) {
    const driverOrders = mockDb.getMyDriverOrders(params?.filter);
    return wrapRes({
      meta: { page: 1, pageSize: driverOrders.length, pages: 1, total: driverOrders.length },
      result: driverOrders,
    });
  }

  if (cleanUrl.includes("/orders/my-customer")) {
    const filter =
      params?.filter ||
      (url.includes("filter=")
        ? decodeURIComponent(url.split("filter=")[1]?.split("&")[0] || "")
        : undefined);
    const custOrders = mockDb.getMyCustomerOrders(filter);
    return wrapRes({
      meta: { page: 1, pageSize: custOrders.length, pages: 1, total: custOrders.length },
      result: custOrders,
    });
  }

  // Order transitions: Restaurant accept/reject/ready
  const restAccept = cleanUrl.match(/\/orders\/(\d+)\/restaurant\/accept/);
  if (restAccept) {
    const orderRes = mockDb.acceptOrder(restAccept[1]!);
    return wrapRes(orderRes, "Đã xác nhận đơn hàng");
  }

  const restReject = cleanUrl.match(/\/orders\/(\d+)\/restaurant\/reject/);
  if (restReject) {
    const orderRes = mockDb.rejectOrder(restReject[1]!, data?.cancellationReason);
    return wrapRes(orderRes, "Đã từ chối đơn hàng");
  }

  const restReady = cleanUrl.match(/\/orders\/(\d+)\/restaurant\/ready/);
  if (restReady) {
    const orderRes = mockDb.markOrderReady(restReady[1]!);
    return wrapRes(orderRes, "Đơn hàng đã sẵn sàng giao cho tài xế");
  }

  // Order transitions: Driver accept/reject/picked-up/arrived/delivered
  const drvAccept = cleanUrl.match(/\/orders\/(\d+)\/driver\/accept/);
  if (drvAccept) {
    const orderRes = mockDb.driverAcceptOrder(drvAccept[1]!);
    return wrapRes(orderRes, "Tài xế đã nhận đơn giao");
  }

  const drvReject = cleanUrl.match(/\/orders\/(\d+)\/driver\/reject/);
  if (drvReject) {
    const orderRes = mockDb.driverRejectOrder(drvReject[1]!);
    return wrapRes(orderRes, "Tài xế đã từ chối đơn");
  }

  const drvPickup = cleanUrl.match(/\/orders\/(\d+)\/driver\/picked-up/);
  if (drvPickup) {
    const orderRes = mockDb.driverPickupOrder(drvPickup[1]!);
    return wrapRes(orderRes, "Tài xế đã lấy món từ quán");
  }

  const drvArrive = cleanUrl.match(/\/orders\/(\d+)\/driver\/arrived/);
  if (drvArrive) {
    const orderRes = mockDb.driverArrivedOrder(drvArrive[1]!);
    return wrapRes(orderRes, "Tài xế đã đến điểm giao");
  }

  const drvDeliver = cleanUrl.match(/\/orders\/(\d+)\/driver\/delivered/);
  if (drvDeliver) {
    const orderRes = mockDb.driverDeliveredOrder(drvDeliver[1]!);
    return wrapRes(orderRes, "Đơn hàng đã giao thành công!");
  }

  // Order transitions: Customer cancel
  const custCancel = cleanUrl.match(/\/orders\/(\d+)\/customer\/cancel/);
  if (custCancel) {
    const orderRes = mockDb.customerCancelOrder(custCancel[1]!, data?.cancellationReason);
    return wrapRes(orderRes, "Đã hủy đơn hàng");
  }

  // Single order by ID: /orders/:id
  const orderIdMatch = cleanUrl.match(/\/orders\/(\d+)$/);
  if (orderIdMatch) {
    const id = orderIdMatch[1]!;
    const order = mockDb.getOrderById(id) || mockDb.getOrderById(1001);
    return wrapRes(order);
  }

  if (cleanUrl.includes("/orders")) {
    if (normalizedMethod === "POST") {
      return wrapRes(mockDb.getOrderById(1001), "Đặt món thành công!");
    }
    return wrapRes(mockDb.getAllOrders(params));
  }

  // ===================== DRIVER =====================
  if (cleanUrl.includes("/driver-profiles/go-online")) {
    mockDb.toggleDriverOnline();
    return wrapRes(mockDb.getMyDriverProfile(), "Đã bật trực tuyến");
  }

  if (cleanUrl.includes("/driver-profiles/go-offline")) {
    mockDb.toggleDriverOnline();
    return wrapRes(mockDb.getMyDriverProfile(), "Đã tắt trực tuyến");
  }

  if (cleanUrl.includes("/driver-profiles/my-profile/status")) {
    return wrapRes({ status: mockDb.getIsDriverOnline() ? "AVAILABLE" : "OFFLINE" });
  }

  if (cleanUrl.includes("/driver-profiles/my-profile") || cleanUrl.includes("/drivers/my-profile")) {
    return wrapRes(mockDb.getMyDriverProfile());
  }

  if (cleanUrl.includes("/driver-profiles") || cleanUrl.includes("/drivers")) {
    if (normalizedMethod === "POST" || normalizedMethod === "PUT") {
      return wrapRes(mockDb.getMyDriverProfile(), "Lưu thông tin tài xế thành công");
    }
    if (normalizedMethod === "DELETE") {
      return wrapRes(null, "Xóa tài xế thành công");
    }
    const drivers = mockDb.getAllDrivers();
    return wrapRes({
      meta: { page: 1, pageSize: drivers.length, pages: 1, total: drivers.length },
      result: drivers,
    });
  }

  // ===================== CUSTOMER =====================
  if (cleanUrl.includes("/customer-profile/me") || cleanUrl.includes("/customers/my-profile") || cleanUrl.includes("/customer/profile")) {
    if (normalizedMethod === "PUT") {
      return wrapRes(mockDb.getMyCustomerProfile(), "Cập nhật hồ sơ thành công");
    }
    return wrapRes(mockDb.getMyCustomerProfile());
  }

  if (cleanUrl.includes("/customer-profiles") || cleanUrl.includes("/customers")) {
    const customers = mockDb.getAllCustomers();
    return wrapRes({
      meta: { page: 1, pageSize: customers.length, pages: 1, total: customers.length },
      result: customers,
    });
  }

  // ===================== USERS (SUPER-ADMIN) =====================
  const userActiveMatch = cleanUrl.match(/\/users\/(\d+)\/active/);
  if (userActiveMatch) {
    const uid = Number(userActiveMatch[1]);
    const updated = mockDb.toggleUserStatus(uid, !!data?.isActive);
    return wrapRes(updated, "Cập nhật trạng thái người dùng thành công");
  }

  if (cleanUrl.includes("/users")) {
    return wrapRes(mockDb.getAllUsers(params));
  }

  // ===================== ADDRESSES =====================
  if (cleanUrl.includes("/addresses")) {
    if (normalizedMethod === "POST" || normalizedMethod === "PUT") {
      const created = mockDb.addSavedAddress(data);
      return wrapRes(created, "Lưu địa chỉ thành công");
    }
    if (normalizedMethod === "DELETE") {
      return wrapRes(null, "Xóa địa chỉ thành công");
    }
    return wrapRes(mockDb.getSavedAddresses());
  }

  // ===================== WALLETS & TRANSACTIONS =====================
  if (cleanUrl.includes("/wallets/my-wallet")) {
    return wrapRes(mockDb.getWalletResponse(role));
  }

  if (cleanUrl.includes("/wallet-transactions/my-transactions") || cleanUrl.includes("/wallet-transactions")) {
    return wrapRes(mockDb.getWalletTransactionsResponse(role, params));
  }

  if (cleanUrl.includes("/wallets/withdraw")) {
    mockDb.requestWithdrawal(data?.amount || 1000000, role === "driver" ? "driver" : "restaurant");
    return wrapRes(mockDb.getWalletResponse(role), "Yêu cầu rút tiền thành công");
  }

  if (cleanUrl.match(/\/wallets\/user\/\d+/) || cleanUrl.match(/\/wallets\/\d+/)) {
    return wrapRes(mockDb.getWalletResponse(role));
  }

  if (cleanUrl.includes("/wallets") || cleanUrl.includes("/wallet")) {
    return wrapRes(mockDb.getWalletResponse(role));
  }

  // ===================== VOUCHERS =====================
  const restVoucherMatch = cleanUrl.match(/\/vouchers\/restaurant\/(\d+)/);
  if (restVoucherMatch) {
    const restId = Number(restVoucherMatch[1]);
    return wrapRes(mockDb.getVouchersByRestaurantId(restId));
  }

  const codeVoucherMatch = cleanUrl.match(/\/vouchers\/code\/([^/]+)/);
  if (codeVoucherMatch) {
    const code = codeVoucherMatch[1]!;
    return wrapRes(mockDb.getVoucherByCode(code));
  }

  const toggleVoucherMatch = cleanUrl.match(/\/vouchers\/(\d+)\/toggle/);
  if (toggleVoucherMatch) {
    const vid = Number(toggleVoucherMatch[1]);
    return wrapRes(mockDb.toggleVoucherActive(vid));
  }

  if (cleanUrl.match(/\/vouchers\/(\d+)$/)) {
    const vid = Number(cleanUrl.split("/").pop());
    if (normalizedMethod === "DELETE") {
      return wrapRes(null, "Đã xóa voucher");
    }
    return wrapRes(mockDb.getVouchers().find((v) => v.id === vid) || mockDb.getVouchers()[0]);
  }

  if (cleanUrl.includes("/vouchers") || cleanUrl.includes("/voucher")) {
    if (normalizedMethod === "POST" || normalizedMethod === "PUT") {
      return wrapRes({ id: 10, ...data, active: true }, "Lưu voucher thành công");
    }
    const vouchers = mockDb.getVouchers();
    return wrapRes({
      meta: { page: 1, pageSize: vouchers.length, pages: 1, total: vouchers.length },
      result: vouchers,
    });
  }

  // ===================== REVIEWS =====================
  if (cleanUrl.includes("/reviews") || cleanUrl.includes("/review")) {
    if (cleanUrl.includes("/reply")) {
      mockDb.replyReview(data?.id || 1, data?.reply || "Cảm ơn quý khách đã ủng hộ quán!");
      return wrapRes(null, "Đã phản hồi đánh giá");
    }
    const reviews = mockDb.getReviews();
    return wrapRes({
      meta: { page: 1, pageSize: reviews.length, pages: 1, total: reviews.length },
      result: reviews,
    });
  }

  // ===================== SYSTEM CONFIG =====================
  if (cleanUrl.includes("/system-config") || cleanUrl.includes("/system-parameter") || cleanUrl.includes("/system-configs") || cleanUrl.includes("/system-configurations")) {
    const keyMatch = cleanUrl.match(/\/(?:system-configurations|system-configs|system-config)\/key\/([^/]+)/);
    if (keyMatch) {
      const key = keyMatch[1]!;
      const found = mockDb.getSystemParameters().find((p) => p.configKey === key) || {
        id: 1,
        configKey: key,
        configValue: "20",
        description: "Cấu hình hệ thống",
      };
      return wrapRes(found);
    }

    if (normalizedMethod === "PUT" || normalizedMethod === "PATCH") {
      return wrapRes(mockDb.getSystemParameters()[0], "Cập nhật cấu hình thành công");
    }
    const paramsList = mockDb.getSystemParameters();
    return wrapRes({
      meta: { page: 1, pageSize: paramsList.length, pages: 1, total: paramsList.length },
      result: paramsList,
    });
  }


  // ===================== CHAT =====================
  const unreadMatch = cleanUrl.match(/\/chat\/order\/(\d+)\/unread/);
  if (unreadMatch) {
    const oid = Number(unreadMatch[1]);
    return wrapRes(mockDb.getChatUnreadCount(oid));
  }

  const countMatch = cleanUrl.match(/\/chat\/order\/(\d+)\/count/);
  if (countMatch) {
    const oid = Number(countMatch[1]);
    return wrapRes(mockDb.getMessageCount(oid));
  }

  const readMatch = cleanUrl.match(/\/chat\/order\/(\d+)\/read/);
  if (readMatch) {
    const oid = Number(readMatch[1]);
    mockDb.markChatAsRead(oid);
    return wrapRes(null, "Đã đọc tin nhắn");
  }

  const chatHistoryMatch = cleanUrl.match(/\/chat\/order\/(\d+)/);
  if (chatHistoryMatch) {
    const oid = Number(chatHistoryMatch[1]);
    return wrapRes(mockDb.getOrderChatHistory(oid));
  }

  if (cleanUrl.includes("/chat")) {
    return wrapRes([]);
  }

  // ===================== FILE UPLOAD =====================
  if (cleanUrl.includes("/files")) {
    return wrapRes({
      fileName: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
      uploadedAt: new Date().toISOString(),
    });
  }

  // Unhandled endpoint - return generic success response
  return wrapRes({}, "Success");
}
