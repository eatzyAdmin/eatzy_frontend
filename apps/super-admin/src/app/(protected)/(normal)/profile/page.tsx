'use client';

import { motion } from '@repo/ui/motion';

export default function ProfilePage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass-container p-8 rounded-3xl bg-white/50 backdrop-blur-md border border-white/20 shadow-xl"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Thông tin cá nhân
        </h1>
        <p className="text-gray-600 mt-4">
          Xem và chỉnh sửa thông tin tài khoản Super Admin của bạn.
        </p>
        <div className="mt-12 space-y-4">
          <div className="flex border-b border-gray-100 pb-4">
            <span className="w-32 text-gray-500 font-medium">Họ tên:</span>
            <span className="text-gray-800">Super Admin</span>
          </div>
          <div className="flex border-b border-gray-100 pb-4">
            <span className="w-32 text-gray-500 font-medium">Email:</span>
            <span className="text-gray-800">admin@eatzy.com</span>
          </div>
          <div className="flex border-b border-gray-100 pb-4">
            <span className="w-32 text-gray-500 font-medium">Vai trò:</span>
            <span className="text-gray-800">Quản trị viên tối cao</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
