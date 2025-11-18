"use client";

import { Utensils } from "../icons";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = "Đang tải..." }: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[var(--primary)]/20 rounded-full"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
          <Utensils className="absolute inset-0 m-auto text-[var(--primary)]" size={24} />
        </div>
        <p className="text-gray-700 font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}