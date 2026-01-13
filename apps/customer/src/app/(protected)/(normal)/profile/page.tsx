"use client";

import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSwipeConfirmation, useLoading, useNotification } from "@repo/ui";
import {
  User, CreditCard, ShieldCheck,
  LogOut, MapPin, Bell, HelpCircle
} from "@repo/ui/icons";
import { mockCustomerProfile } from "@/features/profile/data/mockProfileData";
import CustomerProfileCard from "@/features/profile/components/CustomerProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { logout } from "@/features/auth/api";
import { useAuthStore } from "@repo/store";

export default function ProfilePage() {
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { showNotification } = useNotification();
  const { user } = useAuth();
  const { clearAuth } = useAuthStore();

  // Simulate loading finish on mount (standard practice in this app)
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
        try {
          await logout();
        } catch (error) {
          console.error("Logout error", error);
        }

        // Always clear local state and redirect
        clearAuth();
        hide();
        showNotification({ message: "Đăng xuất thành công", type: "success" });
        router.push("/login");
      }
    });
  };

  // Merge real user data with mock profile structure for display
  const displayProfile = {
    ...mockCustomerProfile,
    name: user?.name || mockCustomerProfile.name,
    // email: user?.email // Profile card might not show email, but name counts
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F7F7F7] pb-40 scroll-smooth pt-20 md:pt-24">
      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-8">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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
          <div>
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
          <div>
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
            subLabel="v2.0.1"
            isDestructive
            onClick={handleLogout}
          />
        </motion.div>
      </div>
    </div>
  );
}
