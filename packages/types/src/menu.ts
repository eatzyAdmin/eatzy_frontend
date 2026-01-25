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

