import { Dish, MenuCategory } from '@repo/types';

export const mockCategories: MenuCategory[] = [
  { id: 'cat-1', name: 'Phở & Noodles', restaurantId: 'rest-1', displayOrder: 1 },
  { id: 'cat-2', name: 'Appetizers', restaurantId: 'rest-1', displayOrder: 2 },
  { id: 'cat-3', name: 'Drinks', restaurantId: 'rest-1', displayOrder: 3 },
];

export const mockDishes: Dish[] = [
  {
    id: 'dish-1',
    name: 'Phở Bò Tái',
    description: 'Rare beef pho with fresh herbs and lime',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'cat-1',
    availableQuantity: 50,
    isAvailable: true,
    optionGroups: [
      {
        id: 'group-1',
        title: 'Size',
        minSelect: 1,
        maxSelect: 1,
        required: true,
        options: [
          { id: 'opt-1-1', name: 'Nhỏ', price: 0 },
          { id: 'opt-1-2', name: 'Vừa', price: 10000 },
          { id: 'opt-1-3', name: 'Lớn', price: 20000 },
        ]
      },
      {
        id: 'group-2',
        title: 'Toppings',
        minSelect: 0,
        maxSelect: 5,
        required: false,
        options: [
          { id: 'opt-2-1', name: 'Trứng trần', price: 5000 },
          { id: 'opt-2-2', name: 'Thêm thịt', price: 15000 },
          { id: 'opt-2-3', name: 'Quẩy', price: 3000 },
        ]
      }
    ]
  },
  {
    id: 'dish-2',
    name: 'Phở Gà',
    description: 'Chicken pho with tender meat',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'cat-1',
    availableQuantity: 40,
    isAvailable: true,
    optionGroups: []
  },
  {
    id: 'dish-3',
    name: 'Gỏi Cuốn',
    description: 'Fresh spring rolls',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'cat-2',
    availableQuantity: 60,
    isAvailable: true,
    optionGroups: []
  },
  {
    id: 'dish-4',
    name: 'Trà Đá',
    description: 'Iced Tea',
    price: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    restaurantId: 'rest-1',
    menuCategoryId: 'cat-3',
    availableQuantity: 999,
    isAvailable: true,
    optionGroups: []
  }
];
