"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import LoadingOverlay from "../feedback/LoadingOverlay";

type LoadingContextValue = {
  isLoading: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Đang tải...");

  const value = useMemo<LoadingContextValue>(() => ({
    isLoading,
    message,
    show: (msg?: string) => {
      if (msg) setMessage(msg);
      setIsLoading(true);
    },
    hide: () => setIsLoading(false),
  }), [isLoading, message]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay isLoading={isLoading} message={message} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export function SuspenseOverlay({ children, message }: { children: ReactNode; message?: string }) {
  return (
    // Consumers can use this as React.Suspense fallback component
    <LoadingOverlay isLoading message={message ?? "Đang tải..."} />
  );
}