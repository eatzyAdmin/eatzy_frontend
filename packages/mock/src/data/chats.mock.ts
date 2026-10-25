import type { ChatMessageDTO } from "@repo/types";

export interface MockChatSession {
  sessionId: string;
  orderId: number;
  partnerName: string;
  partnerAvatar: string;
  partnerRole: "DRIVER" | "CUSTOMER" | "RESTAURANT";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessageDTO[];
}

export const MOCK_CHAT_SESSIONS: MockChatSession[] = [
  {
    sessionId: "chat-order-1003",
    orderId: 1003,
    partnerName: "Tài xế Lê Hoàng Phúc",
    partnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    partnerRole: "DRIVER",
    lastMessage: "Dạ em đã nhận món từ quán, đang trên đường giao đến bạn nhé!",
    lastMessageTime: "5 phút trước",
    unreadCount: 1,
    messages: [
      {
        orderId: 1003,
        senderId: 1,
        senderName: "Nguyễn Văn Nam",
        senderType: "CUSTOMER",
        message: "Chào anh tài xế, quán đã làm xong món chưa ạ?",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
      {
        orderId: 1003,
        senderId: 3,
        senderName: "Lê Hoàng Phúc",
        senderType: "DRIVER",
        message: "Dạ em vừa tới quán, quán đang đóng gói món ạ.",
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
      {
        orderId: 1003,
        senderId: 3,
        senderName: "Lê Hoàng Phúc",
        senderType: "DRIVER",
        message: "Dạ em đã nhận món từ quán, đang trên đường giao đến bạn nhé!",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
    ],
  },
  {
    sessionId: "chat-order-1001",
    orderId: 1001,
    partnerName: "Cơm Tấm Ba Ghiền",
    partnerAvatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    partnerRole: "RESTAURANT",
    lastMessage: "Quán đang nướng sườn nóng giòn cho bạn nhé!",
    lastMessageTime: "15 phút trước",
    unreadCount: 0,
    messages: [
      {
        orderId: 1001,
        senderId: 1,
        senderName: "Nguyễn Văn Nam",
        senderType: "CUSTOMER",
        message: "Quán cho mình xin thêm 1 chén nước mắm ớt cay nhé!",
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
      {
        orderId: 1001,
        senderId: 2,
        senderName: "Cơm Tấm Ba Ghiền",
        senderType: "CUSTOMER", // partner role
        message: "Dạ quán đã ghi chú cho bạn rồi ạ. Quán đang nướng sườn nóng giòn cho bạn nhé!",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
    ],
  },
  {
    sessionId: "chat-order-1002",
    orderId: 1002,
    partnerName: "Tài xế Trần Văn Bình",
    partnerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    partnerRole: "DRIVER",
    lastMessage: "Dạ em đã đến quán Phở Thìn rồi ạ, quán đang chuẩn bị nước dùng nóng cho mình nhé!",
    lastMessageTime: "2 phút trước",
    unreadCount: 1,
    messages: [
      {
        orderId: 1002,
        senderId: 5,
        senderName: "Trần Văn Bình",
        senderType: "DRIVER",
        message: "Chào bạn Nam, em nhận đơn phở Thìn của mình rồi ạ.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
      {
        orderId: 1002,
        senderId: 5,
        senderName: "Trần Văn Bình",
        senderType: "DRIVER",
        message: "Dạ em đã đến quán Phở Thìn rồi ạ, quán đang chuẩn bị nước dùng nóng cho mình nhé!",
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        messageType: "TEXT",
      },
    ],
  },
];
