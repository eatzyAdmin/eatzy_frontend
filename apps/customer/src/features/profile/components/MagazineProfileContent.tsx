"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import {
  User, Wallet, ShieldCheck,
  MapPin, Bell, HelpCircle,
  LogOut, ChevronRight
} from "@repo/ui/icons";
import { ImageWithFallback, useHoverHighlight, HoverHighlightOverlay } from "@repo/ui";
import { ICustomerProfileDisplay } from "@repo/types";
import { mockCustomerProfile } from "../data/mockProfileData";
import { useCustomerProfile } from "../hooks/useCustomerProfile";
import { ProfileAvatarCardShimmer, PersonalInfoShimmer } from "@repo/ui";

// Import dynamic sections
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SavedAddressesSection from "./sections/SavedAddressesSection";
import PaymentMethodsSection from "./sections/PaymentMethodsSection";
import NotificationSettingsSection from "./sections/NotificationSettingsSection";
import SecurityPrivacySection from "./sections/SecurityPrivacySection";
import HelpCenterSection from "./sections/HelpCenterSection";

export default function MagazineProfileContent({ onLogout }: { onLogout: () => void }) {
  const [activeId, setActiveId] = useState("01");
  const { profile, isLoading } = useCustomerProfile();
  const { containerRef, rect, style, moveHighlight, clearHover } = useHoverHighlight<HTMLDivElement>();

  // Fallback to mock data if loading or error for display consistency, but we prefer real data
  const profileData: ICustomerProfileDisplay = profile ? {
    name: profile.user?.name || "Khách",
    email: profile.user?.email || "",
    phone: profile.user?.phoneNumber || "",
    profilePhoto: profile.user?.avatar || mockCustomerProfile.profilePhoto,
    membershipTier: "Standard", // Could be calculated from backend data if available
    dateOfBirth: profile.date_of_birth,
    hometown: profile.hometown,
    address: profile.user?.address,
    gender: profile.user?.gender,
    age: profile.user?.age
  } : mockCustomerProfile;

  const menuSections = [
    {
      title: "Cài đặt tài khoản",
      items: [
        { id: "01", icon: User, label: "Thông tin cá nhân" },
        { id: "02", icon: MapPin, label: "Địa chỉ đã lưu" },
        { id: "03", icon: Wallet, label: "Ví & Thanh toán" },
      ]
    },
    {
      title: "Ứng dụng & Hỗ trợ",
      items: [
        { id: "04", icon: Bell, label: "Cài đặt thông báo" },
        { id: "06", icon: HelpCircle, label: "Trung tâm trợ giúp" },
      ]
    }
  ];

  const renderContent = () => {
    // Biography Tab
    if (activeId === "01") {
      if (isLoading && !profile) return <PersonalInfoShimmer />;
      return <PersonalInfoSection profile={profileData} />;
    }

    // Addresses Tab
    if (activeId === "02") {
      return <SavedAddressesSection />;
    }

    // Other tabs
    switch (activeId) {
      case "03": return <PaymentMethodsSection />;
      case "04": return <NotificationSettingsSection />;
      case "05": return <SecurityPrivacySection />;
      case "06": return <HelpCenterSection />;
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col md:grid md:grid-cols-[350px_1fr] gap-2 py-2 h-[calc(100vh-88px)]">

      {/* LEFT COLUMN: Sidebar Navigation */}
      <div className="flex flex-col h-full gap-2">
        {/* User Quick Info */}
        {isLoading ? (
          <ProfileAvatarCardShimmer />
        ) : (
          <div className="bg-white rounded-[32px] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex items-center gap-5 relative overflow-hidden group">

            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F7F7F7] shadow-xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                <ImageWithFallback src={profileData.profilePhoto} alt={profileData.name} fill className="object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-lime-500 text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg z-20">
                <ShieldCheck size={12} strokeWidth={3} />
              </div>
            </div>

            <div className="text-left relative z-10 min-w-0 flex-1">
              <h2 className="text-xl font-anton font-bold text-[#1A1A1A] leading-tight mb-1 truncate">{profileData.name}</h2>
              <div className="flex items-center gap-1.5 text-gray-400">
                <span className="text-[13px] font-medium truncate opacity-80">{profileData.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Card */}
        <div ref={containerRef} className="bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 relative flex-1 flex flex-col overflow-hidden">
          <HoverHighlightOverlay rect={rect} style={style} />

          {/* Scrollable Menu Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar pt-3 px-3">
            <div className="relative z-10 w-full space-y-1">
              {menuSections.map((section, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-5 py-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{section.title}</span>
                  </div>

                  {section.items.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      whileTap={{ scale: 0.96 }}
                      onMouseEnter={(e) => moveHighlight(e, {
                        borderRadius: 24,
                        backgroundColor: "rgba(0,0,0,0.04)",
                        scaleEnabled: false
                      })}
                      onMouseLeave={clearHover}
                      className={`w-full flex items-center gap-4 px-5 py-2 rounded-[24px] transition-all relative z-10 group active:scale-[0.96] ${activeId === item.id ? 'text-[#1A1A1A] bg-slate-100' : 'text-gray-500'
                        }`}
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${activeId === item.id ? 'bg-slate-200 text-black' : 'bg-slate-50 text-gray-400 group-hover:bg-slate-100 group-hover:text-[#1A1A1A]'
                        }`}>
                        <item.icon className="w-5 h-5" />
                      </div>

                      <span className={`flex-1 text-left text-base font-bold uppercase transition-all tracking-wide ${activeId === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`} style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
                        {item.label}
                      </span>

                      <ChevronRight className={`w-4 h-4 transition-all duration-300 ${activeId === item.id ? 'text-[#1A1A1A] translate-x-0' : 'text-gray-200 group-hover:text-gray-400 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                        }`} />
                    </motion.button>
                  ))}

                  {idx === 0 && <div className="h-px bg-gray-50 mx-4 my-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Bottom Area */}
          <div className="relative z-10 mt-auto p-3 bg-white">
            <div className="h-px bg-gray-100 mx-4 mb-2" />

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-5 py-3 rounded-[24px] text-red-500 hover:bg-red-50 transition-all group relative z-10"
              onMouseEnter={(e) => moveHighlight(e, {
                borderRadius: 24,
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                scaleEnabled: false
              })}
              onMouseLeave={clearHover}
            >
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center transition-all group-hover:bg-red-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-500/20">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left text-base font-bold uppercase tracking-tight" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
                Đăng xuất
              </span>
              <ChevronRight className="w-4 h-4 text-red-200 group-hover:translate-x-0 transition-all -translate-x-1 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Main Content Area */}
      <div className="flex-1 bg-white rounded-[44px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 p-8 h-full relative overflow-y-auto overflow-x-hidden no-scrollbar backdrop-blur-3xl">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full relative z-10"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
