// Restaurant API Module
// This folder contains all restaurant-related API calls

export { restaurantApi, type ResRestaurantDTO, type PaginationParams, type RestaurantSearchParams } from './restaurant.api';
export { dishApi, type BackendDishDTO, mapBackendDishToFrontend, mapFrontendDishToBackend } from './dish.api';
export { menuCategoryApi, type MenuCategoryDTO } from './menu-category.api';
