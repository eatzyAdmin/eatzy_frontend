import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";

export function useOrderChatCount(orderId?: string | number, hasActiveOrder?: boolean) {
  const [msgCount, setMsgCount] = useState<number>(0);
  const { connected, subscribe, unsubscribe } = useSocket();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  const numericId = orderId ? (typeof orderId === 'string' ? parseInt(orderId, 10) : orderId) : null;

  useEffect(() => {
    if (hasActiveOrder && numericId && !isNaN(numericId)) {
      chatApi.getMessageCount(numericId)
        .then(res => {
          if (res.statusCode === 200 && typeof res.data === 'number') {
            setMsgCount(res.data);
          }
        })
        .catch(err => console.error("Error loading chat message count:", err));
    } else {
      setMsgCount(0);
    }
  }, [numericId, hasActiveOrder]);

  useEffect(() => {
    if (!connected || !hasActiveOrder || !numericId || isNaN(numericId)) return;

    const destination = `/user/queue/chat/order/${numericId}`;

    subscribe(destination, (data: any) => {
      // Increment real-time count when customer sends a message
      if (data && data.senderType === "CUSTOMER") {
        const isViewingThisChat = isMessagesPage && orderIdParam === numericId.toString();
        if (!isViewingThisChat) {
          setMsgCount(prev => prev + 1);
        }
      }
    });

    return () => {
      unsubscribe(destination);
    };
  }, [connected, numericId, hasActiveOrder, subscribe, unsubscribe, isMessagesPage, orderIdParam]);

  // Reset count when viewing this chat room
  useEffect(() => {
    const isViewingThisChat = isMessagesPage && orderIdParam === numericId?.toString();
    if (isViewingThisChat) {
      setMsgCount(0);
    }
  }, [isMessagesPage, orderIdParam, numericId]);

  return { msgCount };
}
