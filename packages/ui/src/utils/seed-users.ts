/**
 * ========================================
 * CUSTOMER & DRIVER PROFILES
 * ========================================
 */

import type { Customer, Driver } from './localStorage-manager';

// ========================================
// MAIN CUSTOMER (The logged-in user)
// ========================================

export const MAIN_CUSTOMER: Customer = {
  id: 'cust-1',
  userId: 'user-customer-1',
  fullName: 'Nguyễn Văn An',
  email: 'customer@eatzy.local',
  phone: '0901234567',
  totalOrders: 10,
  totalSpent: 0, // Will be calculated from orders
  favoriteRestaurantIds: ['rest-1', 'rest-2', 'rest-6', 'rest-9', 'rest-10'],
  status: 'active',
};

// ========================================
// MAIN DRIVER (The logged-in driver)
// ========================================

export const MAIN_DRIVER: Driver = {
  id: 'drv-1',
  userId: 'user-driver-1',
  fullName: 'Trần Văn Bình',
  email: 'driver@eatzy.local',
  phone: '0912345678',
  vehicleType: 'Yamaha Sirius',
  licensePlate: '59B-67890',
  rating: 4.9,
  totalTrips: 0, // Will be calculated from orders
  totalEarnings: 0, // Will be calculated from delivered orders
  availableBalance: 2500000, // Starting balance
  pendingBalance: 0,
  status: 'active',
  profilePhoto: 'https://i.pravatar.cc/150?img=12',
  location: { lat: 10.7769, lng: 106.7009 },
};

// ========================================
// OTHER CUSTOMERS IN SYSTEM (for super admin view)
// ========================================

export const OTHER_CUSTOMERS: Customer[] = [
  {
    id: 'cust-2',
    userId: 'user-cust-2',
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@email.com',
    phone: '0912345678',
    totalOrders: 18,
    totalSpent: 2800000,
    favoriteRestaurantIds: ['rest-3', 'rest-5'],
    status: 'active',
  },
  {
    id: 'cust-3',
    userId: 'user-cust-3',
    fullName: 'Lê Văn Cường',
    email: 'levancuong@email.com',
    phone: '0923456789',
    totalOrders: 5,
    totalSpent: 450000,
    favoriteRestaurantIds: ['rest-1'],
    status: 'disabled',
  },
  {
    id: 'cust-4',
    userId: 'user-cust-4',
    fullName: 'Phạm Thị Dung',
    email: 'phamthidung@email.com',
    phone: '0934567890',
    totalOrders: 32,
    totalSpent: 4200000,
    favoriteRestaurantIds: ['rest-2', 'rest-4', 'rest-6'],
    status: 'active',
  },
  {
    id: 'cust-5',
    userId: 'user-cust-5',
    fullName: 'Hoàng Văn Em',
    email: 'hoangvanem@email.com',
    phone: '0945678901',
    totalOrders: 12,
    totalSpent: 1800000,
    favoriteRestaurantIds: ['rest-7', 'rest-8'],
    status: 'active',
  },
];

// ========================================
// OTHER DRIVERS IN SYSTEM (for super admin view)
// ========================================

export const OTHER_DRIVERS: Driver[] = [
  {
    id: 'drv-2',
    userId: 'user-drv-2',
    fullName: 'Nguyễn Văn An (Driver)',
    email: 'nguyenvanan@driver.eatzy.com',
    phone: '0901234567',
    vehicleType: 'Honda Wave Alpha',
    licensePlate: '59A-12345',
    rating: 4.8,
    totalTrips: 1234,
    totalEarnings: 45600000,
    availableBalance: 3200000,
    pendingBalance: 150000,
    status: 'active',
    profilePhoto: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 'drv-3',
    userId: 'user-drv-3',
    fullName: 'Lê Thị Cẩm',
    email: 'lethicam@driver.eatzy.com',
    phone: '0923456789',
    vehicleType: 'Honda SH Mode',
    licensePlate: '51C-11111',
    rating: 4.3,
    totalTrips: 456,
    totalEarnings: 12300000,
    availableBalance: 850000,
    pendingBalance: 0,
    status: 'disabled',
    profilePhoto: 'https://i.pravatar.cc/150?img=23',
  },
  {
    id: 'drv-4',
    userId: 'user-drv-4',
    fullName: 'Phạm Văn Dũng (Driver)',
    email: 'phamvandung@driver.eatzy.com',
    phone: '0934567890',
    vehicleType: 'Honda Air Blade',
    licensePlate: '59D-22222',
    rating: 4.7,
    totalTrips: 1789,
    totalEarnings: 58900000,
    availableBalance: 4500000,
    pendingBalance: 250000,
    status: 'active',
    profilePhoto: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 'drv-5',
    userId: 'user-drv-5',
    fullName: 'Hoàng Thị Em (Driver)',
    email: 'hoangthiem@driver.eatzy.com',
    phone: '0945678901',
    vehicleType: 'Yamaha Exciter',
    licensePlate: '59E-33333',
    rating: 4.6,
    totalTrips: 987,
    totalEarnings: 32100000,
    availableBalance: 2100000,
    pendingBalance: 100000,
    status: 'active',
    profilePhoto: 'https://i.pravatar.cc/150?img=24',
  },
];
