// ======== Cart Types ========
// Matches backend ResCartDTO, ResCartItemDTO, ReqCartDTO

// Response Types (from backend)
export type CartRestaurant = {
  id: number;
  name: string;
  address?: string;
};

export type CartCustomer = {
  id: number;
  name: string;
};

export type CartItemDish = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

export type CartItemOption = {
  id: number;
  menuOption: {
    id: number;
    name: string;
    priceAdjustment: number;
  };
};

export type CartItem = {
  id: number;
  dish: CartItemDish;
  quantity: number;
  totalPrice: number;
  cartItemOptions?: CartItemOption[];
};

export type Cart = {
  id: number;
  customer: CartCustomer;
  restaurant: CartRestaurant;
  cartItems: CartItem[];
};

// Request Types (to backend)
export type AddToCartRequest = {
  customer: { id: number };
  restaurant: { id: number };
  cartItems: {
    id?: number;  // For updating existing item
    dish: { id: number };
    quantity: number;
    cartItemOptions?: {
      id?: number;
      menuOption: { id: number };
    }[];
  }[];
};

// Computed Types
export type CartSummary = {
  totalItems: number;
  totalPrice: number;
  restaurantId: number;
  restaurantName: string;
};
