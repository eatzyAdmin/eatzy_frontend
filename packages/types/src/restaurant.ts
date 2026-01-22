export type RestaurantStatus = 'OPEN' | 'CLOSED' | 'LOCKED';

export type RestaurantCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type Review = {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  date: string;
  content: string;
  tenure?: string;
  location?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  slug?: string;
  categories: RestaurantCategory[];
  status: RestaurantStatus;
  rating?: number;
  address?: string;
  imageUrl?: string;
  description?: string;
  category?: RestaurantCategory | string;
  reviews?: Review[];
  reviewCount?: number;
  // Super Admin specific fields
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  registrationDate?: string;
  totalRevenue?: number;
  totalOrders?: number;
};

// ======== Restaurant Magazine Types (from backend API) ========

// Dish info within Magazine category
export type MagazineDish = {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

// Category within Magazine restaurant
export type MagazineCategory = {
  id: number;
  name: string;
  dishes?: MagazineDish[];
};

// Restaurant Magazine DTO - matches backend ResRestaurantMagazineDTO
export type RestaurantMagazine = {
  id: number;
  name: string;
  slug?: string;
  address?: string;
  description?: string;
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
  averageRating?: number;
  distance?: number; // in km
  category?: MagazineCategory[];

  // Personalized ranking scores (only set if user is logged in)
  typeScore?: number;      // S_Type (40%)
  loyaltyScore?: number;   // S_Quen (30%)
  distanceScore?: number;  // S_Gần (20%)
  qualityScore?: number;   // S_Ngon (10%)
  finalScore?: number;     // Total weighted score
};

// Search params for nearby restaurants API
export type NearbyRestaurantsParams = {
  latitude: number;
  longitude: number;
  search?: string;
  typeId?: number;  // Filter by restaurant type/category ID
  page?: number;
  size?: number;
};
