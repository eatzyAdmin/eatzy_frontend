"use client";

import { NavItemProps } from "../types";

export default function NavItem({ text, active = false, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`relative font-medium transition-colors duration-300 ${
        active ? "text-[var(--primary)]" : "text-white/80 hover:text-[var(--primary)]"
      } bg-transparent border-none outline-none cursor-pointer px-1`}
    >
      {text}
      <span
        className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[var(--primary)] transform origin-left transition-transform duration-500 ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      ></span>
    </button>
  );
}

