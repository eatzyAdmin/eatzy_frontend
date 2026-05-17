"use client";
import { useEffect, useCallback } from "react";
import { useSocket } from "../SocketProvider";

export interface ChatMessageNotification {
  type: string;
  recipientEmail: string;
  message: string;
  timestamp: string;
  orderId: number;
  senderId: number;
  senderName: string;
  senderType: "DRIVER" | "CUSTOMER";
}

/**
 * Hook to manage real-time WebSocket messaging for a specific order chat session.
 * Handles subcribing to the chat destination and sending messages/typing indicators.
 * 
 * @param orderId ID of the active order
 * @param onMessageReceived Callback triggered when a new message is received
 * @param onTypingReceived Optional callback triggered when typing indicator updates
 */
export function useOrderChat(
  orderId: number | null,
  onMessageReceived: (msg: ChatMessageNotification) => void,
  onTypingReceived?: (senderType: "DRIVER" | "CUSTOMER", isTyping: boolean) => void
) {
  const { connected, subscribe, unsubscribe, publish } = useSocket();

  useEffect(() => {
    if (!connected || !orderId) return;

    const chatDestination = `/user/queue/chat/order/${orderId}`;
    const typingDestination = `/user/queue/chat/order/${orderId}/typing`;

    // Subscribe to incoming chat messages
    subscribe(chatDestination, (data: any) => {
      onMessageReceived(data as ChatMessageNotification);
    });

    // Subscribe to incoming typing indicators
    if (onTypingReceived) {
      subscribe(typingDestination, (data: any) => {
        const isTyping = data.message === "TYPING";
        onTypingReceived(data.senderType, isTyping);
      });
    }

    return () => {
      unsubscribe(chatDestination);
      if (onTypingReceived) {
        unsubscribe(typingDestination);
      }
    };
  }, [connected, orderId, subscribe, unsubscribe, onMessageReceived, onTypingReceived]);

  const sendMessage = useCallback((text: string) => {
    if (!connected || !orderId) return false;
    publish(`/app/chat/${orderId}`, {
      message: text,
      messageType: "TEXT"
    });
    return true;
  }, [connected, orderId, publish]);

  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (!connected || !orderId) return false;
    publish(`/app/typing/${orderId}`, {
      message: isTyping ? "TYPING" : "STOPPED"
    });
    return true;
  }, [connected, orderId, publish]);

  return {
    connected,
    sendMessage,
    sendTypingStatus
  };
}
