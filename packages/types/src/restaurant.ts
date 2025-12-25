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
