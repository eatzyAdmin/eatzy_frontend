import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useOrderChatCount(orderId?: string | number, hasActiveOrder?: boolean) {
  const [msgCount, setMsgCount] = useState<number>(0);
  const { user } = useAuth();
  const { connected, subscribe, unsubscribe } = useSocket();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  const numericId = orderId ? (typeof orderId === 'string' ? parseInt(orderId, 10) : orderId) : null;

  useEffect(() => {
    if (hasActiveOrder && numericId && !isNaN(numericId) && user?.id) {
      chatApi.getUnreadCount(numericId, user.id)
        .then(res => {
          if (res.statusCode === 200 && typeof res.data === 'number') {
            const isViewingThisChat = isMessagesPage && orderIdParam === numericId.toString();
            setMsgCount(isViewingThisChat ? 0 : res.data);
          }
        })
        .catch(err => console.error("Error loading chat message count:", err));
    } else {
      setMsgCount(0);
    }
  }, [numericId, hasActiveOrder, user?.id, isMessagesPage, orderIdParam]);

  useEffect(() => {
    if (!connected || !hasActiveOrder || !numericId || isNaN(numericId) || !user?.id) return;

    const destination = `/user/queue/chat/order/${numericId}`;

    subscribe(destination, (data: any) => {
      // Increment real-time count when customer sends a message
      if (data && data.senderType === "CUSTOMER") {
        const isViewingThisChat = isMessagesPage && orderIdParam === numericId.toString();
        if (!isViewingThisChat) {
          setMsgCount(prev => prev + 1);
        } else {
          chatApi.markAsRead(numericId, user.id).catch(err => console.error("Error marking messages as read:", err));
        }
      }
    });

    return () => {
      unsubscribe(destination);
    };
  }, [connected, numericId, hasActiveOrder, subscribe, unsubscribe, isMessagesPage, orderIdParam, user?.id]);

  // Reset count and call markAsRead when viewing this chat room
  useEffect(() => {
    const isViewingThisChat = isMessagesPage && orderIdParam === numericId?.toString();
    if (isViewingThisChat && numericId && user?.id) {
      chatApi.markAsRead(numericId, user.id)
        .then(() => {
          setMsgCount(0);
        })
        .catch(err => console.error("Error marking messages as read:", err));
    }
  }, [isMessagesPage, orderIdParam, numericId, user?.id]);

  return { msgCount };
}
