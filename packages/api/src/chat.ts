import { http } from "./http";
import { IBackendRes, ChatMessageDTO } from "../../types/src";

export const chatApi = {
  // Fetch message history for an order
  getOrderChatHistory: (orderId: number, page = 0, size = 50) => {
    return http.get<IBackendRes<ChatMessageDTO[]>>(`/api/v1/chat/order/${orderId}`, {
      params: { page, size }
    }) as unknown as Promise<IBackendRes<ChatMessageDTO[]>>;
  },

  // Fetch count of messages for an order
  getMessageCount: (orderId: number) => {
    return http.get<IBackendRes<number>>(`/api/v1/chat/order/${orderId}/count`) as unknown as Promise<IBackendRes<number>>;
  },

  // Fetch unread count for an order chat
  getUnreadCount: (orderId: number, userId: number) => {
    return http.get<IBackendRes<number>>(`/api/v1/chat/order/${orderId}/unread`, {
      params: { userId }
    }) as unknown as Promise<IBackendRes<number>>;
  },

  // Mark all messages as read for an order chat
  markAsRead: (orderId: number, userId: number) => {
    return http.put<IBackendRes<void>>(`/api/v1/chat/order/${orderId}/read`, null, {
      params: { userId }
    }) as unknown as Promise<IBackendRes<void>>;
  }
};
