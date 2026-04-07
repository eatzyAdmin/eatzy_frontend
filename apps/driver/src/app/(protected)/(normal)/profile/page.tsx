"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { useSwipeConfirmation, useLoading } from "@repo/ui";
import {
  User, CreditCard, ShieldCheck,
  LogOut, Bike, Bell, HelpCircle,
  ArrowLeft, AlertCircle, Landmark
} from "@repo/ui/icons";
import { useState, useCallback, useEffect } from "react";
import DriverProfileCard from "@/features/profile/components/DriverProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { PullToRefresh } from "@repo/ui";
import { useDriverProfile } from "@/features/profile/hooks/useDriverProfile";
import PersonalInfoSection from "@/features/profile/components/sections/PersonalInfoSection";
import VehicleInfoSection from "@/features/profile/components/sections/VehicleInfoSection";
import BankInfoSection from "@/features/profile/components/sections/BankInfoSection";
import NotificationSettingsSection from "@/features/profile/components/sections/NotificationSettingsSection";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProfileSectionShimmer } from "@/features/profile/components/ProfileSectionShimmer";
import { useBottomNav } from "../context/BottomNavContext";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

type MobileSection = 'personal' | 'vehicle' | 'bank' | 'notifications';

export default function ProfilePage() {
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { user } = useAuth();
  const { profile, isLoading, isError, refresh } = useDriverProfile();
  const { handleLogout: performLogout } = useLogout();
  const { setIsVisible: setBottomNavVisible } = useBottomNav();

  const [activeMobileSection, setActiveMobileSection] = useState<MobileSection | null>(null);

  useMobileBackHandler(activeMobileSection !== null, () => {
    setActiveMobileSection(null);
  });

  // Handle BottomNav and body classes visibility based on sub-page state
  useEffect(() => {
    if (activeMobileSection) {
      setBottomNavVisible(false);
      document.body.classList.add('modal-open');
    } else {
      setBottomNavVisible(true);
      document.body.classList.remove('modal-open');
    }

    return () => {
      setBottomNavVisible(true);
      document.body.classList.remove('modal-open');
    };
  }, [activeMobileSection, setBottomNavVisible]);

  // Shared transition parameters from Customer App (synced)
  const pageTransition = {
    type: "spring",
    damping: 25,
    stiffness: 180,
    mass: 0.8
  };

  const handleRefresh = async () => {
    await refresh();
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

  const handleSubPageRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const renderSubPage = () => {
    if (!activeMobileSection) return null;

    return (
      <motion.div
        key="sub-page-outer-container"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={pageTransition}
        className="fixed inset-0 z-[200] bg-[#F7F7F7] overflow-hidden"
      >
        <motion.div
          key="standard-sub-content"
          initial={{ x: '-30%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={pageTransition}
          className="absolute inset-0 bg-[#F7F7F7] overflow-hidden px-3 h-full w-full"
        >
          <PullToRefresh
            onRefresh={handleSubPageRefresh}
            className="flex-1 no-scrollbar overflow-visible h-full"
            pullText="Kéo để làm mới"
            releaseText="Thả tay để làm mới"
            refreshingText="Đang làm mới"
          >
            <div className="max-w-xl mx-auto min-h-screen">
              {/* Header - Sticky */}
              <div className="sticky top-0 z-50 bg-[#F7F7F7]/95 backdrop-blur-md py-4 mb-2 -mx-3 px-3 max-md:[mask-image:linear-gradient(to_bottom,black_90%,transparent)]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveMobileSection(null)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
                  </button>
                  <div>
                    <h1 className="text-[32px] md:text-[56px] font-bold leading-tight text-[#1A1A1A] font-anton uppercase tracking-tight">
                      {activeMobileSection === 'personal' ? "PERSONAL INFO" : activeMobileSection === 'vehicle' ? "VEHICLE DETAILS" : activeMobileSection === 'bank' ? "BANKING DETAILS" : "NOTIFICATION SETTINGS"}
                    </h1>
                    <p className="text-sm font-medium md:text-base text-gray-500 mt-0.5">
                      {activeMobileSection === 'personal' ? "Manage your biography and profile" : activeMobileSection === 'vehicle' ? "Your registered vehicle information" : activeMobileSection === 'bank' ? "Manage your payment and withdrawal account" : "Configure how you receive app alerts"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sub-page Content */}
              <div className="pb-20">
                {isLoading ? (
                  <ProfileSectionShimmer type={activeMobileSection} />
                ) : isError ? (
                  <EmptyState
                    icon={AlertCircle}
                    title="Hệ thống đang bận"
                    description="Đã có lỗi xảy ra khi kết nối máy chủ. Vui lòng kiểm tra lại kết nối và thử lại sau ít phút."
                    buttonText="Thử lại"
                    onButtonClick={handleSubPageRefresh}
                    className="py-20"
                  />
                ) : !profile ? (
                  <EmptyState
                    icon={User}
                    title="Chưa kích hoạt hồ sơ"
                    description="Chúng tôi không tìm thấy hồ sơ tài xế liên kết với tài khoản này. Vui lòng liên hệ quản trị viên."
                    className="py-20"
                  />
                ) : (
                  <>
                    {activeMobileSection === 'personal' && <PersonalInfoSection profile={profile} />}
                    {activeMobileSection === 'vehicle' && <VehicleInfoSection profile={profile} />}
                    {activeMobileSection === 'bank' && <BankInfoSection profile={profile} />}
                    {activeMobileSection === 'notifications' && <NotificationSettingsSection />}
                  </>
                )}
              </div>
            </div>
          </PullToRefresh>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-8 pb-40 overflow-hidden relative">
      <AnimatePresence initial={false}>
        {!activeMobileSection ? (
          <motion.div
            key="main-profile"
            initial={{ x: '-30%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={pageTransition}
            className="absolute inset-0"
          >
            <PullToRefresh
              onRefresh={handleRefresh}
              className="max-w-xl mx-auto px-4 space-y-8 pt-[72px] pb-[120px] no-scrollbar overflow-visible"
              pullText="Kéo để làm mới"
              releaseText="Thả tay để làm mới"
              refreshingText="Đang làm mới"
            >
              <div className="space-y-8 pb-32">
                {/* Main Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <DriverProfileCard profile={profile} />
                </motion.div>

                {/* Account Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Tài khoản</h3>
                  <div className="space-y-1">
                    <ProfileMenuItem
                      icon={<User className="w-5 h-5" />}
                      label="Thông tin cá nhân"
                      subLabel="Chỉnh sửa hồ sơ"
                      onClick={() => setActiveMobileSection('personal')}
                    />
                    <ProfileMenuItem
                      icon={<Bike className="w-5 h-5" />}
                      label="Phương tiện"
                      subLabel={profile?.vehicle_type || "Chưa cập nhật"}
                      onClick={() => setActiveMobileSection('vehicle')}
                    />
                    <ProfileMenuItem
                      icon={<Landmark className="w-5 h-5" />}
                      label="Tài khoản ngân hàng"
                      subLabel={profile?.bank_name ? `${profile.bank_name} **** ${profile.bank_account_number?.slice(-4) || ''}` : "Chưa cập nhật"}
                      onClick={() => setActiveMobileSection('bank')}
                    />
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
                     <ProfileMenuItem 
                       icon={<Bell className="w-5 h-5" />} 
                       label="Cài đặt thông báo" 
                       subLabel="Tùy chỉnh các loại cảnh báo"
                       onClick={() => setActiveMobileSection('notifications')}
                     />
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
            </PullToRefresh>
          </motion.div>
        ) : (
          renderSubPage()
        )}
      </AnimatePresence>
    </div>
  );
}
