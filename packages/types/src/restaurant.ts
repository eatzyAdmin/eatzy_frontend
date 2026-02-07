export type RestaurantStatus = 'OPEN' | 'CLOSED' | 'LOCKED' | 'PENDING' | 'REJECTED';

export interface OpeningHour {
  day: string;
  isOpen: boolean;
  shifts: { open: string; close: string }[];
}

export type StoreInfo = {
  id: number;
  name: string;
  description: string;
  address: string;
  coords: { lat: number; lng: number };
  slug: string;
  commissionRate: number;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  status: RestaurantStatus | string;
  imageUrl: string;
  coverImageUrl?: string;
  schedule?: string;
  openingHours: OpeningHour[];
  images: string[];
  [key: string]: any;
};

export type RestaurantOwner = {
  id: number;
  name: string;
  isActive?: boolean;
};

export type RestaurantType = {
  id: number;
  name: string;
};

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
  id: number;
  name: string;
  slug?: string;
  address?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  status: RestaurantStatus;
  commissionRate?: number;
  oneStarCount?: number;
  twoStarCount?: number;
  threeStarCount?: number;
  fourStarCount?: number;
  fiveStarCount?: number;
  averageRating?: number;
  reviewCount?: number;
  schedule?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  distance?: number;
  owner?: RestaurantOwner;
  restaurantTypes?: RestaurantType;

  // Legacy/UI fields
  categories?: RestaurantCategory[];
  rating?: number; // mapping to averageRating
  imageUrl?: string; // mapping to avatarUrl or coverImageUrl
  category?: RestaurantCategory | string;
  reviews?: Review[];

  // Super Admin specific fields (Legacy)
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  registrationDate?: string;
  totalRevenue?: number;
  totalOrders?: number;
};

export type UpdateRestaurantRequest = {
  id?: number;
  name?: string;
  address?: string;
  description?: string;
  contactPhone?: string;
  status?: RestaurantStatus;
  commissionRate?: number;
  schedule?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  latitude?: number;
  longitude?: number;
};

export type UpdateStoreRequest = UpdateRestaurantRequest;

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
  avatarUrl?: string;
  coverImageUrl?: string;
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

export type RestaurantDetail = {
  id: string;
  name: string;
  slug: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  contactPhone?: string;
  status: string;
  rating: number;
  reviewCount: number;
  schedule?: string;
  distance?: number;
  ownerName?: string;
  restaurantType?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  // Star counts for rating breakdown
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
};

export type RestaurantMenu = {
  restaurantId: string;
  restaurantName: string;
  categories: import('./menu').MenuCategory[];
  dishes: import('./menu').Dish[];
};
