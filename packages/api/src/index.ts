// Main API exports
export { http } from "./http";
export { authApi } from "./auth";

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
  type RestaurantDetail,
  type RestaurantMenu,
  type BackendRestaurantDetailDTO,
  type BackendRestaurantMenuDTO,
} from "./restaurant";
