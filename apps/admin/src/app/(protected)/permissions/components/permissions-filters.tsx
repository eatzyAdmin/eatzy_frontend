"use client";

import { Search } from "@repo/ui/icons";

const CATEGORIES = [
  "Dashboard",
  "Người dùng",
  "Vai trò",
  "Quyền",
  "Khách hàng",
  "Tài xế",
  "Nhà hàng",
  "Đơn hàng",
  "Analytics",
];

interface PermissionsFiltersProps {
  searchTerm: string;
  selectedCategory: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string | null) => void;
}

export function PermissionsFilters({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: PermissionsFiltersProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm quyền hạn hoặc API..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-[var(--primary)] text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Tất cả
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[var(--primary)] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
