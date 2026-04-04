"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { useEffect, useState, useRef, useCallback } from "react";
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
import { PullToRefresh } from "@repo/ui";
import { useCustomerProfile } from "@/features/profile/hooks/useCustomerProfile";
import { useCustomerAddresses } from "@/features/profile/hooks/useCustomerAddresses";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

import MagazineProfileContent from "@/features/profile/components/MagazineProfileContent";
import PersonalInfoSection from "@/features/profile/components/sections/PersonalInfoSection";
import SavedAddressesSection from "@/features/profile/components/sections/SavedAddressesSection";
import PaymentMethodsSection from "@/features/profile/components/sections/PaymentMethodsSection";
import WalletManageView from "@/features/profile/components/sections/WalletManageView";
import { useCustomerWalletTransactions } from "@/features/profile/hooks/useCustomerWalletTransactions";

type MobileSection = 'personal' | 'addresses' | 'payment';

export default function ProfilePage() {
  const { confirm } = useSwipeConfirmation();
  const { show, hide } = useLoading();
  const { user, refreshUser } = useAuth();
  const { profile, isLoading: isProfileLoading, refresh: refreshProfile } = useCustomerProfile();
  const { refresh: refreshAddresses } = useCustomerAddresses();
  const { refresh: refreshWallet } = useCustomerWalletTransactions();
  const { handleLogout: performLogout } = useLogout();
  const { setIsVisible: setBottomNavVisible } = useBottomNav();

  const [activeMobileSection, setActiveMobileSection] = useState<MobileSection | null>(null);
  const [walletView, setWalletView] = useState<'main' | 'topup' | 'withdraw'>('main');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useMobileBackHandler(activeMobileSection !== null || walletView !== 'main', () => {
    if (walletView !== 'main') {
      setWalletView('main');
    } else {
      setActiveMobileSection(null);
    }
  });


  // Simulate loading finish on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Handle header, bottom nav, and modal-open class visibility based on sub-page state
  useEffect(() => {
    const isSubPageOpen = activeMobileSection !== null || walletView !== 'main';
    
    if (isSubPageOpen) {
      // Hide global elements and block app exit guard
      setBottomNavVisible(false);
      document.body.classList.add('modal-open');
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: false } }));
    } else {
      // Show global elements and re-enable app exit guard
      setBottomNavVisible(true);
      document.body.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    }

    return () => {
      setBottomNavVisible(true);
      document.body.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('searchHeaderVisibility', { detail: { visible: true } }));
    };
  }, [activeMobileSection, walletView, setBottomNavVisible]);

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
    name: user?.name || profile?.user?.name || mockCustomerProfile.name,
    email: user?.email || profile?.user?.email || mockCustomerProfile.email,
    phone: user?.phone || profile?.user?.phoneNumber || mockCustomerProfile.phone,
    profilePhoto: profile?.user?.avatar || mockCustomerProfile.profilePhoto,
    dateOfBirth: profile?.date_of_birth,
    hometown: profile?.hometown,
    address: profile?.user?.address,
    gender: profile?.user?.gender,
    age: profile?.user?.age,
  };

  // Shared transition parameters from Driver App
  const driverPageTransition = {
    type: "spring",
    damping: 25,
    stiffness: 180,
    mass: 0.8
  };

  const handleSubPageRefresh = useCallback(async () => {
    if (activeMobileSection === 'personal') {
      await refreshProfile();
    } else if (activeMobileSection === 'addresses') {
      await refreshAddresses();
    } else if (activeMobileSection === 'payment') {
      await refreshWallet();
    }
  }, [activeMobileSection, refreshProfile, refreshAddresses, refreshWallet]);

  const renderSubPage = () => {
    if (!activeMobileSection) return null;

    return (
      <motion.div
        key="sub-page-outer-container"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={driverPageTransition}
        className="fixed inset-0 z-[100] bg-[#F7F7F7] overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {activeMobileSection === 'payment' && walletView !== 'main' ? (
            <WalletManageView
              key="wallet-manage"
              // Pass a dummy balance or rely on internally fetched balance in ManageView if needed
              // But for optimal UX with cache, ManageView can also use the same hook
              balance={0} 
              onBack={() => setWalletView('main')}
              defaultType={walletView === 'topup' ? 'TOPUP' : 'WITHDRAW'}
            />
          ) : (
            <motion.div
              key="standard-sub-content"
              initial={{ x: '-30%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={driverPageTransition}
              className="absolute inset-0 bg-[#F7F7F7] overflow-hidden px-3 h-full w-full"
            >
              <PullToRefresh
                onRefresh={handleSubPageRefresh}
                className="flex-1 no-scrollbar overflow-visible"
                pullText="Kéo để làm mới"
                releaseText="Thả tay để làm mới"
                refreshingText="Đang làm mới"
              >
              <div className="max-w-xl mx-auto">
                {/* Header style matched to favorites/order-history - Sticky */}
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
                        {activeMobileSection === 'personal' ? "PERSONAL INFO" : activeMobileSection === 'addresses' ? "SAVED ADDRESSES" : "WALLET & PAYMENT"}
                      </h1>
                      <p className="text-sm font-medium md:text-base text-gray-500 mt-0.5">
                        {activeMobileSection === 'personal' ? "Manage your biography and profile" : activeMobileSection === 'addresses' ? "Your delivery locations" : "Manage your balance and transactions"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-page Content */}
                <div className="pb-20">
                  {activeMobileSection === 'personal' && <PersonalInfoSection profile={displayProfile} />}
                  {activeMobileSection === 'addresses' && <SavedAddressesSection />}
                  {activeMobileSection === 'payment' && (
                    <PaymentMethodsSection
                      onOpenManage={(type) => setWalletView(type === 'TOPUP' ? 'topup' : 'withdraw')}
                    />
                  )}
                </div>
                </div>
              </PullToRefresh>
            </motion.div>
          )}
        </AnimatePresence>
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
        <AnimatePresence initial={false}>
          {!activeMobileSection ? (
            <motion.div
              key="main-profile"
              initial={{ x: '-30%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={driverPageTransition}
              className="absolute inset-0"
            >
              <PullToRefresh
                onRefresh={refreshUser}
                className="max-w-7xl mx-auto px-4 space-y-8 pt-[72px] pb-[120px] no-scrollbar overflow-visible"
                pullText="Kéo để làm mới"
                releaseText="Thả tay để làm mới"
                refreshingText="Đang làm mới"
              >
                <div className="space-y-8 pb-10">
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
                </div>
              </PullToRefresh>
            </motion.div>
          ) : (
            renderSubPage()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
