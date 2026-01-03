import { Order, Restaurant } from "@repo/types";

// Mock restaurants data copied from customer app to avoid import issues
const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Phở Hà Nội',
    slug: 'pho-ha-noi-rest-1',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'ACTIVE',
    rating: 4.8,
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
    description: 'Authentic Northern Vietnamese cuisine with traditional pho and street food favorites',
    reviewCount: 156,
  },
  {
    id: 'rest-2',
    name: 'Sushi Sakura',
    slug: 'sushi-sakura-rest-2',
    categories: [{ id: 'cat-japanese', name: 'Japanese', slug: 'japanese' }],
    status: 'ACTIVE',
    rating: 4.9,
    address: '456 Lê Lợi, Q1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    description: 'Premium Japanese sushi and sashimi with fresh ingredients imported daily',
    reviewCount: 203,
  },
  {
    id: 'rest-3',
    name: 'Pizza Bella Italia',
    slug: 'pizza-bella-italia-rest-3',
    categories: [{ id: 'cat-italian', name: 'Italian', slug: 'italian' }],
    status: 'ACTIVE',
    rating: 4.7,
    address: '789 Pasteur, Q3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    description: 'Authentic Italian pizzas and pastas made with imported ingredients',
    reviewCount: 120,
  },
  {
    id: 'rest-4',
    name: 'Bún Bò Huế Authentic',
    slug: 'bun-bo-hue-authentic-rest-4',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'ACTIVE',
    rating: 4.6,
    address: '321 Võ Văn Tần, Q3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
    description: 'Traditional Central Vietnamese cuisine specializing in spicy beef noodle soup',
    reviewCount: 98,
  },
  {
    id: 'rest-5',
    name: 'Café De Paris',
    slug: 'cafe-de-paris-rest-5',
    categories: [{ id: 'cat-cafe', name: 'Café', slug: 'cafe' }],
    status: 'ACTIVE',
    rating: 4.5,
    address: '654 Đồng Khởi, Q1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    description: 'French-inspired café serving artisanal coffee and delicate pastries',
    reviewCount: 85,
  },
  {
    id: 'rest-6',
    name: 'Korean BBQ House',
    slug: 'korean-bbq-house-rest-6',
    categories: [{ id: 'cat-korean', name: 'Korean', slug: 'korean' }],
    status: 'ACTIVE',
    rating: 4.8,
    address: '987 Nguyễn Thị Minh Khai, Q3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
    description: 'Premium Korean BBQ with all-you-can-eat options and authentic side dishes',
    reviewCount: 175,
  },
  {
    id: 'rest-7',
    name: 'Thai Spice Kitchen',
    slug: 'thai-spice-kitchen-rest-7',
    categories: [{ id: 'cat-thai', name: 'Thai', slug: 'thai' }],
    status: 'ACTIVE',
    rating: 4.7,
    address: '147 Hai Bà Trưng, Q1, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
    description: 'Authentic Thai flavors with the perfect balance of sweet, sour, salty, and spicy',
    reviewCount: 142,
  },
  {
    id: 'rest-8',
    name: 'Burger Brothers',
    slug: 'burger-brothers-rest-8',
    categories: [{ id: 'cat-burger', name: 'Burger', slug: 'burger' }],
    status: 'ACTIVE',
    rating: 4.6,
    address: '258 Cách Mạng Tháng 8, Q10, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    description: 'Gourmet burgers made with premium beef and creative toppings',
    reviewCount: 110,
  },
  {
    id: 'rest-9',
    name: 'Dim Sum Palace',
    slug: 'dim-sum-palace-rest-9',
    categories: [{ id: 'cat-chinese', name: 'Chinese', slug: 'chinese' }],
    status: 'ACTIVE',
    rating: 4.9,
    address: '369 Nguyễn Đình Chiểu, Q3, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    description: 'Traditional Cantonese dim sum served in bamboo steamers with tea',
    reviewCount: 220,
  },
  {
    id: 'rest-10',
    name: 'Mediterranean Delight',
    slug: 'mediterranean-delight-rest-10',
    categories: [{ id: 'cat-mediterranean', name: 'Mediterranean', slug: 'mediterranean' }],
    status: 'ACTIVE',
    rating: 4.7,
    address: '741 Trần Hưng Đạo, Q5, TP.HCM',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    description: 'Fresh Mediterranean cuisine with healthy options and vibrant flavors',
    reviewCount: 95,
  },
];

export interface DriverHistoryOrder extends Order {
  earnings: number; // Net Income
  platformFee: number;
  distance: number; // in km
  duration: number; // in minutes
  customerName: string;
  voucherCode?: string;
}

const getRestaurant = (id: string) => mockRestaurants.find((r: Restaurant) => r.id === id);

