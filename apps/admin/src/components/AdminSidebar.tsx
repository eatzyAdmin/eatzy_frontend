"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Truck,
  ShoppingBag,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BarChart3,
  Shield,
  Lock,
  BookOpen,
  User,
  DollarSign,
  Clock,
  MapPin,
  Gift,
  Star,
  Calendar,
} from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";

interface NavItem {
  icon: React.ElementType;
  text: string;
  path: string;
  group?: string;
}

const navItems: NavItem[] = [
  // Main
  { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard", group: "Main" },
  
  // Quản lý nhà hàng & thực đơn
  { icon: Store, text: "Nhà hàng", path: "/restaurants", group: "Quản lý nhà hàng" },
  { icon: BookOpen, text: "Danh mục", path: "/categories", group: "Quản lý nhà hàng" },
  { icon: Clock, text: "Ca làm việc", path: "/restaurant-shifts", group: "Quản lý nhà hàng" },
  { icon: MapPin, text: "Khu vực", path: "/restaurant-areas", group: "Quản lý nhà hàng" },
  
  // Quản lý đơn hàng
  { icon: ShoppingBag, text: "Đơn hàng", path: "/orders", group: "Quản lý đơn hàng" },
  { icon: Truck, text: "Giao hàng", path: "/orders/delivery", group: "Quản lý đơn hàng" },
  
  // Quản lý người dùng
  { icon: Users, text: "Khách hàng", path: "/customers", group: "Quản lý người dùng" },
  { icon: Truck, text: "Tài xế", path: "/drivers", group: "Quản lý người dùng" },
  { icon: User, text: "Nhân viên", path: "/users", group: "Quản lý người dùng" },
  
  // Quản lý quyền
  { icon: Shield, text: "Vai trò", path: "/roles", group: "Quản lý quyền" },
  { icon: Lock, text: "Quyền hạn", path: "/permissions", group: "Quản lý quyền" },
  
  // Tài chính
  { icon: DollarSign, text: "Ví tiền", path: "/wallet", group: "Tài chính" },
  
  // Khác
  { icon: BarChart3, text: "Thống kê", path: "/analytics", group: "Khác" },
  { icon: Gift, text: "Khuyến mãi", path: "/promotions", group: "Khác" },
  { icon: Star, text: "Đánh giá", path: "/reviews", group: "Khác" },
  { icon: Calendar, text: "Đặt bàn", path: "/booking", group: "Khác" },
  { icon: Settings, text: "Cài đặt", path: "/settings", group: "Khác" },
  { icon: User, text: "Hồ sơ", path: "/profile", group: "Khác" },
];

export default function AdminSidebar() {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 280 : 80 }}
      className="h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col fixed left-0 top-0 z-40 shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <AnimatePresence mode="wait">
          {expanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold">E</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">Eatzy Admin</h1>
                <p className="text-xs text-purple-200">Management Portal</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto"
            >
              <span className="text-xl font-bold">E</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
        {Array.from(new Set(navItems.map(item => item.group))).map((group) => (
          <div key={group} className="mb-6">
            {expanded && (
              <h3 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-3 px-4">
                {group}
              </h3>
            )}
            <div className="space-y-1">
              {navItems.filter(item => item.group === group).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

                return (
                  <motion.button
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 backdrop-blur-sm text-white shadow-lg"
                        : "text-purple-200 hover:bg-white/10 hover:text-white"
                    }`}
                    title={item.text}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence mode="wait">
                      {expanded && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm font-medium whitespace-nowrap"
                        >
                          {item.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        {/* Toggle Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 mb-3"
        >
          {expanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          {expanded && <span className="text-sm font-medium">Thu gọn</span>}
        </button>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white transition-all duration-300"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {expanded && (
            <span className="text-sm font-medium whitespace-nowrap">
              Đăng xuất
            </span>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
