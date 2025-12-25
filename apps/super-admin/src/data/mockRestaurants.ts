import type { Restaurant } from '@repo/types';

/**
 * Mock restaurant data for Eatzy Super Admin
 * Each restaurant is manually defined with complete owner and business information
 */
export const mockRestaurants: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Phở Hà Nội',
    slug: 'pho-ha-noi-rest-1',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'OPEN',
    rating: 4.8,
    address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-15828788266292bz-ad1cdc43?w=800',
    description: 'Authentic Northern Vietnamese cuisine with traditional pho and street food favorites',
    ownerName: 'Nguyễn Văn Phúc',
    ownerPhone: '0901111111',
    ownerEmail: 'phucnguyen@phohanoi.com',
    registrationDate: '15/01/2023',
    totalRevenue: 485000000,
    totalOrders: 3245
  },
  {
    id: 'rest-2',
    name: 'Sushi Sakura',
    slug: 'sushi-sakura-rest-2',
    categories: [{ id: 'cat-japanese', name: 'Japanese', slug: 'japanese' }],
    status: 'OPEN',
    rating: 4.9,
    address: '456 Lê Lợi, Quận 1, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    description: 'Premium Japanese sushi and sashimi with fresh ingredients imported daily',
    ownerName: 'Tanaka Hiroshi',
    ownerPhone: '0902222222',
    ownerEmail: 'hiroshi@sushisakura.com',
    registrationDate: '20/01/2023',
    totalRevenue: 720000000,
    totalOrders: 2156
  },
  {
    id: 'rest-3',
    name: 'Pizza Bella Italia',
    slug: 'pizza-bella-italia-rest-3',
    categories: [{ id: 'cat-italian', name: 'Italian', slug: 'italian' }],
    status: 'OPEN',
    rating: 4.7,
    address: '789 Pasteur, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
    description: 'Authentic Italian pizzas and pastas made with imported ingredients',
    ownerName: 'Mario Rossi',
    ownerPhone: '0903333333',
    ownerEmail: 'mario@pizzabella.com',
    registrationDate: '01/02/2023',
    totalRevenue: 650000000,
    totalOrders: 2789
  },
  {
    id: 'rest-4',
    name: 'Bún Bò Huế Authentic',
    slug: 'bun-bo-hue-authentic-rest-4',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'OPEN',
    rating: 4.6,
    address: '321 Võ Văn Tần, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
    description: 'Traditional Central Vietnamese cuisine specializing in spicy beef noodle soup',
    ownerName: 'Trần Thị Bình',
    ownerPhone: '0904444444',
    ownerEmail: 'binh@bunbohue.com',
    registrationDate: '10/02/2023',
    totalRevenue: 420000000,
    totalOrders: 2934
  },
  {
    id: 'rest-5',
    name: 'Café De Paris',
    slug: 'cafe-de-paris-rest-5',
    categories: [{ id: 'cat-cafe', name: 'Café', slug: 'cafe' }],
    status: 'LOCKED',
    rating: 4.5,
    address: '654 Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800',
    description: 'French-inspired café serving artisanal coffee and delicate pastries',
    ownerName: 'Jean Dupont',
    ownerPhone: '0905555555',
    ownerEmail: 'jean@cafedeparis.com',
    registrationDate: '15/02/2023',
    totalRevenue: 320000000,
    totalOrders: 1876
  },
  {
    id: 'rest-6',
    name: 'Korean BBQ House',
    slug: 'korean-bbq-house-rest-6',
    categories: [{ id: 'cat-korean', name: 'Korean', slug: 'korean' }],
    status: 'OPEN',
    rating: 4.8,
    address: '987 Nguyễn Thị Minh Khai, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800',
    description: 'Premium Korean BBQ with all-you-can-eat options and authentic side dishes',
    ownerName: 'Kim Min-jun',
    ownerPhone: '0906666666',
    ownerEmail: 'minjun@kbbqhouse.com',
    registrationDate: '01/03/2023',
    totalRevenue: 890000000,
    totalOrders: 3456
  },
  {
    id: 'rest-7',
    name: 'Thai Spice Kitchen',
    slug: 'thai-spice-kitchen-rest-7',
    categories: [{ id: 'cat-thai', name: 'Thai', slug: 'thai' }],
    status: 'OPEN',
    rating: 4.7,
    address: '147 Hai Bà Trưng, Quận 1, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800',
    description: 'Authentic Thai flavors with the perfect balance of sweet, sour, salty, and spicy',
    ownerName: 'Somchai Pattana',
    ownerPhone: '0907777777',
    ownerEmail: 'somchai@thaispice.com',
    registrationDate: '15/03/2023',
    totalRevenue: 560000000,
    totalOrders: 2567
  },
  {
    id: 'rest-8',
    name: 'Burger Brothers',
    slug: 'burger-brothers-rest-8',
    categories: [{ id: 'cat-burger', name: 'Burger', slug: 'burger' }],
    status: 'OPEN',
    rating: 4.6,
    address: '258 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    description: 'Gourmet burgers made with premium beef and creative toppings',
    ownerName: 'Lê Văn Cường',
    ownerPhone: '0908888888',
    ownerEmail: 'cuong@burgerbrothers.com',
    registrationDate: '01/04/2023',
    totalRevenue: 480000000,
    totalOrders: 2845
  },
  {
    id: 'rest-9',
    name: 'Dim Sum Palace',
    slug: 'dim-sum-palace-rest-9',
    categories: [{ id: 'cat-chinese', name: 'Chinese', slug: 'chinese' }],
    status: 'CLOSED',
    rating: 4.9,
    address: '369 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800',
    description: 'Traditional Cantonese dim sum served in bamboo steamers with tea',
    ownerName: 'Wong Wei Chen',
    ownerPhone: '0909999999',
    ownerEmail: 'weichen@dimsumpalace.com',
    registrationDate: '15/04/2023',
    totalRevenue: 780000000,
    totalOrders: 3678
  },
  {
    id: 'rest-10',
    name: 'Mediterranean Delight',
    slug: 'mediterranean-delight-rest-10',
    categories: [{ id: 'cat-mediterranean', name: 'Mediterranean', slug: 'mediterranean' }],
    status: 'CLOSED',
    rating: 4.7,
    address: '741 Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    description: 'Fresh Mediterranean cuisine with healthy options and vibrant flavors',
    ownerName: 'Phan Thị Dung',
    ownerPhone: '0901010101',
    ownerEmail: 'dung@meddelight.com',
    registrationDate: '01/05/2023',
    totalRevenue: 280000000,
    totalOrders: 1234
  },
  {
    id: 'rest-11',
    name: 'Cơm Tấm Sài Gòn',
    slug: 'com-tam-saigon-rest-11',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'OPEN',
    rating: 4.6,
    address: '852 Xô Viết Nghệ Tĩnh, Quận Bình Thạnh, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    description: 'Southern Vietnamese broken rice with grilled meats and pickled vegetables',
    ownerName: 'Hoàng Văn Em',
    ownerPhone: '0902020202',
    ownerEmail: 'em@comtamsaigon.com',
    registrationDate: '15/05/2023',
    totalRevenue: 390000000,
    totalOrders: 2678
  },
  {
    id: 'rest-12',
    name: 'Bánh Mì Huỳnh Hoa',
    slug: 'banh-mi-huynh-hoa-rest-12',
    categories: [{ id: 'cat-vietnamese', name: 'Vietnamese', slug: 'vietnamese' }],
    status: 'OPEN',
    rating: 4.8,
    address: '963 Hoàng Văn Thụ, Quận Tân Bình, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1619623032262-e44b9a7d1e9a?w=800',
    description: 'Famous Vietnamese baguette sandwiches with various fillings',
    ownerName: 'Ngô Thị Gấm',
    ownerPhone: '0903030303',
    ownerEmail: 'gam@banhmihh.com',
    registrationDate: '01/06/2023',
    totalRevenue: 520000000,
    totalOrders: 4123
  },
  {
    id: 'rest-13',
    name: 'Lẩu Thái Tom Yum',
    slug: 'lau-thai-tom-yum-rest-13',
    categories: [{ id: 'cat-thai', name: 'Thai', slug: 'thai' }],
    status: 'OPEN',
    rating: 4.7,
    address: '159 Nam Kỳ Khởi Nghĩa, Quận 1, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1547928578-f0f2f37da44a?w=800',
    description: 'Thai hot pot with authentic Tom Yum broth and fresh seafood',
    ownerName: 'Đặng Văn Hùng',
    ownerPhone: '0904040404',
    ownerEmail: 'hung@lauthai.com',
    registrationDate: '15/06/2023',
    totalRevenue: 670000000,
    totalOrders: 2345
  },
  {
    id: 'rest-14',
    name: 'Gà Rán KFC Style',
    slug: 'ga-ran-kfc-style-rest-14',
    categories: [{ id: 'cat-chicken', name: 'Chicken', slug: 'chicken' }],
    status: 'LOCKED',
    rating: 4.5,
    address: '357 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800',
    description: 'Crispy fried chicken with secret blend of spices',
    ownerName: 'Bùi Thị Lan',
    ownerPhone: '0905050505',
    ownerEmail: 'lan@garan.com',
    registrationDate: '01/07/2023',
    totalRevenue: 410000000,
    totalOrders: 2234
  },
  {
    id: 'rest-15',
    name: 'Trà Sữa Premium',
    slug: 'tra-sua-premium-rest-15',
    categories: [{ id: 'cat-drinks', name: 'Drinks', slug: 'drinks' }],
    status: 'OPEN',
    rating: 4.6,
    address: '246 Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800',
    description: 'Premium bubble tea with fresh milk and quality ingredients',
    ownerName: 'Võ Văn Ích',
    ownerPhone: '0906060606',
    ownerEmail: 'ich@trasua.com',
    registrationDate: '15/07/2023',
    totalRevenue: 340000000,
    totalOrders: 3456
  }
];

/**
 * Get restaurant by ID
 */
export function getRestaurantById(id: string): Restaurant | undefined {
  return mockRestaurants.find((restaurant) => restaurant.id === id);
}

/**
 * Get restaurants by status
 */
export function getRestaurantsByStatus(status: Restaurant['status']): Restaurant[] {
  return mockRestaurants.filter((restaurant) => restaurant.status === status);
}

/**
 * Get active restaurants
 */
export function getOpenRestaurants(): Restaurant[] {
  return getRestaurantsByStatus('OPEN');
}

/**
 * Get inactive restaurants
 */
export function getLockedRestaurants(): Restaurant[] {
  return getRestaurantsByStatus('LOCKED');
}

/**
 * Get closed restaurants
 */
export function getClosedRestaurants(): Restaurant[] {
  return getRestaurantsByStatus('CLOSED');
}
