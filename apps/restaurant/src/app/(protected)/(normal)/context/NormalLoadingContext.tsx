"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
// import { usePathname } from "next/navigation";

interface NormalLoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const NormalLoadingContext = createContext<NormalLoadingContextType | undefined>(undefined);

export function NormalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  // const pathname = usePathname();

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setStartTime(Date.now());
  }, []);

  const stopLoading = useCallback(() => {
    const elapsed = Date.now() - startTime;
    const MIN_DURATION = 1000; // 1s

    if (elapsed < MIN_DURATION) {
      setTimeout(() => {
        setIsLoading(false);
      }, MIN_DURATION - elapsed);
    } else {
      setIsLoading(false);
    }
  }, [startTime]);

  return (
    <NormalLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </NormalLoadingContext.Provider>
  );
}

export function NormalLoadingOverlay() {
  const { isLoading } = useNormalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[40] bg-white/60 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
      <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin shadow-lg" />
    </div>
  );
}

export function useNormalLoading() {
  const context = useContext(NormalLoadingContext);
  if (!context) {
    throw new Error("useNormalLoading must be used within NormalLoadingProvider");
  }
  return context;
}
