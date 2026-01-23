'use client';

import { motion } from '@repo/ui/motion';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass-container p-8 rounded-3xl bg-white/50 backdrop-blur-md border border-white/20 shadow-xl"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Tổng quan hệ thống
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Chào mừng bạn quay lại, Super Admin. Đây là nơi bạn có thể theo dõi toàn bộ hoạt động của hệ thống Eatzy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { label: 'Tổng doanh thu', value: '0đ', color: 'bg-blue-500' },
            { label: 'Cửa hàng hoạt động', value: '0', color: 'bg-green-500' },
            { label: 'Tài xế trực tuyến', value: '0', color: 'bg-yellow-500' }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 italic transition-hover hover:shadow-md">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
