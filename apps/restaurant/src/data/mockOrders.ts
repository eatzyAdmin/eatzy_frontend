import type { Order } from '@repo/types';

export const mockRestaurantOrders: Order[] = [
  // Pending Confirmation Orders
  {
    id: 'order-001',
    code: 'ORD-001',
    restaurantId: 'rest-abc',
    status: 'PLACED',
    deliveryLocation: {
      lng: 106.6297,
      lat: 10.8231,
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM'
    },
    restaurantLocation: {
      lng: 106.6977,
      lat: 10.7769,
      name: 'Nhà Hàng ABC'
    },
    driverLocation: {
      lng: 106.6500,
      lat: 10.8000,
      name: 'Tài xế Nguyễn Văn A'
    },
    items: [
      {
        id: 'item-001',
        name: 'Phở Bò Đặc Biệt',
        price: 65000,
        quantity: 2,
        restaurantId: 'rest-abc',
        imageUrl: '/images/pho-bo.jpg',
        options: {
          variant: { id: 'v1', name: 'Tô Lớn', price: 10000 },
          addons: [
            { id: 'a1', name: 'Thêm thịt', price: 15000 },
            { id: 'a2', name: 'Thêm giò', price: 10000 }
          ]
        }
      },
      {
        id: 'item-002',
        name: 'Gỏi Cuốn',
        price: 35000,
        quantity: 1,
        restaurantId: 'rest-abc',
        imageUrl: '/images/goi-cuon.jpg'
      }
    ],
    subtotal: 215000,
    fee: 15000,
    discount: 20000,
    total: 210000,
    createdAt: new Date().toISOString()
  },
  {
    id: 'order-002',
    code: 'ORD-002',
    restaurantId: 'rest-abc',
    status: 'PLACED',
    deliveryLocation: {
      lng: 106.6500,
      lat: 10.8100,
      address: '456 Lê Lợi, Quận 1, TP.HCM'
    },
    restaurantLocation: {
      lng: 106.6977,
      lat: 10.7769,
      name: 'Nhà Hàng ABC'
    },
    driverLocation: {
      lng: 106.6500,
      lat: 10.8000
    },
    items: [
      {
        id: 'item-003',
        name: 'Bún Bò Huế',
        price: 55000,
        quantity: 1,
        restaurantId: 'rest-abc',
        options: {
          variant: { id: 'v2', name: 'Cay vừa', price: 0 },
          addons: [
            { id: 'a3', name: 'Chả', price: 12000 }
          ]
        }
      }
    ],
    subtotal: 67000,
    fee: 12000,
    discount: 0,
    total: 79000,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },

  // In Progress Orders
  {
    id: 'order-003',
    code: 'ORD-003',
    restaurantId: 'rest-abc',
    status: 'PREPARED',
    deliveryLocation: {
      lng: 106.6800,
      lat: 10.7900,
      address: '789 Võ Văn Kiệt, Quận 5, TP.HCM'
    },
    restaurantLocation: {
      lng: 106.6977,
      lat: 10.7769,
      name: 'Nhà Hàng ABC'
    },
    driverLocation: {
      lng: 106.6500,
      lat: 10.8000
    },
    items: [
      {
        id: 'item-004',
        name: 'Cơm Tấm Sườn Bì Chả',
        price: 45000,
        quantity: 2,
        restaurantId: 'rest-abc',
        imageUrl: '/images/com-tam.jpg',
        options: {
          addons: [
            { id: 'a4', name: 'Thêm trứng ốp la', price: 10000 }
          ]
        }
      },
      {
        id: 'item-005',
        name: 'Trà Đá',
        price: 5000,
        quantity: 2,
        restaurantId: 'rest-abc'
      }
    ],
    subtotal: 110000,
    fee: 18000,
    discount: 15000,
    total: 113000,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: 'order-004',
    code: 'ORD-004',
    restaurantId: 'rest-abc',
    status: 'PREPARED',
    deliveryLocation: {
      lng: 106.6950,
      lat: 10.7850,
      address: '321 Trần Hưng Đạo, Quận 1, TP.HCM'
    },
    restaurantLocation: {
      lng: 106.6977,
      lat: 10.7769,
      name: 'Nhà Hàng ABC'
    },
    driverLocation: {
      lng: 106.6500,
      lat: 10.8000
    },
    items: [
      {
        id: 'item-006',
        name: 'Bánh Mì Thịt Nướng',
        price: 25000,
        quantity: 3,
        restaurantId: 'rest-abc'
      }
    ],
    subtotal: 75000,
    fee: 10000,
    discount: 5000,
    total: 80000,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  }
];

export function getOrdersByStatus(status: Order['status']): Order[] {
  return mockRestaurantOrders.filter(order => order.status === status);
}

export function getOrderById(id: string): Order | undefined {
  return mockRestaurantOrders.find(order => order.id === id);
}
