// ======== Order Request Types ========
// Matches backend ReqOrderDTO

export type CreateOrderRequest = {
  customer: { id: number };
  restaurant: { id: number };
  vouchers?: { id: number }[];
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  specialInstructions?: string;
  deliveryFee: number;
  paymentMethod: string;
  orderItems: CreateOrderItem[];
};

export type CreateOrderItem = {
  dish: { id: number };
  quantity: number;
  orderItemOptions?: {
    menuOption: { id: number };
  }[];
};

// ======== Order Response Types ========
// Matches backend ResOrderDTO

export type OrderResponse = {
  id: number;
  customer: OrderCustomer;
  restaurant: OrderRestaurant;
  driver?: OrderDriver;
  vouchers?: OrderVoucher[];
  orderStatus: string;
  deliveryAddress: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  distance?: number;
  specialInstructions?: string;
  subtotal: number;
  restaurantCommissionAmount?: number;
  restaurantNetEarning?: number;
  deliveryFee: number;
  driverCommissionAmount?: number;
  driverNetEarning?: number;
  discountAmount?: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  cancellationReason?: string;
  createdAt: string;
  preparingAt?: string;
  assignedAt?: string;
  deliveredAt?: string;
  totalTripDuration?: number;
  orderItems: OrderItemResponse[];
  vnpayPaymentUrl?: string;
};

export type OrderCustomer = {
  id: number;
  name: string;
  phoneNumber?: string;
};

export type OrderRestaurant = {
  id: number;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
};

export type OrderDriver = {
  id: number;
  name: string;
  vehicleType?: string;
  vehicleDetails?: string;
  averageRating?: string;
  completedTrips?: string;
  vehicleLicensePlate?: string;
  phoneNumber?: string;
  latitude?: number;
  longitude?: number;
};

export type OrderVoucher = {
  id: number;
  code: string;
};

export type OrderItemResponse = {
  id: number;
  dish: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
  priceAtPurchase: number;
  orderItemOptions?: OrderItemOptionResponse[];
};

export type OrderItemOptionResponse = {
  id: number;
  menuOption: {
    id: number;
    name: string;
    priceAdjustment: number;
  };
};

// ======== Order Status Enum ========
export type OrderStatusType =
  | 'PENDING'
  | 'PLACED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'CANCELLED';

// ======== Payment Method Enum ========
export type PaymentMethodType = 'COD' | 'VNPAY';

// ======== Payment Status Enum ========
export type PaymentStatusType = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// ======== Delivery Fee Types ========
export type CalculateDeliveryFeeRequest = {
  restaurantId: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
};

export type DeliveryFeeResponse = {
  deliveryFee: number;
  distance: number;
  surgeMultiplier: number;
  baseFee: number;
  baseDistance: number;
  perKmFee: number;
};

// ======== Order History Item (for UI) ========
// Used by restaurant app to display order history
export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'vnpay' | 'wallet' | 'COD' | 'VNPAY';
  status: 'completed' | 'cancelled' | 'refunded' | 'DELIVERED' | 'CANCELLED' | 'REJECTED';
  itemsCount: number;
  items: { name: string; quantity: number; price: number }[];
  deliveryFee: number;
  discount: number;
  voucherCode?: string;
  platformFee: number;
  netIncome: number;
  customerAvatar?: string;
  restaurantName?: string;
  driverName?: string;
  driver?: {
    name: string;
    phone: string;
    vehicleType: string;
    licensePlate: string;
    rating: number;
    totalTrips: number;
    avatar: string;
  };
  reviewRating?: number;
  pickupAddress?: string;
  deliveryAddress?: string;
}
