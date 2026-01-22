// Restaurant Feature Exports
export {
  useRestaurantDetailById,
  useRestaurantDetailBySlug,
  useRestaurantMenu,
  useRestaurantWithMenu,
  restaurantDetailKeys,
  type UseRestaurantDetailResult,
  type UseRestaurantMenuResult,
} from './hooks/useRestaurantDetail';

export {
  useNearbyRestaurants,
  useUserLocation,
  nearbyRestaurantsKeys,
  type UseNearbyRestaurantsResult,
} from './hooks/useNearbyRestaurants';
