// ============================================================================
// Shared Storage Sync Utility
// Sử dụng BroadcastChannel để đồng bộ dữ liệu giữa các Eatzy apps
// ============================================================================

/**
 * Event types for cross-app communication
 */
export enum SyncEventType {
  // Data changes
  DATA_CREATED = 'data_created',
  DATA_UPDATED = 'data_updated',
  DATA_DELETED = 'data_deleted',

  // Auth events
  USER_LOGGED_IN = 'user_logged_in',
  USER_LOGGED_OUT = 'user_logged_out',

  // Order events
  ORDER_STATUS_CHANGED = 'order_status_changed',
  NEW_ORDER_RECEIVED = 'new_order_received',

  // General
  REFETCH_DATA = 'refetch_data',
}

/**
 * Sync event payload
 */
export interface SyncEvent {
  type: SyncEventType;
  entity?: string; // e.g., 'orders', 'users', 'restaurants'
  action?: 'create' | 'update' | 'delete';
  id?: string | number;
  data?: any;
  timestamp?: number;
  sourceApp?: string; // 'customer', 'driver', 'restaurant', 'admin', 'super-admin'
}

/**
 * Cross-app sync manager using BroadcastChannel
 */
export class EatzySyncManager {
  private channel: BroadcastChannel;
  private listeners: Map<SyncEventType, Set<(event: SyncEvent) => void>>;
  private appName: string;

  constructor(appName: string, channelName = 'eatzy-sync') {
    this.appName = appName;
    this.channel = new BroadcastChannel(channelName);
    this.listeners = new Map();

    // Setup global message listener
    this.channel.onmessage = (messageEvent) => {
      const event: SyncEvent = messageEvent.data;

      // Don't process events from the same app (optional)
      if (event.sourceApp === this.appName) {
        return;
      }

      console.log(`[${this.appName}] Received sync event:`, event);

      // Notify all registered listeners for this event type
      const eventListeners = this.listeners.get(event.type);
      if (eventListeners) {
        eventListeners.forEach((listener) => listener(event));
      }
    };
  }

  /**
   * Broadcast an event to all other apps
   */
  broadcast(event: Omit<SyncEvent, 'timestamp' | 'sourceApp'>): void {
    const fullEvent: SyncEvent = {
      ...event,
      timestamp: Date.now(),
      sourceApp: this.appName,
    };

    console.log(`[${this.appName}] Broadcasting event:`, fullEvent);
    this.channel.postMessage(fullEvent);
  }

  /**
   * Listen for specific event types
   */
  on(eventType: SyncEventType, callback: (event: SyncEvent) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }

    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        eventListeners.delete(callback);
      }
    };
  }

  /**
   * Remove all listeners for a specific event type
   */
  off(eventType: SyncEventType): void {
    this.listeners.delete(eventType);
  }

  /**
   * Close the broadcast channel and cleanup
   */
  destroy(): void {
    this.channel.close();
    this.listeners.clear();
  }
}

// ============================================================================
// React Hook for easy integration
// ============================================================================

import { useEffect, useRef, useCallback } from 'react';

/**
 * React hook to use EatzySyncManager
 * 
 * @example
 * ```tsx
 * const sync = useEatzySync('customer');
 * 
 * // Listen for events
 * useEffect(() => {
 *   return sync.on(SyncEventType.ORDER_STATUS_CHANGED, (event) => {
 *     console.log('Order changed:', event);
 *     refetchOrders();
 *   });
 * }, [sync]);
 * 
 * // Broadcast events
 * const handleCreateOrder = () => {
 *   // ... create order logic
 *   sync.broadcast({
 *     type: SyncEventType.DATA_CREATED,
 *     entity: 'orders',
 *     id: newOrder.id,
 *   });
 * };
 * ```
 */
export function useEatzySync(appName: string) {
  const syncManager = useRef<EatzySyncManager | null>(null);

  useEffect(() => {
    syncManager.current = new EatzySyncManager(appName);

    return () => {
      syncManager.current?.destroy();
    };
  }, [appName]);

  const broadcast = useCallback((event: Omit<SyncEvent, 'timestamp' | 'sourceApp'>) => {
    syncManager.current?.broadcast(event);
  }, []);

  const on = useCallback((eventType: SyncEventType, callback: (event: SyncEvent) => void) => {
    return syncManager.current?.on(eventType, callback) || (() => { });
  }, []);

  const off = useCallback((eventType: SyncEventType) => {
    syncManager.current?.off(eventType);
  }, []);

  return { broadcast, on, off };
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Customer app - Create order and notify
 */
export function CustomerOrderExample() {
  const sync = useEatzySync('customer');

  const createOrder = async (orderData: any) => {
    // Create order via API
    const newOrder = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }).then(res => res.json());

    // Notify other apps
    sync.broadcast({
      type: SyncEventType.NEW_ORDER_RECEIVED,
      entity: 'orders',
      id: newOrder.id,
      data: newOrder,
    });
  };

  return { createOrder };
}

/**
 * Example 2: Driver app - Listen for new orders
 */
export function DriverOrderListener() {
  const sync = useEatzySync('driver');

  useEffect(() => {
    // Listen for new orders
    const unsubscribe = sync.on(SyncEventType.NEW_ORDER_RECEIVED, (event) => {
      console.log('New order received:', event.data);
      // Show notification
      // Refetch orders list
    });

    return unsubscribe;
  }, [sync]);
}

/**
 * Example 3: Restaurant app - Update order status
 */
export function RestaurantOrderUpdate() {
  const sync = useEatzySync('restaurant');

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    // Update via API
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });

    // Broadcast change
    sync.broadcast({
      type: SyncEventType.ORDER_STATUS_CHANGED,
      entity: 'orders',
      id: orderId,
      data: { status: newStatus },
    });
  };

  return { updateOrderStatus };
}

/**
 * Example 4: Any app - Listen for auth changes
 */
export function AuthSyncListener() {
  const sync = useEatzySync('customer');

  useEffect(() => {
    const unsubscribeLogin = sync.on(SyncEventType.USER_LOGGED_IN, (event) => {
      console.log('User logged in from another app');
      // Reload user data
    });

    const unsubscribeLogout = sync.on(SyncEventType.USER_LOGGED_OUT, (event) => {
      console.log('User logged out from another app');
      // Clear local state, redirect to login
    });

    return () => {
      unsubscribeLogin();
      unsubscribeLogout();
    };
  }, [sync]);
}
