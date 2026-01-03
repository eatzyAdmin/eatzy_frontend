export interface OrderHistoryItem {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'vnpay' | 'wallet';
  status: 'completed' | 'cancelled' | 'refunded';
  itemsCount: number;
  items: { name: string; quantity: number; price: number }[];
  deliveryFee: number;
  discount: number;
  voucherCode?: string;
  platformFee: number;
  netIncome: number;
  customerAvatar?: string;
  restaurantName?: string;
  driverName?: string;
  driver?: {
    name: string;
    phone: string;
    vehicleType: string;
    licensePlate: string;
    rating: number;
    totalTrips: number;
    avatar: string;
  };
  reviewRating?: number;
  pickupAddress?: string;
  deliveryAddress?: string;
}

const DRIVER_NAMES = ['Nguyễn Văn A', 'Trần Văn B', 'Lê Thị C', 'Phạm Văn D'];
const VEHICLES = ['Honda Wave', 'Yamaha Exciter', 'Honda Vision', 'Air Blade'];

export const mockOrderHistory: OrderHistoryItem[] = Array.from({ length: 50 }).map((_, i) => {
  const statusProb = Math.random();
  const status = statusProb > 0.2 ? 'completed' : statusProb > 0.1 ? 'cancelled' : 'refunded';

  const items = Array.from({ length: Math.floor(Math.random() * 5) + 1 }).map(() => ({
    name: ['Phở Bò', 'Cơm Tấm', 'Bún Chả', 'Gà Rán', 'Trà Sữa', 'Bánh Mì', 'Gỏi Cuốn'][Math.floor(Math.random() * 7)],
    quantity: Math.floor(Math.random() * 3) + 1,
    price: Math.floor(Math.random() * 10000) * 5 + 15000
  }));

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const deliveryFee = 15000;
  const discount = Math.random() > 0.7 ? 10000 : 0;
  const voucherCode = discount > 0 ? 'EATZY10K' : undefined;
  const platformFee = Math.round(subtotal * 0.15); // 15% commission
  const netIncome = subtotal - platformFee;
  const totalAmount = subtotal + deliveryFee - discount;

  return {
    id: `ORD-${2024000 + i}`,
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    customerName: ['Nguyen Van A', 'Tran Thi B', 'Le Van C', 'Pham Thi D', 'Hoang Van E'][Math.floor(Math.random() * 5)],
    customerAvatar: `https://i.pravatar.cc/150?u=${i + 50}`,
    customerPhone: '0987654321',
    deliveryFee,
    discount,
    voucherCode,
    platformFee,
    netIncome,
    totalAmount,
    paymentMethod: Math.random() > 0.5 ? 'vnpay' : 'cash',
    status: status as 'completed' | 'cancelled' | 'refunded',
    itemsCount: items.length,
    items,
    driverName: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
    driver: {
      name: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
      phone: '0901234567',
      vehicleType: VEHICLES[Math.floor(Math.random() * VEHICLES.length)],
      licensePlate: `59-${Math.floor(Math.random() * 9)}23.45`,
      rating: 4.5 + Math.random() * 0.5,
      totalTrips: Math.floor(Math.random() * 5000) + 100,
      avatar: `https://i.pravatar.cc/150?u=${i}`
    },
    reviewRating: status === 'completed' ? (Math.random() > 0.7 ? 5 : 4) : undefined,
    restaurantName: 'Eatzy Restaurant',
    pickupAddress: '123 Food Street, District 1, HCMC',
    deliveryAddress: `${Math.floor(Math.random() * 100)} Nguyen Hue Street, District ${Math.floor(Math.random() * 10) + 1}, HCMC`,
  };
});
