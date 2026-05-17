import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import { useSocket } from "@repo/socket";
import { usePathname, useSearchParams } from "next/navigation";

export function useUnreadMessageCount() {
  const { orders } = useCurrentOrders();
  const { connected, subscribe, unsubscribe } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams ? searchParams.get('orderId') : null;
  const isMessagesPage = pathname?.startsWith('/messages');

  // Fetch initial counts from API
  useEffect(() => {
    const fetchCounts = async () => {
      let total = 0;
      const counts: Record<string, number> = {};
      
      const promises = orders
        .filter(ord => ord.driver && ord.id)
        .map(async (ord) => {
          try {
            const res = await chatApi.getMessageCount(ord.id);
            if (res.statusCode === 200 && typeof res.data === 'number') {
              total += res.data;
              counts[`order_${ord.id}`] = res.data;
            }
          } catch (e) {
            console.error("Error loading unread messages count:", e);
          }
        });
      await Promise.all(promises);
      setUnreadCount(total);
      setUnreadCounts(counts);
    };

    if (orders.length > 0) {
      fetchCounts();
    } else {
      setUnreadCount(0);
      setUnreadCounts({});
    }
  }, [orders]);

  // Subscribe to real-time chat updates for each active order
  useEffect(() => {
    if (!connected || orders.length === 0) return;

    const activeDestinations: string[] = [];

    orders
      .filter(ord => ord.driver && ord.id)
      .forEach(ord => {
        const destination = `/user/queue/chat/order/${ord.id}`;
        activeDestinations.push(destination);

        subscribe(destination, (data: any) => {
          // Increment total real-time count when partner sends a message
          if (data && data.senderType === "DRIVER") {
            const isViewingThisChat = isMessagesPage && orderIdParam === ord.id.toString();
            if (!isViewingThisChat) {
              setUnreadCounts(prev => {
                const currentVal = prev[`order_${ord.id}`] || 0;
                const newVal = currentVal + 1;
                return { ...prev, [`order_${ord.id}`]: newVal };
              });
              setUnreadCount(prev => prev + 1);
            }
          }
        });
      });

    return () => {
      activeDestinations.forEach(dest => unsubscribe(dest));
    };
  }, [connected, orders, subscribe, unsubscribe, isMessagesPage, orderIdParam]);

  // Reset local unread state for active chat room
  useEffect(() => {
    if (isMessagesPage && orderIdParam) {
      const key = `order_${orderIdParam}`;
      setUnreadCounts(prev => {
        const currentVal = prev[key] || 0;
        if (currentVal > 0) {
          setUnreadCount(total => Math.max(0, total - currentVal));
          return { ...prev, [key]: 0 };
        }
        return prev;
      });
    }
  }, [isMessagesPage, orderIdParam]);

  return { unreadCount, unreadCounts };
}
