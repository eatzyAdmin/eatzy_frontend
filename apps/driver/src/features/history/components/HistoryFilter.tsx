"use client";

import { motion } from "@repo/ui/motion";

type FilterType = "ALL" | "DELIVERED" | "CANCELLED";

export default function HistoryFilter({
  current,
  onChange,
}: {
  current: FilterType;
  onChange: (val: FilterType) => void;
}) {
  const options: { value: FilterType; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    { value: "DELIVERED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar py-1">
      {options.map((opt) => {
        const isActive = current === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${isActive ? "text-white shadow-lg shadow-[var(--primary)]/25" : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            {isActive && (
              <motion.div
                layoutId="historyFilter"
                className="absolute inset-0 bg-[var(--primary)] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 font-bold">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
