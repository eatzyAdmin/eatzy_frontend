/**
 * ========================================
 * EATZY LOCAL STORAGE DATA MANAGER
 * ========================================
 * 
 * Hệ thống quản lý dữ liệu nhất quán cho tất cả apps trong localStorage
 * Dữ liệu được thiết kế như một database với relationships chặt chẽ
 */

// ========================================
// TYPES & INTERFACES  
// ========================================

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // In real app, this would be hashed
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'driver' | 'restaurant' | 'super_admin';
  status: 'active' | 'disabled';
  createdAt: string;
  profilePhoto?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  ownerId?: string; // User ID of restaurant owner
  categories: { id: string; name: string; slug: string }[];
  status: 'ACTIVE' | 'INACTIVE';
  rating: number;
  address: string;
  imageUrl: string;
  description: string;
  reviewCount: number;
  location: { lat: number; lng: number };
}

export interface Driver {
  id: string;
  userId: string; // Links to User
  fullName: string;
  email: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  status: 'active' | 'disabled';
  profilePhoto?: string;
  location?: { lat: number; lng: number };
}

export interface Customer {
  id: string;
  userId: string; // Links to User
  fullName: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  favoriteRestaurantIds: string[];
  status: 'active' | 'disabled';
}

export interface Order {
  id: string;
  code: string;
  customerId: string; // Links to Customer
  driverId?: string; // Links to Driver
  restaurantId: string; // Links to Restaurant
  status: 'PENDING' | 'PLACED' | 'PREPARED' | 'PICKED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  subtotal: number;
  fee: number; // Calculated from system params
  discount: number;
  total: number;
  deliveryLocation: { lat: number; lng: number; address: string };
  restaurantLocation: { lat: number; lng: number; name: string };
  driverLocation?: { lat: number; lng: number; name?: string };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  restaurantId: string;
  options?: any;
}

export interface Transaction {
  id: string;
  driverId: string;
  type: 'EARNING' | 'WITHDRAWAL' | 'TOP_UP' | 'COD_REMITTANCE';
  amount: number;
  description: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  orderId?: string; // Links to Order
}

export interface SystemParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  restaurantId: string;
  menuCategoryId: string;
  availableQuantity: number;
  isAvailable: boolean;
  rating?: number;
  optionGroups?: any[];
}

// ========================================
// STORAGE KEYS
// ========================================

export const STORAGE_KEYS = {
  USERS: 'eatzy_users',
  RESTAURANTS: 'eatzy_restaurants',
  DISHES: 'eatzy_dishes',
  MENU_CATEGORIES: 'eatzy_menu_categories',
  DRIVERS: 'eatzy_drivers',
  CUSTOMERS: 'eatzy_customers',
  ORDERS: 'eatzy_orders',
  TRANSACTIONS: 'eatzy_transactions',
  SYSTEM_PARAMS: 'eatzy_system_params',
  CURRENT_USER: 'eatzy_current_user',
  INITIALIZED: 'eatzy_data_initialized',
} as const;

// ========================================
// SYSTEM PARAMETERS (Base for calculations)
// ========================================

export const SYSTEM_PARAMS: SystemParameter[] = [
  {
    id: 'driver_commission',
    name: 'Hoa hồng tài xế',
    value: 20,
    unit: '%',
    description: 'Phần trăm chiết khấu trên mỗi cuốc xe',
  },
  {
    id: 'restaurant_commission',
    name: 'Hoa hồng quán ăn',
    value: 15,
    unit: '%',
    description: 'Phần trăm chiết khấu trên mỗi đơn hàng',
  },
  {
    id: 'delivery_fee_per_km',
    name: 'Giá giao hàng / 1km',
    value: 5000,
    unit: 'đ',
    description: 'Đơn giá vận chuyển tính theo mỗi km',
  },
  {
    id: 'min_delivery_fee',
    name: 'Phí ship tối thiểu',
    value: 10000,
    unit: 'đ',
    description: 'Phí giao hàng tối thiểu cho mọi đơn',
  },
  {
    id: 'max_delivery_fee',
    name: 'Phí ship tối đa',
    value: 50000,
    unit: 'đ',
    description: 'Phí giao hàng tối đa cho đơn hàng xa',
  },
];

// Helper để tính phí giao hàng dựa trên khoảng cách
function calculateDeliveryFee(distanceKm: number): number {
  const params = SYSTEM_PARAMS;
  const feePerKm = params.find(p => p.id === 'delivery_fee_per_km')!.value;
  const minFee = params.find(p => p.id === 'min_delivery_fee')!.value;
  const maxFee = params.find(p => p.id === 'max_delivery_fee')!.value;

  const calculatedFee = distanceKm * feePerKm;
  return Math.min(Math.max(calculatedFee, minFee), maxFee);
}

// Helper để tính thu nhập driver từ order
function calculateDriverEarnings(orderTotal: number, deliveryFee: number): number {
  const commission = SYSTEM_PARAMS.find(p => p.id === 'driver_commission')!.value / 100;
  return Math.floor(deliveryFee * (1 + commission));
}

// ========================================
// SEED DATA - USERS (4 accounts)
// ========================================

export const SEED_USERS: User[] = [
  {
    id: 'user-customer-1',
    username: 'customer',
    email: 'customer@eatzy.local',
    password: '123456', // Never do this in production!
    firstName: 'Nguyễn',
    lastName: 'Văn An',
    fullName: 'Nguyễn Văn An',
    phone: '0901234567',
    role: 'customer',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    profilePhoto: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 'user-driver-1',
    username: 'driver',
    email: 'driver@eatzy.local',
    password: '123456',
    firstName: 'Trần',
    lastName: 'Văn Bình',
    fullName: 'Trần Văn Bình',
    phone: '0912345678',
    role: 'driver',
    status: 'active',
    createdAt: new Date('2024-01-02').toISOString(),
    profilePhoto: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'user-restaurant-1',
    username: 'pho_ha_noi',
    email: 'phohanoi@eatzy.local',
    password: '123456',
    firstName: 'Lê',
    lastName: 'Văn Cường',
    fullName: 'Lê Văn Cường',
    phone: '0923456789',
    role: 'restaurant',
    status: 'active',
    createdAt: new Date('2024-01-03').toISOString(),
    profilePhoto: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 'user-super-admin-1',
    username: 'admin',
    email: 'admin@eatzy.local',
    password: '123456',
    firstName: 'Phạm',
    lastName: 'Văn Dũng',
    fullName: 'Phạm Văn Dũng',
    phone: '0934567890',
    role: 'super_admin',
    status: 'active',
    createdAt: new Date('2024-01-01').toISOString(),
    profilePhoto: 'https://i.pravatar.cc/150?img=60',
  },
];

// Continue in next file due to size...
export const DATA_VERSION = '1.0.0';
