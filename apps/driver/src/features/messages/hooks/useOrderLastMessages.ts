import { useState, useEffect } from "react";
import { chatApi } from "@repo/api";
import { useSocket } from "@repo/socket";

export function useOrderLastMessages(orders: any[]) {
  const [lastMessages, setLastMessages] = useState<Record<string, { text: string; time: string }>>({});
  const { connected, subscribe, unsubscribe } = useSocket();

  // Fetch initial history for last messages
  useEffect(() => {
    const fetchLastMessages = async () => {
      const updates: Record<string, { text: string; time: string }> = {};
      const promises = orders
        .filter(ord => ord.id)
        .map(async (ord) => {
          try {
            const res = await chatApi.getOrderChatHistory(ord.id);
            if (res.statusCode === 200 && res.data && res.data.length > 0) {
              const history = res.data;
              const latestMsg = history[history.length - 1];
              const msgTime = latestMsg.timestamp 
                ? new Date(latestMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Now';
              updates[`order_${ord.id}`] = {
                text: latestMsg.message,
                time: msgTime
              };
            }
          } catch (e) {
            console.error("Error loading last message:", e);
          }
        });
      await Promise.all(promises);
      setLastMessages(prev => ({ ...prev, ...updates }));
    };

    if (orders.length > 0) {
      fetchLastMessages();
    } else {
      setLastMessages({});
    }
  }, [orders]);

  // Subscribe to real-time chat updates to update last message
  useEffect(() => {
    if (!connected || orders.length === 0) return;

    const activeDestinations: string[] = [];

    orders
      .filter(ord => ord.id)
      .forEach(ord => {
        const destination = `/user/queue/chat/order/${ord.id}`;
        activeDestinations.push(destination);

        subscribe(destination, (data: any) => {
          if (data && data.message) {
            const msgTime = data.timestamp 
              ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastMessages(prev => ({
              ...prev,
              [`order_${ord.id}`]: {
                text: data.message,
                time: msgTime
              }
            }));
          }
        });
      });

    return () => {
      activeDestinations.forEach(dest => unsubscribe(dest));
    };
  }, [connected, orders, subscribe, unsubscribe]);

  // Listen to messageSent custom events from detail component
  useEffect(() => {
    const handleSent = (e: CustomEvent) => {
      const { orderId, text, timestamp } = e.detail;
      const msgTime = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastMessages(prev => ({
        ...prev,
        [`order_${orderId}`]: {
          text,
          time: msgTime
        }
      }));
    };

    window.addEventListener("messageSent" as any, handleSent);
    return () => window.removeEventListener("messageSent" as any, handleSent);
  }, []);

  return { lastMessages, setLastMessages };
}
