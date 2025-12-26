"use client";

import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSwipeConfirmation, useLoading, useNotification, STORAGE_KEYS } from "@repo/ui";
import {
  User, Settings, CreditCard, ShieldCheck,
  LogOut, ChevronRight, Bike, Bell, HelpCircle, FileText
} from "@repo/ui/icons";
import DriverProfileCard from "@/features/profile/components/DriverProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";

import { useNormalLoading } from "../context/NormalLoadingContext";

// Helper to get driver profile from localStorage
function getDriverProfile() {
  try {
    // Get current user
    const currentUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!currentUserStr) return null;

    const currentUser = JSON.parse(currentUserStr);

    // Get driver by userId
    const driversStr = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    if (!driversStr) return null;

    const drivers = JSON.parse(driversStr);
    const driver = drivers.find((d: any) => d.userId === currentUser.id);

    return driver || null;
  } catch (error) {
    console.error('Error loading driver profile:', error);
    return null;
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { showNotification } = useNotification();
  const { stopLoading } = useNormalLoading();
  const [driverProfile, setDriverProfile] = useState<any>(null);

  useEffect(() => {
    stopLoading();
    // Load driver profile from localStorage
    const profile = getDriverProfile();
    setDriverProfile(profile);
  }, [stopLoading]);

  const handleLogout = () => {
    confirm({
      title: "Đăng xuất tài khoản",
      description: "Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng?",
      confirmText: "Trượt để đăng xuất",
      type: "danger",
      onConfirm: () => {
        show();
        setTimeout(() => {
          // Clear auth data
          localStorage.removeItem("access_token");
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
          document.cookie = "driver_auth=; path=/; max-age=0";

          hide();
          showNotification({ message: "Đăng xuất thành công", type: "success" });
          router.push("/login");
        }, 1000);
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#F7F7F7] pb-40 scroll-smooth">
      {/* Header Title */}
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-4xl font-bold font-anton text-[#1A1A1A]">PROFILE</h1>
      </div>

      <div className="px-5 space-y-8">
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {driverProfile ? (
            <DriverProfileCard profile={driverProfile} />
          ) : (
            <div className="bg-white rounded-3xl p-6 text-center text-gray-500">
              Đang tải thông tin...
            </div>
          )}
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
            <ProfileMenuItem icon={<Bike className="w-5 h-5" />} label="Phương tiện" subLabel={driverProfile?.vehicleType || "Chưa cập nhật"} />
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
            subLabel="v1.0.2"
            isDestructive
            onClick={handleLogout}
          />
        </motion.div>
      </div>
    </div>
  );
}
