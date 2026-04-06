"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { SocketClient, SocketConfig } from "./socket-client";
import { IFrame, IMessage } from "@stomp/stompjs";

interface SocketContextType {
  connected: boolean;
  subscribe: <T = any>(destination: string, callback: (data: T) => void) => void;
  unsubscribe: (destination: string) => void;
  publish: (destination: string, body: any) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

/**
 * Global Socket Provider to manage STOMP connection.
 * Used across Customer, Driver, and Restaurant applications.
 */
export function SocketProvider({ 
  children, 
  url, 
  token,
  onConnect,
  onDisconnect,
  onStompError
}: { 
  children: React.ReactNode; 
  url: string; 
  token?: string | null;
  onConnect?: (frame: IFrame) => void;
  onDisconnect?: () => void;
  onStompError?: (frame: IFrame) => void;
}) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<SocketClient | null>(null);

  useEffect(() => {
    // Only connect if url and token are available
    if (!url || !token) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
        setConnected(false);
      }
      return;
    }

    const client = new SocketClient({
      url,
      token,
      onConnect: (frame) => {
        setConnected(true);
        console.info('🔌 WebSocket Connected');
        onConnect?.(frame);
      },
      onDisconnect: () => {
        setConnected(false);
        console.warn('🔌 WebSocket Disconnected');
        onDisconnect?.();
      },
      onStompError: (frame) => {
        setConnected(false);
        console.error('WebSocket STOMP Error:', frame);
        onStompError?.(frame);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [url, token]);

  const value: SocketContextType = {
    connected,
    subscribe: (destination, callback) => {
      if (clientRef.current) {
        clientRef.current.subscribe(destination, (message: IMessage) => {
          try {
            const data = JSON.parse(message.body);
            callback(data);
          } catch (e) {
            console.error('Error parsing STOMP message:', e);
            callback(message.body as any);
          }
        });
      }
    },
    unsubscribe: (destination) => {
      if (clientRef.current) {
        clientRef.current.unsubscribe(destination);
      }
    },
    publish: (destination, body) => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.publish(destination, body);
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

/**
 * Socket utility hook for components.
 */
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
