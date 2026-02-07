// Restaurant API Module
// This folder contains all restaurant-related API calls

export { restaurantApi, type ResRestaurantDTO, type PaginationParams, type RestaurantSearchParams } from './restaurant.api';
export { dishApi, type BackendDishDTO } from './dish.api';
export { menuCategoryApi, type MenuCategoryDTO } from './menu-category.api';
export { restaurantTypeApi } from './restaurant-type.api';
export {
  restaurantDetailApi,
  type BackendRestaurantDetailDTO,
  type BackendRestaurantMenuDTO,
  type BackendDishCategoryDTO,
  type BackendMenuDishDTO,
} from './restaurant-detail.api';

