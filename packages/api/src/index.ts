// Main API exports
export { http } from "./http";
export { authApi } from "./auth";
export { cartApi } from "./cart";
export { voucherApi } from "./voucher";
export { orderApi } from "./order";
export { favoriteApi } from "./favorite";
export { driverApi } from "./driver";
export { walletApi } from "./wallet";
export { reportApi } from "./report";
export { systemConfigApi } from "./system-config";
export { fileApi } from "./file";
export { userApi } from "./user";
export { customerApi } from "./customer";
export { reviewApi, type ReviewDTO } from "./review";

// Restaurant module exports
export {
  restaurantApi,
  restaurantTypeApi,
  dishApi,
  menuCategoryApi,
  restaurantDetailApi,
  type ResRestaurantDTO,
  type BackendDishDTO,
  type MenuCategoryDTO,
  type PaginationParams,
  type RestaurantSearchParams,
  type BackendRestaurantDetailDTO,
  type BackendRestaurantMenuDTO,
} from "./restaurant";

export * from "./restaurant/mappers/dish.mapper";
export * from "./restaurant/mappers/menu-category.mapper";
export * from "./restaurant/mappers/restaurant.mapper";
