"use client";

import { Plus } from "@repo/ui/icons";

interface PermissionsHeaderProps {
  onCreateClick: () => void;
}

export function PermissionsHeader({ onCreateClick }: PermissionsHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Quyền hạn</h1>
          <p className="text-gray-600 mt-1">Một API = Một quyền hạn</p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Thêm quyền
        </button>
      </div>
    </div>
  );
}
