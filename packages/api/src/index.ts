// Main API exports
export { http } from "./http";
export { authApi } from "./auth";

// Restaurant module exports
export {
  restaurantApi,
  dishApi,
  menuCategoryApi,
  type ResRestaurantDTO,
  type BackendDishDTO,
  type MenuCategoryDTO,
  type PaginationParams,
  type RestaurantSearchParams,
} from "./restaurant";
