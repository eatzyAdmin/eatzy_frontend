export type RestaurantStatus = 'ACTIVE' | 'INACTIVE' | 'CLOSED';

export type RestaurantCategory = {
  id: string;
  name: string;
  slug?: string;
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
};

// Menu category created by restaurant to organize dishes
export type MenuCategory = {
  id: string;
  name: string;
  restaurantId: string;
  displayOrder?: number;
};

// Individual dish/food item
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  menuCategoryId: string;
  availableQuantity: number;
  isAvailable?: boolean;
  rating?: number;
  optionGroups?: OptionGroup[];
};

export type Voucher = {
  id: string;
  restaurantId: string;
  title: string;
  description?: string;
  discountPercent?: number;
  discountAmount?: number;
  expiresAt?: string;
  isAvailable?: boolean;
};

export type OptionChoice = {
  id: string;
  name: string;
  price: number;
};

export type AddonOption = OptionChoice;

export type OptionGroup = {
  id: string;
  title: string;
  type?: 'variant' | 'addon' | string;
  required?: boolean;
  minSelect?: number;
  maxSelect?: number;
  options: OptionChoice[];
};

export type AddonGroup = OptionGroup;
export type DishVariant = OptionChoice;

export {};
