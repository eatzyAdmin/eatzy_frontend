"use client";

import { useState } from "react";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Camera,
  Shield,
  LogOut,
} from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { StatusBadge } from "@repo/ui";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Nguyễn Văn A",
    email: "admin@eatzy.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    role: "Super Admin",
    joinDate: "2023-01-15",
    status: "active",
    avatar: "👤",
  });

  const [formData, setFormData] = useState(profile);

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Hồ sơ của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin tài khoản của bạn</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-[var(--primary)] to-blue-500" />

          {/* Avatar & Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center text-6xl">
                  {profile.avatar}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 bg-[var(--primary)] text-white rounded-full hover:opacity-90 transition-opacity">
                    <Camera className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="text-3xl font-bold text-gray-900 mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                )}
                <div className="flex gap-3 items-center">
                  <StatusBadge status="active" />
                  <span className="text-sm text-gray-600">{profile.role}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-8 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                ) : (
                  <p className="text-gray-600">{profile.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Vai trò
                </label>
                <p className="text-gray-600">{profile.role}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Tham gia từ</label>
                <p className="text-gray-600">
                  {new Date(profile.joinDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-8 border-t border-gray-200">
                <button
                  onClick={() => {
                    setFormData(profile);
                    setIsEditing(false);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hoạt động gần đây</h2>
          
          <div className="space-y-4">
            {[
              { action: "Đăng nhập", time: "Hôm nay lúc 10:30", ip: "192.168.1.1" },
              { action: "Cập nhật hồ sơ", time: "Hôm qua lúc 14:15", ip: "192.168.1.1" },
              { action: "Đổi mật khẩu", time: "3 ngày trước", ip: "192.168.1.2" },
              { action: "Đăng nhập", time: "1 tuần trước", ip: "192.168.1.1" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.time} • IP: {item.ip}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Security Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật</h2>

          <div className="space-y-4 mb-6">
            <button className="w-full px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left">
              Đổi mật khẩu
            </button>
            <button className="w-full px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left">
              Xác thực hai yếu tố
            </button>
            <button className="w-full px-6 py-3 border border-red-300 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Đăng xuất khỏi tất cả các thiết bị
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}