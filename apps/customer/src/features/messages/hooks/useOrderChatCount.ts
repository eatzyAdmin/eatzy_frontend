import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";

export function useOrderChatCount(orderId?: number, hasDriver?: boolean) {
  const [msgCount, setMsgCount] = useState<number>(0);
  const { connected, subscribe, unsubscribe } = useSocket();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  useEffect(() => {
    if (hasDriver && orderId) {
      chatApi.getMessageCount(orderId)
        .then(res => {
          if (res.statusCode === 200 && typeof res.data === 'number') {
            setMsgCount(res.data);
          }
        })
        .catch(err => console.error("Error loading chat message count:", err));
    } else {
      setMsgCount(0);
    }
  }, [orderId, hasDriver]);

  useEffect(() => {
    if (!connected || !hasDriver || !orderId) return;

    const destination = `/user/queue/chat/order/${orderId}`;

    subscribe(destination, (data: any) => {
      // Increment real-time count when driver sends a message
      if (data && data.senderType === "DRIVER") {
        const isViewingThisChat = isMessagesPage && orderIdParam === orderId.toString();
        if (!isViewingThisChat) {
          setMsgCount(prev => prev + 1);
        }
      }
    });

    return () => {
      unsubscribe(destination);
    };
  }, [connected, orderId, hasDriver, subscribe, unsubscribe, isMessagesPage, orderIdParam]);

  // Reset count when viewing this chat room
  useEffect(() => {
    const isViewingThisChat = isMessagesPage && orderIdParam === orderId?.toString();
    if (isViewingThisChat) {
      setMsgCount(0);
    }
  }, [isMessagesPage, orderIdParam, orderId]);

  return { msgCount };
}
