import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useUnreadMessageCount() {
  const { orders } = useCurrentOrders();
  const { user } = useAuth();
  const { connected, subscribe, unsubscribe } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  const ordersKey = orders.map(ord => `${ord.id}_${ord.driver?.id || ""}`).join(",");

  // Fetch initial counts from API using the new getUnreadCount endpoint
  useEffect(() => {
    const fetchCounts = async () => {
      if (!user?.id) return;
      let total = 0;
      const counts: Record<string, number> = {};

      const promises = orders
        .filter(ord => ord.driver && ord.id)
        .map(async (ord) => {
          try {
            const res = await chatApi.getUnreadCount(ord.id, user.id);
            if (res.statusCode === 200 && typeof res.data === 'number') {
              const isViewingThisChat = isMessagesPage && orderIdParam === ord.id.toString();
              const countVal = isViewingThisChat ? 0 : res.data;
              total += countVal;
              counts[`order_${ord.id}`] = countVal;
            }
          } catch (e) {
            console.error("Error loading unread messages count:", e);
          }
        });
      await Promise.all(promises);
      setUnreadCount(total);
      setUnreadCounts(counts);
    };

    if (orders.length > 0 && user?.id) {
      fetchCounts();
    } else {
      setUnreadCount(0);
      setUnreadCounts({});
    }
  }, [ordersKey, user?.id, isMessagesPage, orderIdParam]);

  // Subscribe to real-time chat updates for each active order
  useEffect(() => {
    if (!connected || orders.length === 0 || !user?.id) return;

    const activeDestinations: string[] = [];

    orders
      .filter(ord => ord.driver && ord.id)
      .forEach(ord => {
        const destination = `/user/queue/chat/order/${ord.id}`;
        activeDestinations.push(destination);

        subscribe(destination, (data: any) => {
          if (data && data.senderType === "DRIVER") {
            const isViewingThisChat = isMessagesPage && orderIdParam === ord.id.toString();
            if (!isViewingThisChat) {
              setUnreadCounts(prev => {
                const currentVal = prev[`order_${ord.id}`] || 0;
                const newVal = currentVal + 1;
                return { ...prev, [`order_${ord.id}`]: newVal };
              });
              setUnreadCount(prev => prev + 1);
            } else {
              chatApi.markAsRead(ord.id, user.id).catch(err => console.error("Error marking messages as read:", err));
            }
          }
        });
      });

    return () => {
      activeDestinations.forEach(dest => unsubscribe(dest));
    };
  }, [connected, ordersKey, subscribe, unsubscribe, isMessagesPage, orderIdParam, user?.id]);

  // Reset local unread state and call markAsRead API when user opens a chat room
  useEffect(() => {
    if (isMessagesPage && orderIdParam && user?.id) {
      const orderIdNum = parseInt(orderIdParam, 10);
      if (!isNaN(orderIdNum)) {
        chatApi.markAsRead(orderIdNum, user.id)
          .then(() => {
            const key = `order_${orderIdParam}`;
            setUnreadCounts(prev => {
              const currentVal = prev[key] || 0;
              if (currentVal > 0) {
                setUnreadCount(total => Math.max(0, total - currentVal));
                return { ...prev, [key]: 0 };
              }
              return prev;
            });
          })
          .catch(err => console.error("Error marking messages as read:", err));
      }
    }
  }, [isMessagesPage, orderIdParam, user?.id]);

  // Listen to custom event when messages are marked as read in chat session
  useEffect(() => {
    const handleMarkedAsRead = (e: Event) => {
      const customEvent = e as CustomEvent<{ orderId: number }>;
      const readOrderId = customEvent.detail?.orderId;
      if (!readOrderId) return;

      const key = `order_${readOrderId}`;
      setUnreadCounts(prev => {
        const currentVal = prev[key] || 0;
        if (currentVal > 0) {
          setUnreadCount(total => Math.max(0, total - currentVal));
          return { ...prev, [key]: 0 };
        }
        return prev;
      });
    };

    window.addEventListener("messagesMarkedAsRead", handleMarkedAsRead);
    return () => {
      window.removeEventListener("messagesMarkedAsRead", handleMarkedAsRead);
    };
  }, []);

  return { unreadCount, unreadCounts };
}
