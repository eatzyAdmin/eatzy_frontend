"use client";

import { useState } from "react";
import { 
  Settings,
  Bell,
  Lock,
  User,
  Mail,
  Globe,
  CreditCard,
  LogOut,
  Save,
  Eye,
  EyeOff,
} from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { StatusBadge } from "@repo/ui";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    storeName: "Eatzy Admin",
    email: "admin@eatzy.com",
    phone: "0123456789",
    address: "Hà Nội, Việt Nam",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    emailNotification: true,
    smsNotification: false,
    pushNotification: true,
    marketingEmail: false,
  });

  const tabs = [
    { id: "general", label: "Cài đặt chung", icon: Settings },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Lock },
    { id: "payment", label: "Thanh toán", icon: CreditCard },
  ];

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cài đặt</h1>
          <p className="text-gray-600">Quản lý cài đặt của bạn</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8"
        >
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {/* General Settings */}
            {activeTab === "general" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tên cửa hàng</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => handleInputChange("storeName", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Điện thoại</label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Địa chỉ</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tiền tệ</label>
                    <select
                      value={settings.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option>VND</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Múi giờ</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleInputChange("timezone", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                      <option>Asia/Ho_Chi_Minh</option>
                      <option>Asia/Bangkok</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>

                <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {[
                  { key: "emailNotification", label: "Thông báo qua Email", desc: "Nhận thông báo về đơn hàng qua email" },
                  { key: "smsNotification", label: "Thông báo qua SMS", desc: "Nhận thông báo qua tin nhắn SMS" },
                  { key: "pushNotification", label: "Thông báo Push", desc: "Nhận thông báo trên trình duyệt" },
                  { key: "marketingEmail", label: "Email tiếp thị", desc: "Nhận các email quảng cáo và khuyến mãi" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key as keyof typeof settings] as boolean}
                        onChange={(e) => handleInputChange(item.key, e.target.checked)}
                        className="w-5 h-5 text-[var(--primary)] rounded focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </label>
                  </div>
                ))}

                <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </motion.div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>Mật khẩu mạnh:</strong> Sử dụng ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Mật khẩu mới</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Cập nhật mật khẩu
                </button>

                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-4">Đăng xuất khỏi các thiết bị khác</p>
                  <button className="px-6 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Đăng xuất mọi nơi
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment */}
            {activeTab === "payment" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800"><strong>Tài khoản ngân hàng:</strong> Cập nhật thông tin thanh toán để nhận lợi nhuận.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Tên chủ tài khoản</label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Số tài khoản</label>
                    <input
                      type="text"
                      placeholder="0123456789"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Ngân hàng</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                      <option>Vietcombank</option>
                      <option>VietinBank</option>
                      <option>BIDV</option>
                      <option>Agribank</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Chi nhánh</label>
                    <input
                      type="text"
                      placeholder="Hà Nội"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                <button className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Lưu thông tin thanh toán
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