export const mockDriverHistory: DriverHistoryOrder[] = [
  {
    id: "ord-1001",
    code: "#8291",
    restaurantId: "rest-1", // Phở Hà Nội
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.762622,
      lng: 106.660172,
      address: "215 Hồng Bàng, P.11, Q.5, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7769,
      lng: 106.7009,
      name: "Phở Hà Nội - Chi nhánh Q1",
    },
    driverLocation: { lat: 10.77, lng: 106.7 },
    items: [
      { id: "item-1", name: "Phở Đặc Biệt", price: 85000, quantity: 2, restaurantId: "rest-1", imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800" },
      { id: "item-2", name: "Quẩy Giòn", price: 10000, quantity: 3, restaurantId: "rest-1" },
    ],
    subtotal: 200000,
    fee: 15000,
    discount: 0,
    total: 215000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    earnings: 35000,
    platformFee: 5000,
    distance: 4.2,
    duration: 25,
    customerName: "Nguyễn Văn A",
  },
  {
    id: "ord-1002",
    code: "#9921",
    restaurantId: "rest-2", // Sushi Sakura
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.78,
      lng: 106.7,
      address: "Landmark 81, Bình Thạnh, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7769,
      lng: 106.7009,
      name: "Sushi Sakura",
    },
    driverLocation: { lat: 10.77, lng: 106.7 },
    items: [
      { id: "item-3", name: "Salmon Sashimi", price: 150000, quantity: 1, restaurantId: "rest-2", imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800" },
      { id: "item-4", name: "Miso Soup", price: 30000, quantity: 2, restaurantId: "rest-2" },
    ],
    subtotal: 210000,
    fee: 15000,
    discount: 20000,
    voucherCode: "SALE20K",
    total: 205000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    earnings: 42000,
    platformFee: 6000,
    distance: 3.5,
    duration: 20,
    customerName: "Trần Thị B",
  },
  {
    id: "ord-1003",
    code: "#1102",
    restaurantId: "rest-4", // Bún Bò Huế
    status: "CANCELLED",
    deliveryLocation: {
      lat: 10.75,
      lng: 106.68,
      address: "123 Nguyễn Trãi, Q.5, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7769,
      lng: 106.7009,
      name: "Bún Bò Huế Authentic",
    },
    driverLocation: { lat: 10.77, lng: 106.7 },
    items: [
      { id: "item-5", name: "Bún Bò Đặc Biệt", price: 75000, quantity: 1, restaurantId: "rest-4", imageUrl: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800" },
    ],
    subtotal: 75000,
    fee: 15000,
    discount: 0,
    total: 90000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    earnings: 0,
    platformFee: 0,
    distance: 2.1,
    duration: 0,
    customerName: "Lê Văn C",
  },
  {
    id: "ord-1004",
    code: "#3399",
    restaurantId: "rest-6", // Korean BBQ
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.8,
      lng: 106.65,
      address: "Sân Bay Tân Sơn Nhất, Tân Bình",
    },
    restaurantLocation: {
      lat: 10.7769,
      lng: 106.7009,
      name: "Korean BBQ House",
    },
    driverLocation: { lat: 10.77, lng: 106.7 },
    items: [
      { id: "item-6", name: "Thịt Nướng Tổng Hợp", price: 299000, quantity: 1, restaurantId: "rest-6", imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800" },
      { id: "item-7", name: "Kim Chi", price: 0, quantity: 1, restaurantId: "rest-6" },
    ],
    subtotal: 299000,
    fee: 25000,
    discount: 0,
    total: 324000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // 2 days ago
    earnings: 55000,
    platformFee: 8000,
    distance: 6.8,
    duration: 35,
    customerName: "Phạm Minh D",
  },
  {
    id: "ord-1005",
    code: "#7744",
    restaurantId: "rest-5", // Cafe De Paris
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.76,
      lng: 106.69,
      address: "Chợ Bến Thành, Q.1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7769,
      lng: 106.7009,
      name: "Café De Paris",
    },
    driverLocation: { lat: 10.77, lng: 106.7 },
    items: [
      { id: "item-8", name: "Croissant", price: 45000, quantity: 2, restaurantId: "rest-5", imageUrl: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800" },
      { id: "item-9", name: "Latte Đá", price: 55000, quantity: 1, restaurantId: "rest-5" },
    ],
    subtotal: 145000,
    fee: 15000,
    discount: 10000,
    voucherCode: "CAFE10",
    total: 150000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
    earnings: 25000,
    platformFee: 4000,
    distance: 1.5,
    duration: 15,
    customerName: "Hoàng Yến E",
  }
];

export const getDriverHistory = () => {
  // Sort by date desc
  return [...mockDriverHistory].sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
};
