"use client";

import { motion } from "@repo/ui/motion";
import { useSwipeConfirmation, useLoading } from "@repo/ui";
import {
  User, CreditCard, ShieldCheck,
  LogOut, Bike, Bell, HelpCircle
} from "@repo/ui/icons";
import { mockDriverProfile } from "@/features/profile/data/mockProfileData";
import DriverProfileCard from "@/features/profile/components/DriverProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { PullToRefresh } from "@repo/ui";

export default function ProfilePage() {
  const { confirm } = useSwipeConfirmation();
  const { show } = useLoading();
  const { user } = useAuth();
  const { handleLogout: performLogout } = useLogout();

  const handleRefresh = async () => {
    // Artificial delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
  };

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

  // Merge real user data
  const displayProfile = {
    ...mockDriverProfile,
    name: user?.name || mockDriverProfile.name,
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className="h-screen flex flex-col bg-[#F7F7F7]"
    >
      <div className="min-h-full pb-40 scroll-smooth pt-[72px]">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DriverProfileCard profile={displayProfile} />
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Tài khoản</h3>
            <div className="space-y-1">
              <ProfileMenuItem icon={<User className="w-5 h-5" />} label="Thông tin cá nhân" subLabel="Chỉnh sửa hồ sơ" />
              <ProfileMenuItem icon={<Bike className="w-5 h-5" />} label="Phương tiện" subLabel={mockDriverProfile.vehicleType} />
              <ProfileMenuItem icon={<CreditCard className="w-5 h-5" />} label="Tài khoản ngân hàng" subLabel="Techcombank **** 8829" />
            </div>
          </motion.div>

          {/* App Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Ứng dụng</h3>
            <div className="space-y-1">
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
              subLabel="v1.0.2"
              isDestructive
              onClick={handleLogout}
            />
          </motion.div>
        </div>
      </div>
    </PullToRefresh>
  );
}
