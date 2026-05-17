export interface ChatMessageDTO {
  orderId: number;
  senderId?: number;
  recipientId?: number;
  senderName?: string;
  senderType?: "DRIVER" | "CUSTOMER";
  message: string;
  timestamp?: string;
  messageType?: "TEXT" | "IMAGE" | "LOCATION";
}
