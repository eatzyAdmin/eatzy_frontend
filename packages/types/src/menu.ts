// Menu category created by restaurant to organize dishes
export type MenuCategory = {
  id: string;
  name: string;
  restaurantId: string;
  displayOrder?: number;
};

// Option & Addon base types
export type OptionChoice = {
  id: string;
  name: string;
  price: number;
};

export type AddonOption = OptionChoice;
export type DishVariant = OptionChoice;

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

// Backend uses (from OrderService.java):
// - "PERCENTAGE" for percentage-based discounts
// - "FIXED" for fixed amount discounts
// - "FREESHIP" for free shipping
export type VoucherDiscountType = 'PERCENTAGE' | 'FIXED' | 'FREESHIP';

export type VoucherRestaurant = {
  id: number;
  name: string;
};

export type Voucher = {
  id: number;
  code: string;
  description?: string;
  discountType: VoucherDiscountType;
  discountValue: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  usageLimitPerUser?: number;
  startDate?: string;
  endDate?: string;
  totalQuantity?: number;
  creatorType?: string;
  restaurants?: VoucherRestaurant[];
  // Frontend computed/legacy fields
  title?: string;
  isAvailable?: boolean;
  discountPercent?: number;
  discountAmount?: number;
  expiresAt?: string;
  restaurantId?: string;
};
