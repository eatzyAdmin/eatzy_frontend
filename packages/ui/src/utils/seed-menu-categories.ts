/**
 * ========================================
 * MENU CATEGORIES SEED DATA
 * ========================================
 * Copied from mockSearchData.ts
 */

export interface MenuCategory {
  id: string;
  name: string;
  restaurantId: string;
  displayOrder: number;
}

export const SEED_MENU_CATEGORIES: MenuCategory[] = [
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
