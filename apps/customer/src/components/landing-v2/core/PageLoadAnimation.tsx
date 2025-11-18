"use client";

import { Utensils } from "@repo/ui/icons";

interface PageLoadAnimationProps {
  pageLoaded: boolean;
}

export default function PageLoadAnimation({ pageLoaded }: PageLoadAnimationProps) {
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-b from-emerald-300 via-lime-200 to-transparent origin-top transform transition-transform duration-[1500ms] ease-in-out ${
        pageLoaded ? "scale-y-0" : "scale-y-100"
      } z-[100] flex items-center justify-center pointer-events-none`}
    >
      {!pageLoaded && (
        <div className="text-[var(--primary)] opacity-80 animate-pulse">
          <Utensils size={72} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

