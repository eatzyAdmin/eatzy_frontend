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
} from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";

interface NavItem {
  icon: React.ElementType;
  text: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
  { icon: Users, text: "Customers", path: "/customers" },
  { icon: Store, text: "Restaurants", path: "/restaurants" },
  { icon: Truck, text: "Drivers", path: "/drivers" },
  { icon: ShoppingBag, text: "Orders", path: "/orders" },
  { icon: BarChart3, text: "Analytics", path: "/analytics" },
  { icon: Settings, text: "Settings", path: "/settings" },
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
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

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
