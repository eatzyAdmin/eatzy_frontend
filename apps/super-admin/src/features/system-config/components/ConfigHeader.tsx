'use client';

import { Settings } from 'lucide-react';

interface ConfigHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

export function ConfigHeader({ onRefresh, isLoading }: ConfigHeaderProps) {
  return (
    <div className="px-8 pt-5 shrink-0">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-lime-200">
              <Settings size={12} />
              Platform Settings
            </span>
          </div>
          <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
            SYSTEM CONFIGURATION
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Quản lý các tham số vận hành, hoa hồng và thiết lập nền tảng Eatzy.
          </p>
        </div>
      </div>
    </div>
  );
}
