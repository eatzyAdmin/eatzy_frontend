'use client';

import { motion } from '@repo/ui/motion';

export default function RestaurantsPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass-container p-8 rounded-3xl bg-white/50 backdrop-blur-md border border-white/20 shadow-xl"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Quản lý cửa hàng
        </h1>
        <p className="text-gray-600 mt-4">
          Danh sách và công cụ quản lý các cửa hàng, quán ăn trên nền tảng.
        </p>
        <div className="mt-12 flex items-center justify-center p-20 border-2 border-dashed border-gray-200 rounded-3xl">
          <p className="text-gray-400 font-medium">Đang tải dữ liệu cửa hàng...</p>
        </div>
      </motion.div>
    </div>
  );
}
