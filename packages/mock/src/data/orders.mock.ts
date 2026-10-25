import type {
  Order,
  OrderResponse,
  DriverOrderOffer,
  DriverActiveOrder,
  PaymentMethod,
} from "@repo/types";
import { MOCK_RESTAURANTS } from "./restaurants.mock";

export const MOCK_ORDERS: Order[] = [
  // 1. PLACED (Active - Pending Restaurant Acceptance)
  {
    id: "1001",
    code: "#ORD-1001",
    restaurantId: "101",
    status: "PLACED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7932,
      lng: 106.6719,
      name: "Cơm Tấm Ba Ghiền",
    },
    driverLocation: {
      lat: 10.785,
      lng: 106.685,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1001-1",
        name: "Cơm Tấm Sườn Bì Chả Đặc Biệt",
        price: 85000,
        quantity: 2,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
        options: {
          variant: { id: "opt-r-1", name: "Cơm vừa", price: 0 },
          addons: [{ id: "opt-egg-1", name: "Trứng ốp la lòng đào", price: 10000 }],
        },
      },
      {
        id: "item-1001-2",
        name: "Canh Khổ Qua Nhồi Thịt",
        price: 25000,
        quantity: 1,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
      },
      {
        id: "item-1001-3",
        name: "Trà Tắc Mật Ong Hạt Chia",
        price: 20000,
        quantity: 2,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
    ],
    subtotal: 255000,
    fee: 16000,
    discount: 25000,
    total: 246000,
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 2. PREPARING (Active - Kitchen cooking, driver assigned)
  {
    id: "1002",
    code: "#ORD-1002",
    restaurantId: "102",
    status: "PREPARED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7698,
      lng: 106.6974,
      name: "Phở Thìn Lò Đúc - Chi Nhánh Sài Gòn",
    },
    driverLocation: {
      lat: 10.771,
      lng: 106.699,
      name: "Tài xế Trần Văn Bình",
    },
    items: [
      {
        id: "item-1002-1",
        name: "Phở Bò Tái Lăn Hà Nội",
        price: 75000,
        quantity: 2,
        restaurantId: "102",
        imageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=400&q=80",
        options: {
          variant: { id: "opt-pho-big", name: "Tô Lớn Đặc Biệt (+)", price: 15000 },
          addons: [{ id: "opt-quay", name: "Đĩa quẩy giòn (3 cái)", price: 10000 }],
        },
      },
      {
        id: "item-1002-2",
        name: "Trứng gà chần nước phở",
        price: 10000,
        quantity: 2,
        restaurantId: "102",
        imageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&q=80",
      },
    ],
    subtotal: 220000,
    fee: 18000,
    discount: 20000,
    total: 218000,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 3. ARRIVED (Active - Driver arrived at delivery location)
  {
    id: "1003",
    code: "#ORD-1003",
    restaurantId: "106",
    status: "ARRIVED" as any,
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7745,
      lng: 106.7021,
      name: "Phúc Long Coffee & Tea",
    },
    driverLocation: {
      lat: 10.7728,
      lng: 106.6983,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1003-1",
        name: "Trà Sữa Phúc Long Truyền Thống",
        price: 45000,
        quantity: 2,
        restaurantId: "106",
        imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
        options: {
          variant: { id: "opt-sw-70", name: "70% đường, 70% đá", price: 0 },
          addons: [{ id: "opt-top-tc-trang", name: "Trân châu trắng giòn", price: 12000 }],
        },
      },
      {
        id: "item-1003-2",
        name: "Trà Đào Cam Sả Tươi",
        price: 52000,
        quantity: 1,
        restaurantId: "106",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
    ],
    subtotal: 166000,
    fee: 15000,
    discount: 15000,
    total: 166000,
    createdAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 4. DELIVERED (Past completed order - 2 hours ago)
  {
    id: "1004",
    code: "#ORD-1004",
    restaurantId: "101",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7932,
      lng: 106.6719,
      name: "Cơm Tấm Ba Ghiền",
    },
    driverLocation: {
      lat: 10.7725,
      lng: 106.698,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1004-1",
        name: "Cơm Tấm Sườn Bì Chả Đặc Biệt",
        price: 85000,
        quantity: 1,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
        options: {
          addons: [{ id: "opt-egg-1", name: "Trứng ốp la lòng đào", price: 10000 }],
        },
      },
      {
        id: "item-1004-2",
        name: "Canh Khổ Qua Nhồi Thịt",
        price: 25000,
        quantity: 1,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
      },
    ],
    subtotal: 120000,
    fee: 16000,
    discount: 15000,
    total: 121000,
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 5. DELIVERED (Past completed order - Yesterday)
  {
    id: "1005",
    code: "#ORD-1005",
    restaurantId: "102",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7718,
      lng: 106.7044,
      address: "Số 2 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh (Bitexco)",
    },
    restaurantLocation: {
      lat: 10.7698,
      lng: 106.6974,
      name: "Phở Thìn Lò Đúc - Chi Nhánh Sài Gòn",
    },
    driverLocation: {
      lat: 10.7718,
      lng: 106.7044,
      name: "Tài xế Nguyễn Văn An",
    },
    items: [
      {
        id: "item-1005-1",
        name: "Phở Bò Tái Lăn Hà Nội",
        price: 75000,
        quantity: 2,
        restaurantId: "102",
        imageUrl: "https://images.unsplash.com/photo-1582878826629-297527132b04?w=400&q=80",
        options: {
          addons: [{ id: "opt-quay", name: "Đĩa quẩy giòn (3 cái)", price: 10000 }],
        },
      },
    ],
    subtotal: 170000,
    fee: 18000,
    discount: 0,
    total: 188000,
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 6. DELIVERED (Past completed order - 2 days ago)
  {
    id: "1006",
    code: "#ORD-1006",
    restaurantId: "103",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7788,
      lng: 106.7025,
      name: "Tokyo Sushi Omakase House",
    },
    driverLocation: {
      lat: 10.7725,
      lng: 106.698,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1006-1",
        name: "Sashimi Cá Hồi Na Uy Thượng Hạng (5 lát)",
        price: 135000,
        quantity: 1,
        restaurantId: "103",
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80",
      },
      {
        id: "item-1006-2",
        name: "Dragon Roll - Cuộn Tôm Chiên & Bơ",
        price: 165000,
        quantity: 1,
        restaurantId: "103",
        imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&q=80",
      },
    ],
    subtotal: 300000,
    fee: 22000,
    discount: 30000,
    total: 292000,
    createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 7. DELIVERED (Past completed order - 4 days ago)
  {
    id: "1007",
    code: "#ORD-1007",
    restaurantId: "108",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.782,
      lng: 106.699,
      name: "Burger Craft & Crispy Chicken",
    },
    driverLocation: {
      lat: 10.7725,
      lng: 106.698,
      name: "Tài xế Trần Văn Bình",
    },
    items: [
      {
        id: "item-1007-1",
        name: "Burger Bò Wagyu Phô Mai Nướng Cheddar",
        price: 145000,
        quantity: 1,
        restaurantId: "108",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      },
      {
        id: "item-1007-2",
        name: "Khoai Tây Chiên Truffle Parmesan",
        price: 45000,
        quantity: 1,
        restaurantId: "108",
        imageUrl: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
      },
      {
        id: "item-1007-3",
        name: "Coca-Cola Zero Lon",
        price: 20000,
        quantity: 1,
        restaurantId: "108",
        imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
      },
    ],
    subtotal: 210000,
    fee: 18000,
    discount: 20000,
    total: 208000,
    createdAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 8. DELIVERED (Past completed order - 6 days ago)
  {
    id: "1008",
    code: "#ORD-1008",
    restaurantId: "106",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7718,
      lng: 106.7044,
      address: "Số 2 Hải Triều, Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    },
    restaurantLocation: {
      lat: 10.7745,
      lng: 106.7021,
      name: "Phúc Long Coffee & Tea",
    },
    driverLocation: {
      lat: 10.7718,
      lng: 106.7044,
      name: "Tài xế Nguyễn Văn An",
    },
    items: [
      {
        id: "item-1008-1",
        name: "Trà Sữa Phúc Long Truyền Thống",
        price: 45000,
        quantity: 3,
        restaurantId: "106",
        imageUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80",
      },
      {
        id: "item-1008-2",
        name: "Bánh Croissant Phô Mai Nướng",
        price: 38000,
        quantity: 2,
        restaurantId: "106",
        imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
      },
    ],
    subtotal: 211000,
    fee: 16000,
    discount: 20000,
    total: 207000,
    createdAt: new Date(Date.now() - 144 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 9. DELIVERED (Past completed order - 9 days ago)
  {
    id: "1009",
    code: "#ORD-1009",
    restaurantId: "105",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.776,
      lng: 106.705,
      name: "Pizza 4P's - Pizza Kiểu Nhật",
    },
    driverLocation: {
      lat: 10.7725,
      lng: 106.698,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1009-1",
        name: "Pizza 4 Loại Phô Mai Kèm Mật Ong Tự Nhiên",
        price: 280000,
        quantity: 1,
        restaurantId: "105",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
      },
      {
        id: "item-1009-2",
        name: "Mì Ý Sốt Cua & Cà Chua Kem Mascarpone",
        price: 220000,
        quantity: 1,
        restaurantId: "105",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=400&q=80",
      },
    ],
    subtotal: 500000,
    fee: 25000,
    discount: 50000,
    total: 475000,
    createdAt: new Date(Date.now() - 216 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 10. DELIVERED (Past completed order - 14 days ago)
  {
    id: "1010",
    code: "#ORD-1010",
    restaurantId: "110",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.768,
      lng: 106.691,
      name: "Bánh Mì Huỳnh Hoa",
    },
    driverLocation: {
      lat: 10.7725,
      lng: 106.698,
      name: "Tài xế Trần Văn Bình",
    },
    items: [
      {
        id: "item-1010-1",
        name: "Bánh Mì Huỳnh Hoa Đặc Biệt Cực Nhiều Patê Chả",
        price: 68000,
        quantity: 2,
        restaurantId: "110",
        imageUrl: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=400&q=80",
      },
      {
        id: "item-1010-2",
        name: "Nước Mía Sầu Riêng Tươi",
        price: 25000,
        quantity: 2,
        restaurantId: "110",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
    ],
    subtotal: 186000,
    fee: 15000,
    discount: 15000,
    total: 186000,
    createdAt: new Date(Date.now() - 336 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 11. CANCELLED (Past order cancelled by restaurant)
  {
    id: "1011",
    code: "#ORD-1011",
    restaurantId: "104",
    status: "CANCELLED",
    cancellationReason: "Quán hết chả nướng than hoa cho ca trưa hôm nay",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.781,
      lng: 106.698,
      name: "Bún Chả Hà Nội Phố Cổ",
    },
    driverLocation: {
      lat: 10.781,
      lng: 106.698,
      name: "Tài xế Nguyễn Văn An",
    },
    items: [
      {
        id: "item-1011-1",
        name: "Bún Chả Hà Nội Đặc Biệt Nem Cua Bể",
        price: 85000,
        quantity: 2,
        restaurantId: "104",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
      },
      {
        id: "item-1011-2",
        name: "Nước Mơ Chùa Hương Chua Ngọt",
        price: 20000,
        quantity: 2,
        restaurantId: "104",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
    ],
    subtotal: 210000,
    fee: 18000,
    discount: 0,
    total: 228000,
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 12. CANCELLED (Past order cancelled by customer)
  {
    id: "1012",
    code: "#ORD-1012",
    restaurantId: "107",
    status: "CANCELLED",
    cancellationReason: "Khách hàng đổi địa chỉ giao hàng và đặt lại đơn mới",
    deliveryLocation: {
      lat: 10.7725,
      lng: 106.698,
      address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.783,
      lng: 106.7,
      name: "Haidilao Hotpot Experience",
    },
    driverLocation: {
      lat: 10.783,
      lng: 106.7,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1012-1",
        name: "Set Lẩu Mini Bò Mỹ Haidilao Nước Lẩu Cà Chua",
        price: 249000,
        quantity: 1,
        restaurantId: "107",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
      },
      {
        id: "item-1012-2",
        name: "Mì Nhúng Haidilao Tươi",
        price: 25000,
        quantity: 2,
        restaurantId: "107",
        imageUrl: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&q=80",
      },
    ],
    subtotal: 299000,
    fee: 25000,
    discount: 30000,
    total: 294000,
    createdAt: new Date(Date.now() - 192 * 3600 * 1000).toISOString(),
    customer: {
      id: 1,
      name: "Nguyễn Văn Nam",
      phoneNumber: "0901234567",
    },
  },

  // 13. PLACED for Restaurant 101 from another customer
  {
    id: "1013",
    code: "#ORD-1013",
    restaurantId: "101",
    status: "PLACED",
    deliveryLocation: {
      lat: 10.7812,
      lng: 106.6954,
      address: "215 Điện Biên Phủ, Phường 15, Bình Thạnh, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7932,
      lng: 106.6719,
      name: "Cơm Tấm Ba Ghiền",
    },
    driverLocation: {
      lat: 10.79,
      lng: 106.675,
      name: "Tài xế Trần Văn Bình",
    },
    items: [
      {
        id: "item-1013-1",
        name: "Cơm Tấm Sườn Bì Chả Đặc Biệt",
        price: 85000,
        quantity: 1,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
      },
      {
        id: "item-1013-2",
        name: "Trà Tắc Mật Ong Hạt Chia",
        price: 20000,
        quantity: 1,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
      },
    ],
    subtotal: 105000,
    fee: 16000,
    discount: 0,
    total: 121000,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    customer: {
      id: 2,
      name: "Trần Thị Bình",
      phoneNumber: "0912345678",
    },
  },

  // 14. DELIVERED for Restaurant 101 from another customer
  {
    id: "1014",
    code: "#ORD-1014",
    restaurantId: "101",
    status: "DELIVERED",
    deliveryLocation: {
      lat: 10.768,
      lng: 106.692,
      address: "12 Cô Bắc, Phường Cầu Ông Lãnh, Quận 1, TP.HCM",
    },
    restaurantLocation: {
      lat: 10.7932,
      lng: 106.6719,
      name: "Cơm Tấm Ba Ghiền",
    },
    driverLocation: {
      lat: 10.768,
      lng: 106.692,
      name: "Tài xế Lê Hoàng Phúc",
    },
    items: [
      {
        id: "item-1014-1",
        name: "Cơm Tấm Sườn Cốt Lết Nướng Khổng Lồ",
        price: 75000,
        quantity: 2,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
      },
      {
        id: "item-1014-2",
        name: "Canh Khổ Qua Nhồi Thịt",
        price: 25000,
        quantity: 2,
        restaurantId: "101",
        imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80",
      },
    ],
    subtotal: 200000,
    fee: 18000,
    discount: 20000,
    total: 198000,
    createdAt: new Date(Date.now() - 25 * 3600 * 1000).toISOString(),
    customer: {
      id: 5,
      name: "Hoàng Lan Anh",
      phoneNumber: "0938123456",
    },
  },
];

/**
 * Generate 30+ simulated historical orders for Super Admin dashboard charts
 */
export function generateAdminMockOrders(): OrderResponse[] {
  const baseOrders: OrderResponse[] = [];
  const statuses = ["DELIVERED", "DELIVERED", "DELIVERED", "CANCELLED", "DELIVERED"];

  // Add mapped real orders first
  MOCK_ORDERS.forEach((o) => {
    baseOrders.push(toOrderResponse(o));
  });

  // Generate 45 additional realistic historical orders across the last 30 days
  for (let i = 1; i <= 45; i++) {
    const daysAgo = Math.floor(i / 1.5);
    const date = new Date(Date.now() - daysAgo * 24 * 3600 * 1000 - (i % 8) * 3600 * 1000);
    const status = statuses[i % statuses.length] || "DELIVERED";
    const subtotal = 75000 + (i % 6) * 35000;
    const fee = 15000 + (i % 3) * 4000;
    const discount = (i % 4 === 0) ? 20000 : 0;
    const total = subtotal + fee - discount;

    baseOrders.push({
      id: 2000 + i,
      orderStatus: status,
      subtotal,
      deliveryFee: fee,
      discountAmount: discount,
      totalAmount: total,
      paymentMethod: i % 2 === 0 ? "EATZYPAY" : "CASH",
      paymentStatus: "PAID",
      deliveryLatitude: 10.77 + (i % 10) * 0.005,
      deliveryLongitude: 106.69 + (i % 10) * 0.005,
      deliveryAddress: `${10 + i} Lê Duẩn, Bến Nghé, Quận 1, TP.HCM`,
      distance: 1.5 + (i % 5) * 0.8,
      driverCommissionAmount: Math.round(fee * 0.8),
      driverNetEarning: Math.round(fee * 0.8),
      createdAt: date.toISOString(),
      restaurant: {
        id: 101 + (i % 5),
        name: i % 2 === 0 ? "Cơm Tấm Ba Ghiền" : "Phở Thìn Lò Đúc",
        address: "Quận 1, TP.HCM",
        latitude: 10.7932,
        longitude: 106.6719,
      },
      customer: {
        id: 1 + (i % 6),
        name: ["Nguyễn Văn Nam", "Trần Thị Bình", "Lê Văn Cường", "Phạm Thị Dung", "Vũ Hoàng"][i % 5] || "Nguyễn Văn Nam",
        phoneNumber: `090${1000000 + i}`,
      },
      driver: {
        id: 3,
        name: "Lê Hoàng Phúc",
        phoneNumber: "0923456789",
        latitude: 10.785,
        longitude: 106.685,
      },
      orderItems: [
        {
          id: 3000 + i,
          quantity: 1 + (i % 3),
          priceAtPurchase: 75000,
          dish: {
            id: 101,
            name: "Món Ăn Ngon Eatzy",
            price: 75000,
          },
        },
      ],
    });
  }

  return baseOrders;
}

/**
 * Adapter from Order to OrderResponse
 */
export function toOrderResponse(order: Order): OrderResponse {
  const rest = MOCK_RESTAURANTS.find((r) => String(r.id) === String(order.restaurantId));

  let apiStatus: string = order.status;
  if (order.status === "PREPARED") apiStatus = "PREPARING";
  else if (order.status === "PICKED") apiStatus = "READY";

  const isCancelled = apiStatus === "CANCELLED" || apiStatus === "REJECTED";

  return {
    id: Number(order.id),
    orderStatus: apiStatus,
    subtotal: order.subtotal,
    deliveryFee: order.fee,
    discountAmount: order.discount,
    totalAmount: order.total,
    paymentMethod: "EATZYPAY",
    paymentStatus: isCancelled ? "REFUNDED" : "PAID",
    cancellationReason: order.cancellationReason,
    deliveryLatitude: order.deliveryLocation.lat,
    deliveryLongitude: order.deliveryLocation.lng,
    deliveryAddress: order.deliveryLocation.address || "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    distance: 2.4,
    driverCommissionAmount: Math.round(order.fee * 0.8),
    driverNetEarning: Math.round(order.fee * 0.8),
    createdAt: order.createdAt || new Date().toISOString(),
    restaurant: {
      id: Number(order.restaurantId),
      name: order.restaurantLocation.name || rest?.name || "Quán Ăn Eatzy",
      slug: rest?.slug || "quan-an-eatzy",
      address: rest?.address || "TP. Hồ Chí Minh",
      latitude: order.restaurantLocation.lat,
      longitude: order.restaurantLocation.lng,
      imageUrl: rest?.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
      averageRating: rest?.rating || 4.8,
    },
    customer: {
      id: order.customer?.id || 1,
      name: order.customer?.name || "Nguyễn Văn Nam",
      phoneNumber: order.customer?.phoneNumber || "0901234567",
    },
    driver: {
      id: 3,
      name: order.driverLocation.name || "Tài xế Lê Hoàng Phúc",
      phoneNumber: "0923456789",
      latitude: order.driverLocation.lat,
      longitude: order.driverLocation.lng,
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
      averageRating: "4.95",
      completedTrips: "1,240",
      vehicleLicensePlate: "59-P1 888.88",
      vehicleType: "Honda Air Blade 160",
    },
    orderItems: (order.items || []).map((item, index) => {
      const optionsList = [
        ...(item.options?.addons?.map((a, aIdx) => ({
          id: Number(a.id.replace(/\D/g, "")) || 900 + aIdx,
          menuOption: {
            id: Number(a.id.replace(/\D/g, "")) || 900 + aIdx,
            name: a.name,
            priceAdjustment: a.price,
          },
        })) || []),
        ...(item.options?.variant
          ? [
              {
                id: Number(item.options.variant.id.replace(/\D/g, "")) || 999,
                menuOption: {
                  id: Number(item.options.variant.id.replace(/\D/g, "")) || 999,
                  name: item.options.variant.name,
                  priceAdjustment: item.options.variant.price,
                },
              },
            ]
          : []),
      ];

      return {
        id: Number(item.id.replace(/\D/g, "")) || 5000 + index,
        quantity: item.quantity,
        priceAtPurchase: item.price,
        dish: {
          id: Number(item.id.replace(/\D/g, "")) || 100,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
        },
        orderItemOptions: optionsList.length > 0 ? optionsList : undefined,
      };
    }),
  };
}

/**
 * Driver Order Offer for the Driver App popup
 */
export const MOCK_DRIVER_OFFER: DriverOrderOffer = {
  id: "1001",
  netEarning: 32000,
  orderValue: 246000,
  paymentMethod: "EATZYPAY" as PaymentMethod,
  distanceKm: 2.4,
  pickup: {
    name: "Cơm Tấm Ba Ghiền",
    address: "84 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP.HCM",
    lat: 10.7932,
    lng: 106.6719,
  },
  dropoff: {
    name: "Nguyễn Văn Nam",
    address: "85 Nguyễn Huệ, Bến Nghé, Quận 1, TP.HCM",
    lat: 10.7725,
    lng: 106.698,
  },
  expireSeconds: 30,
};

/**
 * Driver Active Delivery Order
 */
export const MOCK_DRIVER_ACTIVE_ORDER: DriverActiveOrder = {
  id: "1003",
  phase: "PICKUP",
  orderStatus: "DRIVER_ASSIGNED",
  pickup: {
    name: "Cơm Tấm Ba Ghiền",
    address: "84 Đặng Văn Ngữ, Phường 10, Phú Nhuận, TP.HCM",
    lat: 10.7932,
    lng: 106.6719,
  },
  dropoff: {
    name: "Đặng Minh Quân",
    address: "12 Cô Bắc, Phường Cầu Ông Lãnh, Quận 1, TP.HCM",
    lat: 10.768,
    lng: 106.692,
  },
  driverLocation: {
    lat: 10.785,
    lng: 106.685,
  },
  customer: {
    id: 6,
    name: "Đặng Minh Quân",
    phoneNumber: "0918765432",
  },
  earnings: {
    orderId: "1003",
    driverId: "3",
    orderSubtotal: 255000,
    deliveryFee: 18000,
    driverCommissionRate: 80,
    driverCommissionAmount: 14400,
    driverNetEarning: 32400,
  },
  paymentMethod: "EATZYPAY" as PaymentMethod,
  distanceKm: 3.2,
};
