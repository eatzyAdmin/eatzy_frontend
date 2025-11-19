export type RestaurantStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

export type RestaurantCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  categories: RestaurantCategory[];
  status: RestaurantStatus;
  rating?: number;
  address?: string;
  imageUrl?: string;
  description?: string;
  category?: RestaurantCategory | string;
};

export {};