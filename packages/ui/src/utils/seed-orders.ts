/**
 * ========================================
 * ORDERS SEED DATA
 * ========================================
 * 10 orders for main customer (cust-1)
 * ALL orders are DELIVERED or CANCELLED - NO current/active orders initially
 * With accurate relationships to restaurants, driver, fees calculated from system params
 */

import type { Order } from './localStorage-manager';

// Helper to calculate distance (simplified Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Delivery fee calculator (5000đ/km, min 10k, max 50k)
function calculateFee(distance: number): number {
  const fee = distance * 5000;
  return Math.min(Math.max(Math.round(fee), 10000), 50000);
}

export const SEED_ORDERS: Order[] = [
  // ========================================
  // ORDER 1: DELIVERED (completed)
  // ========================================
  {
    id: 'ord-1000',
    code: 'EZ-1000',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-1', // Phở Hà Nội
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-1-2',
        name: 'Phở Gà',
        price: 60000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400',
        restaurantId: 'rest-1',
      },
      {
        id: 'dish-1-6',
        name: 'Chả Giò',
        price: 50000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
        restaurantId: 'rest-1',
      },
    ],
    subtotal: 110000,
    fee: 15000,
    discount: 0,
    total: 125000,
    deliveryLocation: { lat: 10.7742, lng: 106.7056, address: 'Lê Thánh Tôn, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7798, lng: 106.6923, name: 'Phở Hà Nội' },
    driverLocation: { lat: 10.7742, lng: 106.7056, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },

  // ========================================
  // ORDER 2: DELIVERED (completed)
  // ========================================
  {
    id: 'ord-1001',
    code: 'EZ-1001',
    customerId: 'cust-1',
    driverId: 'drv-1', // Main driver
    restaurantId: 'rest-1',
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-1-1',
        name: 'Phở Bò Tái',
        price: 65000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
        restaurantId: 'rest-1',
      },
      {
        id: 'dish-1-5',
        name: 'Gỏi Cuốn',
        price: 45000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        restaurantId: 'rest-1',
      },
    ],
    subtotal: 110000,
    fee: 15000,
    discount: 0,
    total: 125000,
    deliveryLocation: { lat: 10.7757, lng: 106.7009, address: 'Nguyễn Huệ, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7798, lng: 106.6923, name: 'Phở Hà Nội' },
    driverLocation: { lat: 10.7705, lng: 106.7039, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },

  // ========================================
  // ORDER 3: DELIVERED (completed)
  // ========================================
  {
    id: 'ord-1002',
    code: 'EZ-1002',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-2', // Sushi Sakura
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-2-1',
        name: 'Salmon Sashimi',
        price: 180000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        restaurantId: 'rest-2',
      },
      {
        id: 'dish-2-5',
        name: 'Dragon Roll',
        price: 280000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        restaurantId: 'rest-2',
      },
    ],
    subtotal: 460000,
    fee: 25000,
    discount: 30000,
    total: 455000,
    deliveryLocation: { lat: 10.7762, lng: 106.6885, address: 'Lê Lợi, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7722, lng: 106.7007, name: 'Sushi Sakura' },
    driverLocation: { lat: 10.7688, lng: 106.6956, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
  },

  // ========================================
  // ORDER 4: DELIVERED (completed)
  // ========================================
  {
    id: 'ord-1003',
    code: 'EZ-1003',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-3', // Pizza Bella Italia
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-3-1',
        name: 'Margherita Pizza',
        price: 140000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
        restaurantId: 'rest-3',
      },
      {
        id: 'dish-3-5',
        name: 'Carbonara Pasta',
        price: 150000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
        restaurantId: 'rest-3',
      },
    ],
    subtotal: 290000,
    fee: 20000,
    discount: 0,
    total: 310000,
    deliveryLocation: { lat: 10.7626, lng: 106.6765, address: 'Pasteur, Quận 3, TP.HCM' },
    restaurantLocation: { lat: 10.7769, lng: 106.6789, name: 'Pizza Bella Italia' },
    driverLocation: { lat: 10.7626, lng: 106.6765, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 17).toISOString(),
  },

  // ========================================
  // ORDERS 5-8: DELIVERED (completed orders)
  // ========================================
  {
    id: 'ord-1004',
    code: 'EZ-1004',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-4', // Bún Bò Huế
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-4-1',
        name: 'Bún Bò Huế Đặc Biệt',
        price: 80000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
        restaurantId: 'rest-4',
      },
      {
        id: 'dish-4-5',
        name: 'Cơm Tấm',
        price: 68000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        restaurantId: 'rest-4',
      },
    ],
    subtotal: 228000,
    fee: 15000,
    discount: 15000,
    total: 228000,
    deliveryLocation: { lat: 10.7729, lng: 106.6998, address: 'Đồng Khởi, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7745, lng: 106.7023, name: 'Bún Bò Huế Authentic' },
    driverLocation: { lat: 10.7729, lng: 106.6998, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },

  {
    id: 'ord-1005',
    code: 'EZ-1005',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-5', // Café De Paris
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-5-3',
        name: 'Latte',
        price: 58000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
        restaurantId: 'rest-5',
      },
      {
        id: 'dish-5-5',
        name: 'Croissant',
        price: 38000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        restaurantId: 'rest-5',
      },
    ],
    subtotal: 192000,
    fee: 18000,
    discount: 20000,
    total: 190000,
    deliveryLocation: { lat: 10.7721, lng: 106.6845, address: 'Hai Bà Trưng, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7698, lng: 106.6912, name: 'Café De Paris' },
    driverLocation: { lat: 10.7721, lng: 106.6845, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
  },

  {
    id: 'ord-1006',
    code: 'EZ-1006',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-6', // Korean BBQ
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-6-1',
        name: 'Galbi',
        price: 280000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
        restaurantId: 'rest-6',
      },
      {
        id: 'dish-6-5',
        name: 'Kimchi Jjigae',
        price: 120000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400',
        restaurantId: 'rest-6',
      },
    ],
    subtotal: 400000,
    fee: 30000,
    discount: 50000,
    total: 380000,
    deliveryLocation: { lat: 10.7823, lng: 106.6932, address: 'Lý Tự Trọng, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7854, lng: 106.6889, name: 'Korean BBQ House' },
    driverLocation: { lat: 10.7823, lng: 106.6932, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
  },

  {
    id: 'ord-1007',
    code: 'EZ-1007',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-7', // Thai Spice
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-7-1',
        name: 'Pad Thai',
        price: 95000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        restaurantId: 'rest-7',
      },
      {
        id: 'dish-7-6',
        name: 'Tom Yum Soup',
        price: 90000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1547928578-f0f2f37da44a?w=400',
        restaurantId: 'rest-7',
      },
    ],
    subtotal: 185000,
    fee: 15000,
    discount: 0,
    total: 200000,
    deliveryLocation: { lat: 10.7801, lng: 106.7112, address: 'Võ Văn Tần, Quận 3, TP.HCM' },
    restaurantLocation: { lat: 10.7721, lng: 106.6845, name: 'Thai Spice Kitchen' },
    driverLocation: { lat: 10.7801, lng: 106.7112, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 71).toISOString(),
  },

  {
    id: 'ord-1008',
    code: 'EZ-1008',
    customerId: 'cust-1',
    driverId: 'drv-1',
    restaurantId: 'rest-9', // Dim Sum Palace
    status: 'DELIVERED',
    items: [
      {
        id: 'dish-9-1',
        name: 'Har Gow',
        price: 85000,
        quantity: 2,
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
        restaurantId: 'rest-9',
      },
      {
        id: 'dish-9-4',
        name: 'Xiao Long Bao',
        price: 95000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
        restaurantId: 'rest-9',
      },
    ],
    subtotal: 265000,
    fee: 20000,
    discount: 0,
    total: 285000,
    deliveryLocation: { lat: 10.7689, lng: 106.6778, address: 'Trần Hưng Đạo, Quận 5, TP.HCM' },
    restaurantLocation: { lat: 10.7834, lng: 106.7089, name: 'Dim Sum Palace' },
    driverLocation: { lat: 10.7689, lng: 106.6778, name: 'Trần Văn Bình' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 119).toISOString(),
  },

  // ========================================
  // ORDERS 9-10: CANCELLED
  // ========================================
  {
    id: 'ord-1009',
    code: 'EZ-1009',
    customerId: 'cust-1',
    driverId: undefined,
    restaurantId: 'rest-1',
    status: 'CANCELLED',
    items: [
      {
        id: 'dish-1-3',
        name: 'Bún Chả',
        price: 70000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
        restaurantId: 'rest-1',
      },
    ],
    subtotal: 70000,
    fee: 0,
    discount: 0,
    total: 70000,
    deliveryLocation: { lat: 10.7760, lng: 106.7011, address: 'Nguyễn Huệ, Quận 1, TP.HCM' },
    restaurantLocation: { lat: 10.7798, lng: 106.6923, name: 'Phở Hà Nội' },
    driverLocation: { lat: 0, lng: 0, name: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5).toISOString(),
  },

  {
    id: 'ord-1010',
    code: 'EZ-1010',
    customerId: 'cust-1',
    driverId: undefined,
    restaurantId: 'rest-3',
    status: 'CANCELLED',
    items: [
      {
        id: 'dish-3-2',
        name: 'Quattro Formaggi',
        price: 180000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        restaurantId: 'rest-3',
      },
    ],
    subtotal: 180000,
    fee: 0,
    discount: 0,
    total: 180000,
    deliveryLocation: { lat: 10.7626, lng: 106.6765, address: 'Pasteur, Quận 3, TP.HCM' },
    restaurantLocation: { lat: 10.7769, lng: 106.6789, name: 'Pizza Bella Italia' },
    driverLocation: { lat: 0, lng: 0, name: '' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 10).toISOString(),
  },
];

// Calculate totals
export const CUSTOMER_TOTAL_SPENT = SEED_ORDERS
  .filter(o => o.status === 'DELIVERED')
  .reduce((sum, o) => sum + o.total, 0);

export const DRIVER_EARNINGS_FROM_ORDERS = SEED_ORDERS
  .filter(o => o.status === 'DELIVERED' && o.driverId === 'drv-1')
  .map(o => Math.floor(o.fee * 1.2)) // 20% commission on delivery fee
  .reduce((sum, e) => sum + e, 0);
