import type { Order } from "@repo/types";

export const mockOrders: Order[] = [
  {
    id: "ord-1001",
    code: "EZ-1001",
    restaurantId: "rest-1",
    status: "PLACED",
    deliveryLocation: { lng: 106.7009, lat: 10.7757, address: "Nguyễn Huệ, Q1" },
    restaurantLocation: { lng: 106.6923, lat: 10.7798, name: "Phở Hà Nội" },
    driverLocation: { lng: 106.7039, lat: 10.7705, name: "Tài xế A" },
    items: [
      { id: "dish-1-1", name: "Phở Bò Tái", price: 65000, imageUrl: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", restaurantId: "rest-1", quantity: 1 },
      { id: "dish-1-5", name: "Gỏi Cuốn", price: 45000, imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", restaurantId: "rest-1", quantity: 1 },
    ],
    subtotal: 110000,
    fee: 15000,
    discount: 0,
    total: 125000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ord-1002",
    code: "EZ-1002",
    restaurantId: "rest-2",
    status: "PREPARED",
    deliveryLocation: { lng: 106.6885, lat: 10.7762, address: "Lê Lợi, Q1" },
    restaurantLocation: { lng: 106.7007, lat: 10.7722, name: "Sushi Sakura" },
    driverLocation: { lng: 106.6956, lat: 10.7688, name: "Tài xế B" },
    items: [
      { id: "dish-2-1", name: "Salmon Sashimi", price: 180000, imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", restaurantId: "rest-2", quantity: 1 },
      { id: "dish-2-5", name: "Dragon Roll", price: 280000, imageUrl: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400", restaurantId: "rest-2", quantity: 1 },
    ],
    subtotal: 460000,
    fee: 25000,
    discount: 30000,
    total: 455000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ord-1003",
    code: "EZ-1003",
    restaurantId: "rest-3",
    status: "PICKED",
    deliveryLocation: { lng: 106.6765, lat: 10.7626, address: "Pasteur, Q3" },
    restaurantLocation: { lng: 106.6789, lat: 10.7769, name: "Pizza Bella Italia" },
    driverLocation: { lng: 106.6806, lat: 10.7701, name: "Tài xế C" },
    items: [
      { id: "dish-3-1", name: "Margherita", price: 140000, imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", restaurantId: "rest-3", quantity: 1 },
      { id: "dish-3-5", name: "Carbonara", price: 150000, imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", restaurantId: "rest-3", quantity: 1 },
    ],
    subtotal: 290000,
    fee: 20000,
    discount: 0,
    total: 310000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getOrders = () => mockOrders;
