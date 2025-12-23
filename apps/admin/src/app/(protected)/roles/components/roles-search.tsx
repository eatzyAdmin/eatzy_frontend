"use client";

import { Search } from "@repo/ui/icons";

interface RolesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function RolesSearch({ searchTerm, onSearchChange }: RolesSearchProps) {
  return (
    <div className="mb-6 relative">
      <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Tìm kiếm vai trò..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-12 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
      />
    </div>
  );
}
