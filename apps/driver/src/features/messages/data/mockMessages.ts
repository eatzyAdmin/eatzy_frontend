
export type MessageType = 'system' | 'driver';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  orderCard?: {
    orderId: string;
    restaurantName: string;
    restaurantImage?: string;
    status: string;
    total: number;
    itemCount: number;
    dishNames?: string;
  };
}

export interface ChatSession {
  id: string;
  type: MessageType;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
  isVerified?: boolean;
}

export const mockSystemChats: ChatSession[] = [
  {
    id: 'sys_1',
    type: 'system',
    partnerId: 'eatzy_system',
    partnerName: 'Eatzy System',
    partnerAvatar: '/assets/logo/eatzy-logo.png',
    lastMessage: 'Your order #EAT-8829 has been delivered successfully. Enjoy your meal!',
    lastMessageTime: '10:30 AM',
    unreadCount: 1,
    isVerified: true,
    messages: [
      {
        id: 'm1',
        senderId: 'eatzy_system',
        text: 'Welcome to Eatzy! We are glad to have you here.',
        timestamp: '2026-05-10T08:00:00Z',
        isMe: false,
      },
      {
        id: 'm3',
        senderId: 'eatzy_system',
        text: 'Your order #EAT-8829 from "Phở Hòa" has been confirmed and is being prepared.',
        timestamp: '2026-05-13T09:45:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-8829',
          restaurantName: 'Phở Hòa Pasteur',
          restaurantImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=400',
          status: 'PREPARING',
          total: 85000,
          itemCount: 1,
          dishNames: 'Phở Tái Nạm'
        }
      },
      {
        id: 'm4',
        senderId: 'eatzy_system',
        text: 'Your order #EAT-8829 has been delivered successfully. Enjoy your meal!',
        timestamp: '2026-05-13T10:30:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-8829',
          restaurantName: 'Phở Hòa Pasteur',
          restaurantImage: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=400',
          status: 'DELIVERED',
          total: 85000,
          itemCount: 1,
          dishNames: 'Phở Tái Nạm'
        }
      }
    ]
  },
  {
    id: 'sys_2',
    type: 'system',
    partnerId: 'eatzy_promos',
    partnerName: 'Eatzy Promotions',
    partnerAvatar: '/assets/logo/eatzy-logo.png',
    lastMessage: 'Get 50% off on your next order with code EATZY50!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isVerified: true,
    messages: [
      {
        id: 'p1',
        senderId: 'eatzy_promos',
        text: 'Get 50% off on your next order with code EATZY50! Valid until Sunday.',
        timestamp: '2026-05-12T14:00:00Z',
        isMe: false,
      }
    ]
  }
];

export const mockDriverChats: ChatSession[] = [
  {
    id: 'drv_1',
    type: 'driver',
    partnerId: 'driver_889',
    partnerName: 'Nguyen Van A',
    partnerAvatar: 'https://i.pravatar.cc/150?u=driver1',
    lastMessage: 'I have arrived at the destination.',
    lastMessageTime: '11:45 AM',
    unreadCount: 2,
    messages: [
      {
        id: 'd1_0',
        senderId: 'system_auto',
        text: 'Your order #EAT-9912 is being prepared.',
        timestamp: '2026-05-13T11:00:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-9912',
          restaurantName: 'Bún Bò Huế Oanh',
          restaurantImage: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=400',
          status: 'PREPARING',
          total: 125000,
          itemCount: 2,
          dishNames: 'Bún Bò Huế Đặc Biệt, Trà Đá'
        }
      },
      {
        id: 'd1_1',
        senderId: 'system_auto',
        text: 'Driver has picked up your order.',
        timestamp: '2026-05-13T11:20:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-9912',
          restaurantName: 'Bún Bò Huế Oanh',
          restaurantImage: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=400',
          status: 'PICKED_UP',
          total: 125000,
          itemCount: 2,
          dishNames: 'Bún Bò Huế Đặc Biệt, Trà Đá'
        }
      },
      {
        id: 'd1_2',
        senderId: 'driver_889',
        text: 'Hello, I am on my way to deliver your order.',
        timestamp: '2026-05-13T11:22:00Z',
        isMe: false,
      },
      {
        id: 'd1_3',
        senderId: 'customer',
        text: 'Okay, please call me when you arrive.',
        timestamp: '2026-05-13T11:25:00Z',
        isMe: true,
      },
      {
        id: 'd1_4',
        senderId: 'driver_889',
        text: 'Sure, I will be there in about 10 minutes.',
        timestamp: '2026-05-13T11:26:00Z',
        isMe: false,
      },
      {
        id: 'd1_5',
        senderId: 'driver_889',
        text: 'I have arrived at the destination.',
        timestamp: '2026-05-13T11:45:00Z',
        isMe: false,
      },
      {
        id: 'd1_6',
        senderId: 'system_auto',
        text: 'Order #EAT-9912 delivered successfully.',
        timestamp: '2026-05-13T11:50:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-9912',
          restaurantName: 'Bún Bò Huế Oanh',
          restaurantImage: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?q=80&w=400',
          status: 'DELIVERED',
          total: 125000,
          itemCount: 2,
          dishNames: 'Bún Bò Huế Đặc Biệt, Trà Đá'
        }
      },
    ]
  },
  {
    id: 'drv_2',
    type: 'driver',
    partnerId: 'driver_552',
    partnerName: 'Tran Thi B',
    partnerAvatar: 'https://i.pravatar.cc/150?u=driver2',
    lastMessage: 'Thank you!',
    lastMessageTime: 'May 11',
    unreadCount: 0,
    messages: [
      {
        id: 'd2_1',
        senderId: 'system_auto',
        text: 'Driver has picked up your order.',
        timestamp: '2026-05-11T18:30:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-4451',
          restaurantName: 'KFC - Tran Hung Dao',
          restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
          status: 'PICKED_UP',
          total: 250000,
          itemCount: 4,
          dishNames: 'Zinger Combo, Popcorn Chicken'
        }
      },
      {
        id: 'd2_2',
        senderId: 'driver_552',
        text: 'I am here.',
        timestamp: '2026-05-11T18:45:00Z',
        isMe: false,
      },
      {
        id: 'd2_4',
        senderId: 'system_auto',
        text: 'Order has been delivered successfully.',
        timestamp: '2026-05-11T18:50:00Z',
        isMe: false,
        orderCard: {
          orderId: 'EAT-4451',
          restaurantName: 'KFC - Tran Hung Dao',
          restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400',
          status: 'DELIVERED',
          total: 250000,
          itemCount: 4,
          dishNames: 'Zinger Combo, Popcorn Chicken'
        }
      },
    ]
  }
];

export const getTotalUnreadMessages = () => {
  const systemUnread = mockSystemChats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
  const driverUnread = mockDriverChats.reduce((acc, chat) => acc + (chat.unreadCount || 0), 0);
  return systemUnread + driverUnread;
};
