import type { Restaurant, Dish, MenuCategory, Voucher } from '@repo/types';

// Mock restaurants for search
export const mockSearchRestaurants: Restaurant[] = [
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
  },
];

export const mockVouchers: Voucher[] = [
  // rest-1
  { id: 'vou-1-pct', restaurantId: 'rest-1', code: 'PHO20', description: 'Giảm 20% hóa đơn từ 200K', discountType: 'PERCENT', discountValue: 20, minOrderValue: 200000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-1-amt', restaurantId: 'rest-1', code: 'PHO50', description: 'Giảm 50K cho đơn từ 150K', discountType: 'AMOUNT', discountValue: 50000, minOrderValue: 150000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-2
  { id: 'vou-2-pct', restaurantId: 'rest-2', code: 'SUSHI10', description: 'Giảm 10% cho đơn từ 300K', discountType: 'PERCENT', discountValue: 10, minOrderValue: 300000, startDate: '2025-11-01', endDate: '2025-12-01', isAvailable: true },
  { id: 'vou-2-amt', restaurantId: 'rest-2', code: 'DEAL5K', description: 'Giảm 5K, thêm nhiều ưu đãi', discountType: 'AMOUNT', discountValue: 5000, minOrderValue: 80000, startDate: '2025-11-01', endDate: '2025-12-01', isAvailable: true },
  // rest-3
  { id: 'vou-3-pct', restaurantId: 'rest-3', code: 'PIZZA15', description: 'Giảm 15% đơn hàng', discountType: 'PERCENT', discountValue: 15, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-3-amt', restaurantId: 'rest-3', code: 'PASTA30', description: 'Giảm 30K đơn từ 180K', discountType: 'AMOUNT', discountValue: 30000, minOrderValue: 180000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-4
  { id: 'vou-4-pct', restaurantId: 'rest-4', code: 'BUN10', description: 'Giảm 10% cho món nước', discountType: 'PERCENT', discountValue: 10, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-4-amt', restaurantId: 'rest-4', code: 'RICE20', description: 'Giảm 20K đơn từ 120K', discountType: 'AMOUNT', discountValue: 20000, minOrderValue: 120000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-5
  { id: 'vou-5-pct', restaurantId: 'rest-5', code: 'COFFEE12', description: 'Giảm 12% đồ uống', discountType: 'PERCENT', discountValue: 12, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-5-amt', restaurantId: 'rest-5', code: 'PASTRY15', description: 'Giảm 15K bánh ngọt', discountType: 'AMOUNT', discountValue: 15000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-6
  { id: 'vou-6-pct', restaurantId: 'rest-6', code: 'BBQ8', description: 'Giảm 8% thịt nướng', discountType: 'PERCENT', discountValue: 8, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-6-amt', restaurantId: 'rest-6', code: 'STEWPOT40', description: 'Giảm 40K lẩu & canh', discountType: 'AMOUNT', discountValue: 40000, minOrderValue: 200000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-7
  { id: 'vou-7-pct', restaurantId: 'rest-7', code: 'THAI20', description: 'Giảm 20% set curry', discountType: 'PERCENT', discountValue: 20, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-7-amt', restaurantId: 'rest-7', code: 'SALAD15', description: 'Giảm 15K món khai vị', discountType: 'AMOUNT', discountValue: 15000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-8
  { id: 'vou-8-pct', restaurantId: 'rest-8', code: 'BURGER30', description: 'Giảm 30% burger thứ 2', discountType: 'PERCENT', discountValue: 30, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-8-amt', restaurantId: 'rest-8', code: 'SIDES20', description: 'Giảm 20K phần side', discountType: 'AMOUNT', discountValue: 20000, minOrderValue: 100000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-9
  { id: 'vou-9-pct', restaurantId: 'rest-9', code: 'DIM10', description: 'Giảm 10% dimsum', discountType: 'PERCENT', discountValue: 10, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-9-amt', restaurantId: 'rest-9', code: 'COMBO199', description: 'Combo dimsum 199K', discountType: 'AMOUNT', discountValue: 199000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  // rest-10
  { id: 'vou-10-pct', restaurantId: 'rest-10', code: 'MED12', description: 'Giảm 12% món chính', discountType: 'PERCENT', discountValue: 12, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
  { id: 'vou-10-amt', restaurantId: 'rest-10', code: 'MAIN50', description: 'Giảm 50K món chính', discountType: 'AMOUNT', discountValue: 50000, startDate: '2025-01-01', endDate: '2025-12-31', isAvailable: true },
];

// Menu categories for each restaurant
export const mockMenuCategories: MenuCategory[] = [
  // Phở Hà Nội
  { id: 'menu-cat-1-1', name: 'Phở & Noodles', restaurantId: 'rest-1', displayOrder: 1 },
  { id: 'menu-cat-1-2', name: 'Appetizers', restaurantId: 'rest-1', displayOrder: 2 },
  
  // Sushi Sakura
  { id: 'menu-cat-2-1', name: 'Sushi & Sashimi', restaurantId: 'rest-2', displayOrder: 1 },
  { id: 'menu-cat-2-2', name: 'Special Rolls', restaurantId: 'rest-2', displayOrder: 2 },
  
  // Pizza Bella Italia
  { id: 'menu-cat-3-1', name: 'Classic Pizzas', restaurantId: 'rest-3', displayOrder: 1 },
  { id: 'menu-cat-3-2', name: 'Pasta Dishes', restaurantId: 'rest-3', displayOrder: 2 },
  
  // Bún Bò Huế
  { id: 'menu-cat-4-1', name: 'Noodle Soups', restaurantId: 'rest-4', displayOrder: 1 },
  { id: 'menu-cat-4-2', name: 'Rice Dishes', restaurantId: 'rest-4', displayOrder: 2 },
  
  // Café De Paris
  { id: 'menu-cat-5-1', name: 'Coffee & Drinks', restaurantId: 'rest-5', displayOrder: 1 },
  { id: 'menu-cat-5-2', name: 'Pastries & Desserts', restaurantId: 'rest-5', displayOrder: 2 },
  
  // Korean BBQ
  { id: 'menu-cat-6-1', name: 'BBQ Meats', restaurantId: 'rest-6', displayOrder: 1 },
  { id: 'menu-cat-6-2', name: 'Hot Pots & Stews', restaurantId: 'rest-6', displayOrder: 2 },
  
  // Thai Spice
  { id: 'menu-cat-7-1', name: 'Curry & Stir-fry', restaurantId: 'rest-7', displayOrder: 1 },
  { id: 'menu-cat-7-2', name: 'Salads & Appetizers', restaurantId: 'rest-7', displayOrder: 2 },
  
  // Burger Brothers
  { id: 'menu-cat-8-1', name: 'Signature Burgers', restaurantId: 'rest-8', displayOrder: 1 },
  { id: 'menu-cat-8-2', name: 'Sides & Drinks', restaurantId: 'rest-8', displayOrder: 2 },
  
  // Dim Sum Palace
  { id: 'menu-cat-9-1', name: 'Steamed Dim Sum', restaurantId: 'rest-9', displayOrder: 1 },
  { id: 'menu-cat-9-2', name: 'Fried & Baked', restaurantId: 'rest-9', displayOrder: 2 },
  
  // Mediterranean Delight
  { id: 'menu-cat-10-1', name: 'Mezze & Salads', restaurantId: 'rest-10', displayOrder: 1 },
  { id: 'menu-cat-10-2', name: 'Main Courses', restaurantId: 'rest-10', displayOrder: 2 },
];

// Dishes for each restaurant
export const mockDishes: Dish[] = [
  // Phở Hà Nội - Phở & Noodles
  { id: 'dish-1-1', name: 'Phở Bò Tái', description: 'Rare beef pho with fresh herbs and lime', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-1', availableQuantity: 50, isAvailable: true, rating: 4.8,
    optionGroups: [
      { id: 'size', title: 'variant__19f2a48e6cddf3', options: [
        { id: 'size-s', name: 'Nhỏ', price: 60000 },
        { id: 'size-m', name: 'Vừa', price: 65000 },
        { id: 'size-l', name: 'Lớn', price: 75000 },
      ] },
      { id: 'ag-them', title: 'Thêm topping', options: [
        { id: 'add-trung', name: 'Trứng trần', price: 5000 },
        { id: 'add-thit', name: 'Thêm thịt', price: 15000 },
        { id: 'add-banh', name: 'Thêm bánh phở', price: 5000 },
      ] },
      { id: 'ag-cay', title: 'Độ cay', required: true, minSelect: 1, maxSelect: 1, options: [
        { id: 'cay-it', name: 'Ít cay', price: 0 },
        { id: 'cay-vua', name: 'Vừa cay', price: 0 },
        { id: 'cay-nhieu', name: 'Cay nhiều', price: 0 },
      ] },
    ]
  },
  { id: 'dish-1-2', name: 'Phở Gà', description: 'Chicken pho with tender meat and clear broth', price: 60000, imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-1', availableQuantity: 40, isAvailable: true, rating: 4.7 },
  { id: 'dish-1-3', name: 'Bún Chả', description: 'Grilled pork with vermicelli and herbs', price: 70000, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-1', availableQuantity: 35, isAvailable: true, rating: 4.9 },
  { id: 'dish-1-4', name: 'Bún Bò Huế', description: 'Spicy beef noodle soup from Central Vietnam', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-1', availableQuantity: 30, isAvailable: true, rating: 4.8 },
  
  // Phở Hà Nội - Appetizers
  { id: 'dish-1-5', name: 'Gỏi Cuốn', description: 'Fresh spring rolls with shrimp and pork', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-2', availableQuantity: 60, isAvailable: true, rating: 4.6 },
  { id: 'dish-1-6', name: 'Chả Giò', description: 'Crispy fried spring rolls', price: 50000, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-2', availableQuantity: 55, isAvailable: true, rating: 4.7 },
  { id: 'dish-1-7', name: 'Nem Chua Rán', description: 'Fried fermented pork rolls', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-2', availableQuantity: 45, isAvailable: true, rating: 4.5 },
  { id: 'dish-1-8', name: 'Gỏi Gà', description: 'Vietnamese chicken salad with herbs', price: 60000, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', restaurantId: 'rest-1', menuCategoryId: 'menu-cat-1-2', availableQuantity: 40, isAvailable: true, rating: 4.6 },

  // Sushi Sakura - Sushi & Sashimi
  { id: 'dish-2-1', name: 'Salmon Sashimi', description: 'Fresh Norwegian salmon sliced thin', price: 180000, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-1', availableQuantity: 25, isAvailable: true, rating: 4.9 },
  { id: 'dish-2-2', name: 'Tuna Sashimi', description: 'Premium bluefin tuna sashimi', price: 220000, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-1', availableQuantity: 20, isAvailable: true, rating: 5.0 },
  { id: 'dish-2-3', name: 'Nigiri Combo', description: 'Assorted nigiri sushi - 10 pieces', price: 250000, imageUrl: 'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-1', availableQuantity: 30, isAvailable: true, rating: 4.8 },
  { id: 'dish-2-4', name: 'Sashimi Platter', description: 'Mixed sashimi selection for sharing', price: 480000, imageUrl: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-1', availableQuantity: 15, isAvailable: true, rating: 4.9 },

  // Sushi Sakura - Special Rolls
  { id: 'dish-2-5', name: 'Dragon Roll', description: 'Eel and cucumber topped with avocado', price: 280000, imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-2', availableQuantity: 25, isAvailable: true, rating: 4.8 },
  { id: 'dish-2-6', name: 'Rainbow Roll', description: 'California roll topped with assorted fish', price: 300000, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-2', availableQuantity: 20, isAvailable: true, rating: 4.9 },
  { id: 'dish-2-7', name: 'Spicy Tuna Roll', description: 'Tuna with spicy mayo and cucumber', price: 240000, imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-2', availableQuantity: 30, isAvailable: true, rating: 4.7 },
  { id: 'dish-2-8', name: 'Volcano Roll', description: 'Baked seafood over California roll', price: 320000, imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400', restaurantId: 'rest-2', menuCategoryId: 'menu-cat-2-2', availableQuantity: 18, isAvailable: true, rating: 4.8 },

  // Pizza Bella Italia - Classic Pizzas
  { id: 'dish-3-1', name: 'Margherita', description: 'Classic pizza with tomato, mozzarella, basil', price: 140000, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-1', availableQuantity: 40, isAvailable: true, rating: 4.7 },
  { id: 'dish-3-2', name: 'Quattro Formaggi', description: 'Four cheese pizza with gorgonzola', price: 180000, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-1', availableQuantity: 35, isAvailable: true, rating: 4.8 },
  { id: 'dish-3-3', name: 'Diavola', description: 'Spicy salami with chili flakes', price: 160000, imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-1', availableQuantity: 38, isAvailable: true, rating: 4.6 },
  { id: 'dish-3-4', name: 'Prosciutto e Funghi', description: 'Ham and mushroom pizza', price: 170000, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-1', availableQuantity: 32, isAvailable: true, rating: 4.7 },

  // Pizza Bella Italia - Pasta Dishes
  { id: 'dish-3-5', name: 'Carbonara', description: 'Creamy pasta with bacon and parmesan', price: 150000, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-2', availableQuantity: 45, isAvailable: true, rating: 4.8 },
  { id: 'dish-3-6', name: 'Bolognese', description: 'Traditional meat sauce with spaghetti', price: 140000, imageUrl: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-2', availableQuantity: 50, isAvailable: true, rating: 4.7 },
  { id: 'dish-3-7', name: 'Pesto Genovese', description: 'Basil pesto with pine nuts', price: 145000, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-2', availableQuantity: 42, isAvailable: true, rating: 4.6 },
  { id: 'dish-3-8', name: 'Seafood Linguine', description: 'Mixed seafood in white wine sauce', price: 190000, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400', restaurantId: 'rest-3', menuCategoryId: 'menu-cat-3-2', availableQuantity: 28, isAvailable: true, rating: 4.9 },

  // Continue for remaining restaurants...
  // Bún Bò Huế - Noodle Soups
  { id: 'dish-4-1', name: 'Bún Bò Huế Đặc Biệt', description: 'Special spicy beef noodle soup', price: 80000, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-1', availableQuantity: 45, isAvailable: true, rating: 4.9 },
  { id: 'dish-4-2', name: 'Bún Riêu', description: 'Crab and tomato noodle soup', price: 70000, imageUrl: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-1', availableQuantity: 40, isAvailable: true, rating: 4.7 },
  { id: 'dish-4-3', name: 'Bún Mắm', description: 'Fermented fish noodle soup', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-1', availableQuantity: 35, isAvailable: true, rating: 4.6 },
  { id: 'dish-4-4', name: 'Bún Thịt Nướng', description: 'Grilled pork with vermicelli', price: 72000, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-1', availableQuantity: 50, isAvailable: true, rating: 4.8 },

  // Bún Bò Huế - Rice Dishes
  { id: 'dish-4-5', name: 'Cơm Tấm', description: 'Broken rice with grilled pork chop', price: 68000, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-2', availableQuantity: 55, isAvailable: true, rating: 4.7 },
  { id: 'dish-4-6', name: 'Cơm Gà Xối Mỡ', description: 'Chicken rice with rendered fat', price: 70000, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-2', availableQuantity: 45, isAvailable: true, rating: 4.6 },
  { id: 'dish-4-7', name: 'Cơm Chiên Dương Châu', description: 'Yangzhou fried rice', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-2', availableQuantity: 60, isAvailable: true, rating: 4.5 },
  { id: 'dish-4-8', name: 'Cơm Bò Lúc Lắc', description: 'Shaking beef with rice', price: 95000, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', restaurantId: 'rest-4', menuCategoryId: 'menu-cat-4-2', availableQuantity: 38, isAvailable: true, rating: 4.8 },

  // Café De Paris - Coffee & Drinks
  { id: 'dish-5-1', name: 'Espresso', description: 'Rich Italian espresso', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-1', availableQuantity: 100, isAvailable: true, rating: 4.7 },
  { id: 'dish-5-2', name: 'Cappuccino', description: 'Espresso with steamed milk foam', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-1', availableQuantity: 90, isAvailable: true, rating: 4.8 },
  { id: 'dish-5-3', name: 'Latte', description: 'Smooth espresso with steamed milk', price: 58000, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-1', availableQuantity: 95, isAvailable: true, rating: 4.7,
    optionGroups: [
      { id: 'size', title: 'variant__19f2a48e6cddf3', options: [
        { id: 'size-s', name: 'Nhỏ', price: 48000 },
        { id: 'size-m', name: 'Vừa', price: 58000 },
        { id: 'size-l', name: 'Lớn', price: 65000 },
      ] },
      { id: 'ag-ice', title: 'Đá', required: true, minSelect: 1, maxSelect: 1, options: [
        { id: 'ice-it', name: 'Ít đá', price: 0 },
        { id: 'ice-vua', name: 'Trung bình', price: 0 },
        { id: 'ice-nhieu', name: 'Nhiều đá', price: 0 },
      ] },
      { id: 'ag-topping', title: 'Topping thêm', options: [
        { id: 'top-tranchau', name: 'Trân châu đen', price: 8000 },
        { id: 'top-tranchau-trang', name: 'Trân châu trắng', price: 8000 },
        { id: 'top-syrup', name: 'Thêm syrup', price: 5000 },
      ] },
    ]
  },
  { id: 'dish-5-4', name: 'Vietnamese Iced Coffee', description: 'Strong coffee with condensed milk', price: 48000, imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-1', availableQuantity: 80, isAvailable: true, rating: 4.9 },

  // Café De Paris - Pastries & Desserts
  { id: 'dish-5-5', name: 'Croissant', description: 'Buttery French croissant', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-2', availableQuantity: 70, isAvailable: true, rating: 4.6 },
  { id: 'dish-5-6', name: 'Pain au Chocolat', description: 'Chocolate-filled pastry', price: 42000, imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-2', availableQuantity: 65, isAvailable: true, rating: 4.7 },
  { id: 'dish-5-7', name: 'Éclair', description: 'Cream-filled choux pastry', price: 48000, imageUrl: 'https://images.unsplash.com/photo-1612201142855-0e6f7cd2c40d?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-2', availableQuantity: 55, isAvailable: true, rating: 4.8 },
  { id: 'dish-5-8', name: 'Macaron Box', description: 'Assorted French macarons - 6 pieces', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400', restaurantId: 'rest-5', menuCategoryId: 'menu-cat-5-2', availableQuantity: 40, isAvailable: true, rating: 4.9 },

  // Korean BBQ - BBQ Meats
  { id: 'dish-6-1', name: 'Galbi', description: 'Marinated beef short ribs', price: 280000, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-1', availableQuantity: 35, isAvailable: true, rating: 4.9 },
  { id: 'dish-6-2', name: 'Bulgogi', description: 'Marinated sliced beef', price: 250000, imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-1', availableQuantity: 40, isAvailable: true, rating: 4.8 },
  { id: 'dish-6-3', name: 'Samgyeopsal', description: 'Pork belly slices for grilling', price: 220000, imageUrl: 'https://images.unsplash.com/photo-1601942976502-06e0e19a8b0e?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-1', availableQuantity: 45, isAvailable: true, rating: 4.7 },
  { id: 'dish-6-4', name: 'Chicken Skewers', description: 'Marinated chicken for grilling', price: 180000, imageUrl: 'https://images.unsplash.com/photo-1633237308525-cd587cf71926?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-1', availableQuantity: 50, isAvailable: true, rating: 4.6 },

  // Korean BBQ - Hot Pots & Stews
  { id: 'dish-6-5', name: 'Kimchi Jjigae', description: 'Kimchi stew with pork', price: 120000, imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-2', availableQuantity: 55, isAvailable: true, rating: 4.8 },
  { id: 'dish-6-6', name: 'Budae Jjigae', description: 'Army stew with assorted ingredients', price: 140000, imageUrl: 'https://images.unsplash.com/photo-1606850780554-b55ef629bb5a?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-2', availableQuantity: 48, isAvailable: true, rating: 4.7 },
  { id: 'dish-6-7', name: 'Sundubu Jjigae', description: 'Soft tofu stew', price: 110000, imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-2', availableQuantity: 60, isAvailable: true, rating: 4.6 },
  { id: 'dish-6-8', name: 'Seafood Hot Pot', description: 'Mixed seafood in spicy broth', price: 280000, imageUrl: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400', restaurantId: 'rest-6', menuCategoryId: 'menu-cat-6-2', availableQuantity: 30, isAvailable: true, rating: 4.9 },

  // Thai Spice - Curry & Stir-fry
  { id: 'dish-7-1', name: 'Pad Thai', description: 'Stir-fried noodles with tamarind sauce', price: 95000, imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-1', availableQuantity: 60, isAvailable: true, rating: 4.8 },
  { id: 'dish-7-2', name: 'Green Curry', description: 'Thai green curry with chicken', price: 110000, imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-1', availableQuantity: 50, isAvailable: true, rating: 4.7 },
  { id: 'dish-7-3', name: 'Massaman Curry', description: 'Rich curry with peanuts and potatoes', price: 115000, imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-1', availableQuantity: 45, isAvailable: true, rating: 4.9 },
  { id: 'dish-7-4', name: 'Basil Chicken Stir-fry', description: 'Spicy chicken with Thai basil', price: 105000, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-1', availableQuantity: 55, isAvailable: true, rating: 4.6 },

  // Thai Spice - Salads & Appetizers
  { id: 'dish-7-5', name: 'Som Tam', description: 'Spicy green papaya salad', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-2', availableQuantity: 65, isAvailable: true, rating: 4.7 },
  { id: 'dish-7-6', name: 'Tom Yum Soup', description: 'Hot and sour soup with shrimp', price: 90000, imageUrl: 'https://images.unsplash.com/photo-1547928578-f0f2f37da44a?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-2', availableQuantity: 58, isAvailable: true, rating: 4.8 },
  { id: 'dish-7-7', name: 'Spring Rolls', description: 'Fresh vegetable spring rolls', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-2', availableQuantity: 70, isAvailable: true, rating: 4.5 },
  { id: 'dish-7-8', name: 'Satay Skewers', description: 'Grilled meat skewers with peanut sauce', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', restaurantId: 'rest-7', menuCategoryId: 'menu-cat-7-2', availableQuantity: 62, isAvailable: true, rating: 4.7 },

  // Burger Brothers - Signature Burgers
  { id: 'dish-8-1', name: 'Classic Cheeseburger', description: 'Beef patty with cheddar and special sauce', price: 115000, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-1', availableQuantity: 50, isAvailable: true, rating: 4.7 },
  { id: 'dish-8-2', name: 'Bacon BBQ Burger', description: 'Beef with bacon and BBQ sauce', price: 135000, imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-1', availableQuantity: 45, isAvailable: true, rating: 4.8 },
  { id: 'dish-8-3', name: 'Mushroom Swiss Burger', description: 'Sautéed mushrooms with Swiss cheese', price: 125000, imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-1', availableQuantity: 42, isAvailable: true, rating: 4.6 },
  { id: 'dish-8-4', name: 'Spicy Jalapeño Burger', description: 'Beef with jalapeños and pepper jack', price: 128000, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-1', availableQuantity: 48, isAvailable: true, rating: 4.7 },

  // Burger Brothers - Sides & Drinks
  { id: 'dish-8-5', name: 'French Fries', description: 'Crispy golden fries', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-2', availableQuantity: 100, isAvailable: true, rating: 4.5 },
  { id: 'dish-8-6', name: 'Onion Rings', description: 'Crispy battered onion rings', price: 50000, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-2', availableQuantity: 85, isAvailable: true, rating: 4.6 },
  { id: 'dish-8-7', name: 'Milkshake', description: 'Thick vanilla milkshake', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-2', availableQuantity: 90, isAvailable: true, rating: 4.7 },
  { id: 'dish-8-8', name: 'Coleslaw', description: 'Fresh cabbage slaw', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400', restaurantId: 'rest-8', menuCategoryId: 'menu-cat-8-2', availableQuantity: 95, isAvailable: true, rating: 4.4 },

  // Dim Sum Palace - Steamed Dim Sum
  { id: 'dish-9-1', name: 'Har Gow', description: 'Steamed shrimp dumplings', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-1', availableQuantity: 60, isAvailable: true, rating: 4.9 },
  { id: 'dish-9-2', name: 'Siu Mai', description: 'Pork and shrimp dumplings', price: 80000, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-1', availableQuantity: 65, isAvailable: true, rating: 4.8 },
  { id: 'dish-9-3', name: 'Char Siu Bao', description: 'BBQ pork buns', price: 75000, imageUrl: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-1', availableQuantity: 70, isAvailable: true, rating: 4.7 },
  { id: 'dish-9-4', name: 'Xiao Long Bao', description: 'Soup dumplings', price: 95000, imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-1', availableQuantity: 55, isAvailable: true, rating: 5.0 },

  // Dim Sum Palace - Fried & Baked
  { id: 'dish-9-5', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 70000, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-2', availableQuantity: 75, isAvailable: true, rating: 4.6 },
  { id: 'dish-9-6', name: 'Turnip Cake', description: 'Pan-fried radish cake', price: 65000, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-2', availableQuantity: 68, isAvailable: true, rating: 4.5 },
  { id: 'dish-9-7', name: 'Egg Tarts', description: 'Portuguese-style egg custard tarts', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1587241321921-91a834d82ffc?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-2', availableQuantity: 80, isAvailable: true, rating: 4.8 },
  { id: 'dish-9-8', name: 'Sesame Balls', description: 'Fried glutinous rice balls with sesame', price: 60000, imageUrl: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400', restaurantId: 'rest-9', menuCategoryId: 'menu-cat-9-2', availableQuantity: 72, isAvailable: true, rating: 4.7 },

  // Mediterranean Delight - Mezze & Salads
  { id: 'dish-10-1', name: 'Hummus Platter', description: 'Chickpea dip with olive oil and pita', price: 85000, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-1', availableQuantity: 70, isAvailable: true, rating: 4.7 },
  { id: 'dish-10-2', name: 'Greek Salad', description: 'Fresh salad with feta and olives', price: 95000, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-1', availableQuantity: 65, isAvailable: true, rating: 4.6 },
  { id: 'dish-10-3', name: 'Falafel', description: 'Crispy chickpea fritters', price: 80000, imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-1', availableQuantity: 75, isAvailable: true, rating: 4.8 },
  { id: 'dish-10-4', name: 'Baba Ganoush', description: 'Smoky eggplant dip', price: 78000, imageUrl: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-1', availableQuantity: 68, isAvailable: true, rating: 4.5 },

  // Mediterranean Delight - Main Courses
  { id: 'dish-10-5', name: 'Lamb Kebab', description: 'Grilled lamb skewers with spices', price: 180000, imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-2', availableQuantity: 45, isAvailable: true, rating: 4.9 },
  { id: 'dish-10-6', name: 'Chicken Shawarma', description: 'Marinated chicken with tahini sauce', price: 140000, imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-2', availableQuantity: 50, isAvailable: true, rating: 4.7 },
  { id: 'dish-10-7', name: 'Moussaka', description: 'Layered eggplant and meat casserole', price: 150000, imageUrl: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-2', availableQuantity: 38, isAvailable: true, rating: 4.8 },
  { id: 'dish-10-8', name: 'Seafood Paella', description: 'Spanish rice with mixed seafood', price: 220000, imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400', restaurantId: 'rest-10', menuCategoryId: 'menu-cat-10-2', availableQuantity: 30, isAvailable: true, rating: 4.9 },
];

// Helper function to get dishes for a restaurant
export function getDishesForRestaurant(restaurantId: string): Dish[] {
  return mockDishes.filter(dish => dish.restaurantId === restaurantId);
}

// Helper function to get menu categories for a restaurant
export function getMenuCategoriesForRestaurant(restaurantId: string): MenuCategory[] {
  return mockMenuCategories.filter(cat => cat.restaurantId === restaurantId);
}

// Helper function to get dishes by menu category
export function getDishesByMenuCategory(menuCategoryId: string): Dish[] {
  return mockDishes.filter(dish => dish.menuCategoryId === menuCategoryId);
}

// Search function - filters restaurants based on query
export function searchRestaurants(query: string): Restaurant[] {
  if (!query || query.trim() === '') {
    return mockSearchRestaurants;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  
  return mockSearchRestaurants.filter(restaurant => {
    // Search in restaurant name
    if (restaurant.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in restaurant description
    if (restaurant.description?.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in restaurant categories
    if (restaurant.categories.some(cat => cat.name.toLowerCase().includes(lowerQuery))) {
      return true;
    }
    
    // Search in dishes
    const restaurantDishes = getDishesForRestaurant(restaurant.id);
    if (restaurantDishes.some(dish => 
      dish.name.toLowerCase().includes(lowerQuery) || 
      dish.description.toLowerCase().includes(lowerQuery)
    )) {
      return true;
    }
    
    return false;
  });
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return mockSearchRestaurants.find(r => r.id === id);
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return mockSearchRestaurants.find(r => r.slug === slug);
}

export function getVouchersForRestaurant(restaurantId: string): Voucher[] {
  return mockVouchers.filter(v => v.restaurantId === restaurantId && v.isAvailable !== false);
}


