"use client";

import { NavItemProps } from "../types";

export default function MobileNavItem({ text, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative text-xl font-medium py-3 mb-1 transition-colors duration-300 w-full text-center bg-transparent border-none outline-none cursor-pointer flex flex-col items-center justify-center ${
        active ? "text-[var(--primary)]" : "text-white/80 hover:text-[var(--primary)]"
      }`}
    >
      {text}
      <span
        className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-[var(--primary)] transition-all duration-500 ${
          active ? "opacity-100" : "opacity-0 scale-x-0"
        }`}
      ></span>
    </button>
  );
}

