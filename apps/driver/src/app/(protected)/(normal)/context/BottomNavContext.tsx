"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface BottomNavContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(undefined);

export function BottomNavProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  return (
    <BottomNavContext.Provider value={{ 
      isVisible, 
      setIsVisible, 
      isHeaderVisible, 
      setIsHeaderVisible 
    }}>
      {children}
    </BottomNavContext.Provider>
  );
}

export function useBottomNav() {
  const context = useContext(BottomNavContext);
  if (context === undefined) {
    throw new Error("useBottomNav must be used within a BottomNavProvider");
  }
  return context;
}
