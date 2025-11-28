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
  code?: string;
  title?: string;
  description?: string;
  discountType?: 'PERCENT' | 'AMOUNT';
  discountValue?: number;
  minOrderValue?: number;
  startDate?: string;
  endDate?: string;
  isAvailable?: boolean;
  discountPercent?: number;
  discountAmount?: number;
  expiresAt?: string;
};

export type PaymentMethod = 'EATZYPAY' | 'VNPAY' | 'CASH';

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

export type OrderStatus = 'PLACED' | 'PREPARED' | 'PICKED' | 'DELIVERED';

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  restaurantId: string;
  options?: {
    variant?: { id: string; name: string; price: number };
    addons?: { id: string; name: string; price: number }[];
    groups?: { id: string; title: string; options: { id: string; name: string; price: number }[] }[];
  };
};

export type LngLat = { lng: number; lat: number };

export type Order = {
  id: string;
  code?: string;
  restaurantId: string;
  status: OrderStatus;
  deliveryLocation: LngLat & { address?: string };
  restaurantLocation: LngLat & { name?: string };
  driverLocation: LngLat & { name?: string };
  items: OrderItem[];
  subtotal: number;
  fee: number;
  discount: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
};

export {};
