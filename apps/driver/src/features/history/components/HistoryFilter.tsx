"use client";

import { CheckCircle2, XCircle, ListFilter } from "@repo/ui/icons";

type FilterType = "ALL" | "DELIVERED" | "CANCELLED";

export default function HistoryFilter({
  current,
  onChange,
}: {
  current: FilterType;
  onChange: (val: FilterType) => void;
}) {
  const options = [
    { value: "ALL", label: "All", Icon: ListFilter, activeClass: "bg-[#1A1A1A] text-white shadow-lg shadow-black/10" },
    { value: "DELIVERED", label: "Completed", Icon: CheckCircle2, activeClass: "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30" },
    { value: "CANCELLED", label: "Cancelled", Icon: XCircle, activeClass: "bg-red-500 text-white shadow-lg shadow-red-500/20" },
  ];

  return (
    <div className="flex items-center gap-2 mb-2 overflow-x-auto no-scrollbar py-1">
      {options.map((opt) => {
        const isActive = current === opt.value;
        const Icon = opt.Icon;
        // Use updated styling logic:
        // Instead of a shared layoutId background, we'll use individual conditional classes like WalletPage for distinct colors
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value as FilterType)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${isActive ? opt.activeClass : "bg-white text-gray-500 border border-gray-100"
              }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
