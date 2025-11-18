"use client";

import { ArrowUp } from "@repo/ui/icons";

interface ScrollIndicatorProps {
  visible: boolean;
  onClick: () => void;
}

export default function ScrollIndicator({ visible, onClick }: ScrollIndicatorProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-8 right-8 z-50 p-3 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-lg group transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0 animate-bounce" : "opacity-0 translate-y-12 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-0 group-hover:opacity-70"></div>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
        <ArrowUp size={20} className="text-white transform group-hover:scale-110 transition-all duration-300" />
      </div>

      <span className="absolute right-full mr-2 whitespace-nowrap bg-white/90 border border-[var(--primary)] text-[var(--primary)] text-sm font-medium px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transform translate-x-4 -translate-y-8 group-hover:-translate-x-0 transition-all duration-300">
        Lên đầu trang
      </span>
    </button>
  );
}

