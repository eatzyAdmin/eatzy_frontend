"use client";

import { Search } from "@repo/ui/icons";

interface OrdersFiltersProps {
  searchTerm: string;
  selectedStatus: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string | null) => void;
}

const statusOptions = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "preparing", label: "Đang chuẩn bị" },
  { value: "delivering", label: "Đang giao" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export function OrdersFilters({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: OrdersFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hoặc tên khách..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onStatusChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedStatus === null
              ? "bg-[var(--primary)] text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Tất cả
        </button>
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === option.value
                ? "bg-[var(--primary)] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
