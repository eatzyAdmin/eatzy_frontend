import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useOrderChatCount(orderId?: number, hasDriver?: boolean) {
  const [msgCount, setMsgCount] = useState<number>(0);
  const { user } = useAuth();
  const { connected, subscribe, unsubscribe } = useSocket();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  useEffect(() => {
    if (hasDriver && orderId && user?.id) {
      chatApi.getUnreadCount(orderId, user.id)
        .then(res => {
          if (res.statusCode === 200 && typeof res.data === 'number') {
            const isViewingThisChat = isMessagesPage && orderIdParam === orderId.toString();
            setMsgCount(isViewingThisChat ? 0 : res.data);
          }
        })
        .catch(err => console.error("Error loading chat message count:", err));
    } else {
      setMsgCount(0);
    }
  }, [orderId, hasDriver, user?.id, isMessagesPage, orderIdParam]);

  useEffect(() => {
    if (!connected || !hasDriver || !orderId || !user?.id) return;

    const destination = `/user/queue/chat/order/${orderId}`;

    subscribe(destination, (data: any) => {
      // Increment real-time count when driver sends a message
      if (data && data.senderType === "DRIVER") {
        const isViewingThisChat = isMessagesPage && orderIdParam === orderId.toString();
        if (!isViewingThisChat) {
          setMsgCount(prev => prev + 1);
        } else {
          chatApi.markAsRead(orderId, user.id).catch(err => console.error("Error marking messages as read:", err));
        }
      }
    });

    return () => {
      unsubscribe(destination);
    };
  }, [connected, orderId, hasDriver, subscribe, unsubscribe, isMessagesPage, orderIdParam, user?.id]);

  // Reset count and call markAsRead when viewing this chat room
  useEffect(() => {
    const isViewingThisChat = isMessagesPage && orderIdParam === orderId?.toString();
    if (isViewingThisChat && orderId && user?.id) {
      chatApi.markAsRead(orderId, user.id)
        .then(() => {
          setMsgCount(0);
        })
        .catch(err => console.error("Error marking messages as read:", err));
    }
  }, [isMessagesPage, orderIdParam, orderId, user?.id]);

  // Listen to custom event when messages are marked as read
  useEffect(() => {
    const handleMarkedAsRead = (e: Event) => {
      const customEvent = e as CustomEvent<{ orderId: number }>;
      const readOrderId = customEvent.detail?.orderId;
      if (readOrderId && readOrderId === orderId) {
        setMsgCount(0);
      }
    };

    window.addEventListener("messagesMarkedAsRead", handleMarkedAsRead);
    return () => {
      window.removeEventListener("messagesMarkedAsRead", handleMarkedAsRead);
    };
  }, [orderId]);

  return { msgCount };
}
