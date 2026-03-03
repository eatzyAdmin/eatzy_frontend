"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { useEffect, useState, useRef } from "react";
import { useSwipeConfirmation, useLoading } from "@repo/ui";
import {
  User, CreditCard, ShieldCheck,
  LogOut, MapPin, Bell, HelpCircle,
  ArrowLeft
} from "@repo/ui/icons";
import { mockCustomerProfile } from "@/features/profile/data/mockProfileData";
import CustomerProfileCard from "@/features/profile/components/CustomerProfileCard";
import ProfileMenuItem from "@/features/profile/components/ProfileMenuItem";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useBottomNav } from "@/features/navigation/context/BottomNavContext";

import MagazineProfileContent from "@/features/profile/components/MagazineProfileContent";
import PersonalInfoSection from "@/features/profile/components/sections/PersonalInfoSection";
import SavedAddressesSection from "@/features/profile/components/sections/SavedAddressesSection";
import PaymentMethodsSection from "@/features/profile/components/sections/PaymentMethodsSection";

type MobileSection = 'personal' | 'addresses' | 'payment';

export default function ProfilePage() {
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { user } = useAuth();
  const { handleLogout: performLogout } = useLogout();
  const { setIsVisible: setBottomNavVisible } = useBottomNav();

  const [activeMobileSection, setActiveMobileSection] = useState<MobileSection | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Simulate loading finish on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Handle header and bottom nav visibility based on sub-page state
  useEffect(() => {
    if (activeMobileSection) {
      // Hide global elements
      setBottomNavVisible(false);
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: false } }));
    } else {
      // Show global elements
      setBottomNavVisible(true);
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    }

    return () => {
      setBottomNavVisible(true);
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    };
  }, [activeMobileSection, setBottomNavVisible]);

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
    phone: user?.phone || mockCustomerProfile.phone,
    email: user?.email || mockCustomerProfile.email,
  };

  const renderSubPage = () => {
    if (!activeMobileSection) return null;

    let title = "";
    let subtitle = "";
    let content = null;

    switch (activeMobileSection) {
      case 'personal':
        title = "PERSONAL INFO";
        subtitle = "Manage your biography and profile";
        content = <PersonalInfoSection profile={displayProfile} />;
        break;
      case 'addresses':
        title = "SAVED ADDRESSES";
        subtitle = "Your delivery locations";
        content = <SavedAddressesSection />;
        break;
      case 'payment':
        title = "WALLET & PAYMENT";
        subtitle = "Manage your balance and logic";
        content = <PaymentMethodsSection />;
        break;
    }

    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-[#F7F7F7] overflow-y-auto px-3"
        ref={scrollContainerRef}
      >
        <div className="max-w-xl mx-auto">
          {/* Header style matched to favorites/order-history - Sticky */}
          <div className="sticky top-0 z-50 bg-[#F7F7F7]/95 backdrop-blur-md py-4 mb-2 -mx-3 px-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveMobileSection(null)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center group flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-gray-900" />
              </button>
              <div>
                <h1 className="text-[32px] md:text-[56px] font-bold leading-tight text-[#1A1A1A] font-anton uppercase tracking-tight">
                  {title}
                </h1>
                <p className="text-sm font-medium md:text-base text-gray-500 mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-page Content */}
          <div className="pb-20">
            {content}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-8 md:pt-20 pb-24 md:pb-0 overflow-hidden">

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

      {/* Mobile Standard View */}
      <div className="md:hidden">
        <AnimatePresence>
          {!activeMobileSection ? (
            <motion.div
              key="main-profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto px-4 space-y-8 overflow-y-auto pt-10"
            >
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
                <div className="space-y-1">
                  <ProfileMenuItem
                    icon={<User className="w-5 h-5" />}
                    label="Thông tin cá nhân"
                    subLabel="Chỉnh sửa hồ sơ"
                    onClick={() => setActiveMobileSection('personal')}
                  />
                  <ProfileMenuItem
                    icon={<MapPin className="w-5 h-5" />}
                    label="Địa chỉ đã lưu"
                    subLabel="Nhà riêng, Công ty"
                    onClick={() => setActiveMobileSection('addresses')}
                  />
                  <ProfileMenuItem
                    icon={<CreditCard className="w-5 h-5" />}
                    label="Ví & Thanh toán"
                    subLabel="Nạp tiền, Lịch sử"
                    onClick={() => setActiveMobileSection('payment')}
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
            </motion.div>
          ) : (
            <div key="sub-page">
              {renderSubPage()}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
