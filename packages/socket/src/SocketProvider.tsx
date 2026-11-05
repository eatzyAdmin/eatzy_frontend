"use client";
import React, { createContext, useContext, useEffect, useState, useRef, useMemo, useCallback } from "react";
import { SocketClient, SocketConfig } from "./socket-client";

interface SocketContextType {
  connected: boolean;
  subscribe: <T = unknown>(destination: string, callback: (data: T) => void) => () => void;
  publish: (destination: string, body: unknown) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children, url, token, onConnect, onDisconnect, onStompError }:
  SocketConfig & { children: React.ReactNode }) {
  const callbacks = useRef({ onConnect, onDisconnect, onStompError });
  callbacks.current = { onConnect, onDisconnect, onStompError };
  const [state, setState] = useState<{ client: SocketClient; connected: boolean } | null>(null);
  const connection = useMemo(() => {
    if (!url || !token) return null;
    const lifecycle = { enabled: false };
    const client = new SocketClient({
      url, token,
      onConnect: (frame) => {
        if (!lifecycle.enabled) return;
        setState({ client, connected: true });
        callbacks.current.onConnect?.(frame);
      },
      onDisconnect: () => {
        if (!lifecycle.enabled) return;
        setState({ client, connected: false });
        callbacks.current.onDisconnect?.();
      },
      onStompError: (frame) => {
        if (!lifecycle.enabled) return;
        setState({ client, connected: false });
        callbacks.current.onStompError?.(frame);
      },
    });
    return { client, lifecycle };
  }, [url, token]);

  useEffect(() => {
    if (!connection) return;
    connection.lifecycle.enabled = true;
    connection.client.activate();
    return () => {
      connection.lifecycle.enabled = false;
      void connection.client.deactivate();
    };
  }, [connection]);

  const subscribe = useCallback<SocketContextType['subscribe']>((destination, callback) => {
    const subscription = connection?.client.subscribe(destination, (message) => {
      let data;
      try { data = JSON.parse(message.body); }
      catch { data = message.body; }
      // Consumer errors must not be retried as JSON parsing failures.
      callback(data);
    });
    return () => subscription?.unsubscribe();
  }, [connection]);
  const publish = useCallback((destination: string, body: unknown) => {
    connection?.client.publish(destination, body);
  }, [connection]);
  const connected = !!connection && state?.client === connection.client && state.connected;
  const value = useMemo(() => ({ connected, subscribe, publish }), [connected, subscribe, publish]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

/** Each consumer owns its subscriptions, including destinations shared by other screens. */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) throw new Error("useSocket must be used within a SocketProvider");
  const owned = useRef(new Map<string, () => void>());
  const register = context.subscribe;
  const subscribe = useCallback<SocketContextType['subscribe']>((destination, callback) => {
    owned.current.get(destination)?.();
    const cleanup = register(destination, callback);
    owned.current.set(destination, cleanup);
    return () => {
      cleanup();
      if (owned.current.get(destination) === cleanup) owned.current.delete(destination);
    };
  }, [register]);
  const unsubscribe = useCallback((destination: string) => {
    owned.current.get(destination)?.();
    owned.current.delete(destination);
  }, []);
  useEffect(() => {
    const subscriptions = owned.current;
    return () => {
      subscriptions.forEach(cleanup => cleanup());
      subscriptions.clear();
    };
  }, [register]);
  return { connected: context.connected, subscribe, unsubscribe, publish: context.publish };
}
