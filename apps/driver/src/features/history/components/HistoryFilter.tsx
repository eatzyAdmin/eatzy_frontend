"use client";

import { motion } from "@repo/ui/motion";
import { CheckCircle2, XCircle, LayoutGrid } from "@repo/ui/icons";

type FilterType = "ALL" | "DELIVERED" | "CANCELLED";

const statusFilters = [
  { value: "ALL", label: "All", icon: LayoutGrid },
  { value: "DELIVERED", label: "Completed", icon: CheckCircle2 },
  { value: "CANCELLED", label: "Cancelled", icon: XCircle },
];

export default function HistoryFilter({
  current,
  onChange,
}: {
  current: FilterType;
  onChange: (val: FilterType) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
      {statusFilters.map((filter) => {
        const isActive = current === filter.value;
        const Icon = filter.icon;

        return (
          <motion.button
            key={filter.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(filter.value as FilterType)}
            className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${isActive
              ? filter.value === "CANCELLED"
                ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                : filter.value === "ALL"
                  ? "bg-[#1A1A1A] text-white shadow-md shadow-black/10"
                  : "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20"
              : filter.value === "CANCELLED"
                ? "bg-gray-100 text-gray-500 hover:text-red-500"
                : "bg-gray-100 text-gray-500 hover:text-[var(--primary)]"
              }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
}
