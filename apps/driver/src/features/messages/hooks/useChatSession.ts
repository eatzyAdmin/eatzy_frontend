import { useState, useEffect, useCallback, useMemo } from 'react';
import { chatApi, orderApi } from '@repo/api';
import { useOrderChat } from '@repo/socket';
import { ChatMessage } from '../data/mockMessages';

interface UseChatSessionProps {
  chatId: string;
  initialMessages: ChatMessage[];
  isDriverApp?: boolean;
}

export function useChatSession({ chatId, initialMessages, isDriverApp = true }: UseChatSessionProps) {
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [stickyOrder, setStickyOrder] = useState<any>(null);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRetryTrigger(prev => prev + 1);
  }, []);

  // Parse real orderId from chatId
  const orderId = useMemo(() => {
    if (!chatId) return null;
    if (chatId.startsWith("order_")) {
      return parseInt(chatId.replace("order_", ""), 10);
    }
    const num = Number(chatId);
    if (!isNaN(num)) {
      return num;
    }
    return null;
  }, [chatId]);

  // Load message history & order context from API if active order
  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      setIsError(false);

      // Fetch order details to populate header card if needed (independent)
      orderApi.getOrderById(orderId)
        .then(res => {
          if (res.statusCode === 200 && res.data) {
            const ord = res.data;
            const card = {
              orderId: ord.id.toString(),
              restaurantName: ord.restaurant.name,
              restaurantImage: ord.restaurant.imageUrl,
              status: ord.orderStatus,
              total: ord.totalAmount,
              itemCount: ord.orderItems.reduce((acc: number, item: any) => acc + item.quantity, 0),
              dishNames: ord.orderItems.map((item: any) => item.dish.name).join(", ")
            };
            setStickyOrder(card);
          }
        })
        .catch(err => {
          console.error("Error fetching order context:", err);
        });

      // Fetch chat history
      chatApi.getOrderChatHistory(orderId)
        .then(res => {
          if (res.statusCode === 200 && res.data) {
            const fetched = res.data.map((m: any, idx: number) => ({
              id: m.id?.toString() || `msg-${m.timestamp || ''}-${idx}`,
              senderId: isDriverApp 
                ? (m.senderType === "CUSTOMER" ? "customer" : "me")
                : (m.senderType === "DRIVER" ? "driver" : "me"),
              text: m.message,
              timestamp: m.timestamp || new Date().toISOString(),
              isMe: isDriverApp ? (m.senderType === "DRIVER") : (m.senderType === "CUSTOMER")
            }));
            setLocalMessages(fetched);
          }
        })
        .catch(err => {
          console.error("Error loading chat history:", err);
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setLocalMessages([]);
      setIsLoading(false);
      setStickyOrder(null);
      setIsError(false);
    }
  }, [chatId, orderId, isDriverApp, retryTrigger]);

  // Setup WebSocket connection
  const onMessageReceived = useCallback((newMsg: any) => {
    const mappedMsg: ChatMessage = {
      id: `socket-${Date.now()}-${Math.random()}`,
      senderId: isDriverApp
        ? (newMsg.senderType === "CUSTOMER" ? "customer" : "me")
        : (newMsg.senderType === "DRIVER" ? "driver" : "me"),
      text: newMsg.message,
      timestamp: newMsg.timestamp || new Date().toISOString(),
      isMe: isDriverApp ? (newMsg.senderType === "DRIVER") : (newMsg.senderType === "CUSTOMER")
    };

    setLocalMessages(prev => {
      // Prevent duplicate messages
      const exists = prev.some(m => 
        m.text === mappedMsg.text && 
        Math.abs(new Date(m.timestamp).getTime() - new Date(mappedMsg.timestamp).getTime()) < 3000
      );
      if (exists) return prev;
      return [...prev, mappedMsg];
    });
  }, [isDriverApp]);

  const { sendMessage, sendTypingStatus } = useOrderChat(orderId, onMessageReceived);

  // Send message action with optimistic update
  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const newMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text,
      senderId: 'me',
      isMe: true,
      timestamp: new Date().toISOString(),
    };

    // Optimistically add to list
    setLocalMessages(prev => [...prev, { ...newMessage, status: 'sending' } as any]);

    if (orderId) {
      const success = sendMessage(text);
      if (success) {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent("messageSent", {
            detail: { orderId, text, timestamp: newMessage.timestamp }
          }));
        }
        setTimeout(() => {
          setLocalMessages(prev => prev.map(m =>
            m.id === newMessage.id ? { ...m, status: 'sent' } as any : m
          ));
        }, 300);
      } else {
        setLocalMessages(prev => prev.map(m =>
          m.id === newMessage.id ? { ...m, status: 'failed' } as any : m
        ));
      }
    } else {
      console.warn("Cannot send message: no active orderId.");
    }
  }, [orderId, sendMessage]);

  return {
    localMessages,
    isLoading,
    isError,
    stickyOrder,
    sendMessage: handleSendMessage,
    sendTypingStatus,
    orderId,
    refetch
  };
}
