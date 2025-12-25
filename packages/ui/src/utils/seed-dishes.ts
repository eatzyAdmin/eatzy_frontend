/**
 * ========================================
 * DISHES SEED DATA
 * ========================================
 * Dishes for all 10 restaurants
 * These must match with items in orders!
 */

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

export const SEED_DISHES: Dish[] = [
  // ========================================
  // Phở Hà Nội (rest-1)
  // ========================================
  {
    id: 'dish-1-1',
    name: 'Phở Bò Tái',
    description: 'Rare beef pho with fresh herbs and lime',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-1',
    availableQuantity: 50,
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: 'dish-1-2',
    name: 'Phở Gà',
    description: 'Chicken pho with tender meat and clear broth',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-1',
    availableQuantity: 40,
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: 'dish-1-3',
    name: 'Bún Chả',
    description: 'Grilled pork with vermicelli and herbs',
    price: 70000,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-1',
    availableQuantity: 35,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'dish-1-4',
    name: 'Bún Bò Huế',
    description: 'Spicy beef noodle soup from Central Vietnam',
    price: 75000,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-1',
    availableQuantity: 30,
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: 'dish-1-5',
    name: 'Gỏi Cuốn',
    description: 'Fresh spring rolls with shrimp and pork',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-2',
    availableQuantity: 60,
    isAvailable: true,
    rating: 4.6,
  },
  {
    id: 'dish-1-6',
    name: 'Chả Giò',
    description: 'Crispy fried spring rolls',
    price: 50000,
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'menu-cat-1-2',
    availableQuantity: 55,
    isAvailable: true,
    rating: 4.7,
  },

  // ========================================
  // Sushi Sakura (rest-2)
  // ========================================
  {
    id: 'dish-2-1',
    name: 'Salmon Sashimi',
    description: 'Fresh Norwegian salmon sliced thin',
    price: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    restaurantId: 'rest-2',
    menuCategoryId: 'menu-cat-2-1',
    availableQuantity: 25,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'dish-2-5',
    name: 'Dragon Roll',
    description: 'Eel and cucumber topped with avocado',
    price: 280000,
    imageUrl: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
    restaurantId: 'rest-2',
    menuCategoryId: 'menu-cat-2-2',
    availableQuantity: 25,
    isAvailable: true,
    rating: 4.8,
  },

  // ========================================
  // Pizza Bella Italia (rest-3)
  // ========================================
  {
    id: 'dish-3-1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato, mozzarella, basil',
    price: 140000,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    restaurantId: 'rest-3',
    menuCategoryId: 'menu-cat-3-1',
    availableQuantity: 40,
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: 'dish-3-2',
    name: 'Quattro Formaggi',
    description: 'Four cheese pizza with gorgonzola',
    price: 180000,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    restaurantId: 'rest-3',
    menuCategoryId: 'menu-cat-3-1',
    availableQuantity: 35,
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: 'dish-3-5',
    name: 'Carbonara Pasta',
    description: 'Creamy pasta with bacon and parmesan',
    price: 150000,
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    restaurantId: 'rest-3',
    menuCategoryId: 'menu-cat-3-2',
    availableQuantity: 45,
    isAvailable: true,
    rating: 4.8,
  },

  // ========================================
  // Bún Bò Huế Authentic (rest-4)
  // ========================================
  {
    id: 'dish-4-1',
    name: 'Bún Bò Huế Đặc Biệt',
    description: 'Special spicy beef noodle soup',
    price: 80000,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    restaurantId: 'rest-4',
    menuCategoryId: 'menu-cat-4-1',
    availableQuantity: 45,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'dish-4-5',
    name: 'Cơm Tấm',
    description: 'Broken rice with grilled pork chop',
    price: 68000,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    restaurantId: 'rest-4',
    menuCategoryId: 'menu-cat-4-2',
    availableQuantity: 55,
    isAvailable: true,
    rating: 4.7,
  },

  // ========================================
  // Café De Paris (rest-5)
  // ========================================
  {
    id: 'dish-5-3',
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: 58000,
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    restaurantId: 'rest-5',
    menuCategoryId: 'menu-cat-5-1',
    availableQuantity: 95,
    isAvailable: true,
    rating: 4.7,
  },
  {
    id: 'dish-5-5',
    name: 'Croissant',
    description: 'Buttery French croissant',
    price: 38000,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    restaurantId: 'rest-5',
    menuCategoryId: 'menu-cat-5-2',
    availableQuantity: 70,
    isAvailable: true,
    rating: 4.6,
  },

  // ========================================
  // Korean BBQ House (rest-6)
  // ========================================
  {
    id: 'dish-6-1',
    name: 'Galbi',
    description: 'Marinated beef short ribs',
    price: 280000,
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400',
    restaurantId: 'rest-6',
    menuCategoryId: 'menu-cat-6-1',
    availableQuantity: 35,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'dish-6-5',
    name: 'Kimchi Jjigae',
    description: 'Kimchi stew with pork',
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400',
    restaurantId: 'rest-6',
    menuCategoryId: 'menu-cat-6-2',
    availableQuantity: 55,
    isAvailable: true,
    rating: 4.8,
  },

  // ========================================
  // Thai Spice Kitchen (rest-7)
  // ========================================
  {
    id: 'dish-7-1',
    name: 'Pad Thai',
    description: 'Stir-fried noodles with tamarind sauce',
    price: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
    restaurantId: 'rest-7',
    menuCategoryId: 'menu-cat-7-1',
    availableQuantity: 60,
    isAvailable: true,
    rating: 4.8,
  },
  {
    id: 'dish-7-6',
    name: 'Tom Yum Soup',
    description: 'Hot and sour soup with shrimp',
    price: 90000,
    imageUrl: 'https://images.unsplash.com/photo-1547928578-f0f2f37da44a?w=400',
    restaurantId: 'rest-7',
    menuCategoryId: 'menu-cat-7-2',
    availableQuantity: 58,
    isAvailable: true,
    rating: 4.8,
  },

  // ========================================
  // Burger Brothers (rest-8)
  // ========================================
  {
    id: 'dish-8-1',
    name: 'Classic Cheeseburger',
    description: 'Beef patty with cheddar and special sauce',
    price: 115000,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    restaurantId: 'rest-8',
    menuCategoryId: 'menu-cat-8-1',
    availableQuantity: 50,
    isAvailable: true,
    rating: 4.7,
  },

  // ========================================
  // Dim Sum Palace (rest-9)
  // ========================================
  {
    id: 'dish-9-1',
    name: 'Har Gow',
    description: 'Steamed shrimp dumplings',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400',
    restaurantId: 'rest-9',
    menuCategoryId: 'menu-cat-9-1',
    availableQuantity: 60,
    isAvailable: true,
    rating: 4.9,
  },
  {
    id: 'dish-9-4',
    name: 'Xiao Long Bao',
    description: 'Soup dumplings',
    price: 95000,
    imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=400',
    restaurantId: 'rest-9',
    menuCategoryId: 'menu-cat-9-1',
    availableQuantity: 55,
    isAvailable: true,
    rating: 5.0,
  },

  // ========================================
  // Mediterranean Delight (rest-10)
  // ========================================
  {
    id: 'dish-10-1',
    name: 'Hummus Platter',
    description: 'Chickpea dip with olive oil and pita',
    price: 85000,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    restaurantId: 'rest-10',
    menuCategoryId: 'menu-cat-10-1',
    availableQuantity: 70,
    isAvailable: true,
    rating: 4.7,
  },
];
