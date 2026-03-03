"use client";

import { motion } from "@repo/ui/motion";
import { useEffect } from "react";
import { useSwipeConfirmation, useLoading } from "@repo/ui";
import {
  User, CreditCard, ShieldCheck,
  LogOut, MapPin, Bell, HelpCircle
} from "@repo/ui/icons";
import { mockCustomerProfile } from "@/features/profile/data/mockProfileData";
import CustomerProfileCard from "@/features/profile/components/CustomerProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";

import MagazineProfileContent from "@/features/profile/components/MagazineProfileContent";

export default function ProfilePage() {
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { user } = useAuth();
  const { handleLogout: performLogout, isLoading: isLoggingOut } = useLogout();

  // Simulate loading finish on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  const handleLogout = () => {
    confirm({
      title: "Đăng xuất tài khoản",
      description: "Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?",
      confirmText: "Trượt để đăng xuất",
      type: "danger",
      onConfirm: async () => {
        show();
        performLogout();
      }
    });
  };

  // Merge real user data with mock profile structure
  const displayProfile = {
    ...mockCustomerProfile,
    name: user?.name || mockCustomerProfile.name,
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] scroll-smooth pt-8 md:pt-20 pb-24 md:pb-0 overflow-hidden">

      {/* Desktop Magazine View */}
      <div className="hidden md:block w-full px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagazineProfileContent onLogout={handleLogout} />
        </motion.div>
      </div>

      {/* Mobile Standard View - Kept for accessibility but styled darker */}
      <div className="md:hidden max-w-7xl mx-auto px-4 space-y-8 overflow-y-auto pt-10">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CustomerProfileCard profile={displayProfile} />
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Tài khoản</h3>
          <div className="space-y-3">
            <ProfileMenuItem icon={<User className="w-5 h-5" />} label="Thông tin cá nhân" subLabel="Chỉnh sửa hồ sơ" />
            <ProfileMenuItem icon={<MapPin className="w-5 h-5" />} label="Địa chỉ đã lưu" subLabel="Nhà riêng, Công ty" />
            <ProfileMenuItem icon={<CreditCard className="w-5 h-5" />} label="Phương thức thanh toán" subLabel="Visa **** 1234" />
          </div>
        </motion.div>

        {/* App Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Ứng dụng</h3>
          <div className="space-y-3">
            <ProfileMenuItem icon={<Bell className="w-5 h-5" />} label="Cài đặt thông báo" />
            <ProfileMenuItem icon={<ShieldCheck className="w-5 h-5" />} label="Bảo mật & Quyền riêng tư" />
            <ProfileMenuItem icon={<HelpCircle className="w-5 h-5" />} label="Trung tâm trợ giúp" />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <ProfileMenuItem
            icon={<LogOut className="w-5 h-5" />}
            label="Đăng xuất"
            subLabel="v2.4.8"
            isDestructive
            onClick={handleLogout}
          />
        </motion.div>
      </div>
    </div>
  );
}
