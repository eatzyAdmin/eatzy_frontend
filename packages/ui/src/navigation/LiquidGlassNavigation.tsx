import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Home, Wallet, Users, Receipt, PiggyBank, LineChart, Settings, Lock, LogOut } from "lucide-react";
import NavItem from "./NavItem";
import NavItemShimmer from "../feedback/shimmer/NavItemShimmer";
import ProfileShimmer from "../feedback/shimmer/ProfileShimmer";

export type MenuItem = { id: string; icon: React.ComponentType<any>; text: string; permission?: string; isLogout?: boolean };

export type LiquidGlassNavigationProps = {
  profileData?: { fullName: string; email: string };
  activeSection?: string;
  onSectionChange?: (id: string) => void;
  onProfileClick?: () => void;
  customerMenuItems?: MenuItem[];
  adminMenuItems?: MenuItem[];
  onLogout?: () => void;
  customerSectionTitle?: string;
  adminSectionTitle?: string;
  logoutText?: string;
  showAdminSection?: boolean;
  isLoadingDelayMs?: number;
  isEmployee?: boolean;
  permissions?: string[];
};

const LiquidGlassNavigation = ({
  profileData = { fullName: "Người dùng", email: "user@example.com" },
  activeSection = "overview",
  onSectionChange = () => {},
  onProfileClick = () => {},
  customerMenuItems = [
    { id: "overview", icon: Home, text: "Trang chủ" },
    { id: "deposits", icon: Wallet, text: "Quản lý tiền gửi" }
  ],
  adminMenuItems = [
    { id: "customers", icon: Users, text: "Quản lý khách hàng & tiền gửi" },
    { id: "employees", icon: User, text: "Quản lý nhân viên" },
    { id: "deposit-slips", icon: Receipt, text: "Tra cứu phiếu gửi tiền" },
    { id: "savings-products", icon: PiggyBank, text: "Quản lý sản phẩm tiết kiệm" },
    { id: "sales-reports", icon: LineChart, text: "Báo cáo doanh số" },
    { id: "settings", icon: Settings, text: "Cài đặt hệ thống" },
    { id: "permissions", icon: Lock, text: "Quản lý phân quyền" }
  ],
  onLogout = () => {},
  customerSectionTitle = "Dành cho khách hàng",
  adminSectionTitle = "Dành cho Quản trị viên",
  logoutText = "Đăng xuất",
  showAdminSection = true,
  isLoadingDelayMs = 500,
  isEmployee = false,
  permissions = []
}: LiquidGlassNavigationProps) => {
  const [navHovered, setNavHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, isLoadingDelayMs);
    return () => clearTimeout(timer);
  }, [isLoadingDelayMs]);

  const { filteredCustomerItems, filteredAdminItems, shouldShowCustomerSection, shouldShowAdminSection } = useMemo(() => {
    const filteredAdmin = adminMenuItems.filter(item => !item.permission || permissions.includes(item.permission));
    return {
      filteredCustomerItems: customerMenuItems,
      filteredAdminItems: filteredAdmin,
      shouldShowCustomerSection: !isEmployee,
      shouldShowAdminSection: isEmployee && showAdminSection
    };
  }, [customerMenuItems, adminMenuItems, showAdminSection, permissions, isEmployee]);

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === "logout") { onLogout(); } else { onSectionChange(sectionId); }
  };

  return (
    <>
      <style jsx>{`
        .liquid-glass-nav-item { position: relative; overflow: hidden; backdrop-filter: blur(10px); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 12px; margin-bottom: 8px; color: rgb(55, 65, 81); }
        .liquid-glass-nav-item:hover { background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(59,130,246,0.1) 100%) !important; transform: translateX(4px) scale(1.02); box-shadow: inset 0 0 24px 16px rgba(255,255,255,0.6), 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(59,130,246,0.1) !important; color: rgb(31,41,55); }
        .liquid-glass-nav-item.active { background: linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(147,51,234,0.1) 100%) !important; border: 1px solid rgba(59,130,246,0.3); box-shadow: inset 0 0 28px 20px rgba(255,255,255,0.7), 0 4px 20px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.3) !important; color: rgb(31,41,55); transform: translateX(2px); }
        .liquid-glass-container:hover .profile-section { box-shadow: inset 0 0 24px 16px rgba(255,255,255,0.6) !important; }
        .liquid-glass-scrollbar::-webkit-scrollbar { width: 0; background: transparent; transition: all 0.3s ease; }
        .liquid-glass-container:hover .liquid-glass-scrollbar::-webkit-scrollbar { width: 8px; }
        .liquid-glass-scrollbar::-webkit-scrollbar-track { background: rgba(55,65,81,0.1); border-radius: 10px; margin: 4px 0; }
        .liquid-glass-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, rgba(55,65,81,0.4) 0%, rgba(75,85,99,0.3) 100%); border-radius: 10px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: inset 0 0 8px 4px rgba(255,255,255,0.3); }
        .liquid-glass-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, rgba(55,65,81,0.6) 0%, rgba(75,85,99,0.5) 100%); box-shadow: inset 0 0 12px 6px rgba(255,255,255,0.4); }
        .liquid-glass-scrollbar { scrollbar-width: none; scrollbar-color: rgba(55,65,81,0.4) rgba(55,65,81,0.1); transition: scrollbar-width 0.3s ease; }
        .liquid-glass-container:hover .liquid-glass-scrollbar { scrollbar-width: thin; }
        .logout-item:hover { background: linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(220,38,127,0.1) 100%) !important; box-shadow: inset 0 0 24px 16px rgba(255,255,255,0.6), 0 8px 32px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 20px rgba(239,68,68,0.1) !important; color: rgb(239,68,68); }
        .liquid-glass-nav-item .nav-text { color: rgb(55,65,81); transition: color 0.3s ease; }
        .liquid-glass-nav-item:hover .nav-text, .liquid-glass-nav-item.active .nav-text { color: rgb(31,41,55); }
        .logout-item:hover .nav-text { color: rgb(239,68,68); }
      `}</style>
      <div className={`nav-container liquid-glass-container flex rounded-3xl flex-col transition-all duration-500 ease-out backdrop-blur-sm shadow-2xl ${navHovered ? "w-72 bottom-6 top-6" : "w-20 bottom-24 top-24"} fixed left-6 z-50 overflow-hidden`} style={{ background: navHovered ? "linear-gradient(135deg, rgba(30, 62, 98, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 51, 234, 0.08) 100%)" : "linear-gradient(135deg, rgba(30, 62, 98, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)", border: "1px solid rgba(255, 255, 255, 0.1)", boxShadow: navHovered ? "0 25px 45px rgba(0, 0, 0, 0.15), 0 0 80px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)" : "0 20px 35px rgba(0, 0, 0, 0.1), 0 0 40px rgba(59, 130, 246, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.15)" }} onMouseEnter={() => setNavHovered(true)} onMouseLeave={() => setNavHovered(false)}>
        <div className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-700" style={{ background: `radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.2) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`, filter: "blur(1px)", transform: navHovered ? "scale(1.1) rotate(2deg)" : "scale(1)", transition: "transform 0.8s ease-out" }} />
        {isLoading ? (
          <ProfileShimmer expanded={navHovered} />
        ) : (
          <motion.div className="profile-section relative flex items-center p-6 border-b border-white/30 cursor-pointer group transition-all duration-300 liquid-glass-nav-item shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.1)]" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)" }} onClick={onProfileClick} layoutId="profile-section">
            <div className="absolute inset-0 rounded-t-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)", backdropFilter: "blur(10px)" }} />
            {navHovered ? (
              <>
                <motion.div className="relative h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)]" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.2)" }} layoutId="profile-avatar">
                  <User size={22} className="text-gray-700 drop-shadow-sm" />
                </motion.div>
                <div className="relative ml-4">
                  <motion.p layoutId="profile-name" className="font-semibold text-sm text-gray-800 tracking-wide drop-shadow-sm whitespace-nowrap overflow-hidden text-ellipsis">{profileData.fullName}</motion.p>
                  <motion.p layoutId="profile-email" className="text-xs text-gray-600 drop-shadow-sm tracking-wide whitespace-nowrap overflow-hidden text-ellipsis">{profileData.email}</motion.p>
                </div>
              </>
            ) : (
              <motion.div className="relative h-12 w-12 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.3)]" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)", backdropFilter: "blur(15px)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
                <User size={22} className="text-gray-700 drop-shadow-sm" />
              </motion.div>
            )}
          </motion.div>
        )}
        <div className="relative flex-1 py-6 px-3 flex flex-col overflow-hidden">
          {shouldShowCustomerSection && (
            <>
              <div className={`${navHovered ? "px-4" : "text-center"} mb-4`}>
                <p className="text-xs text-gray-600 uppercase font-medium mb-3 drop-shadow-sm whitespace-nowrap overflow-hidden tracking-wider">{navHovered ? customerSectionTitle : "KH"}</p>
              </div>
              {isLoading ? (
                Array.from({ length: filteredCustomerItems.length }, (_, index) => (
                  <NavItemShimmer key={`customer-shimmer-${index}`} expanded={navHovered} index={index} />
                ))
              ) : (
                filteredCustomerItems.map((item) => {
                  const IconComponent = item.icon as any;
                  return (
                    <NavItem key={item.id} icon={<IconComponent size={20} className="text-gray-600" strokeWidth={2.3} />} text={item.text} expanded={navHovered} active={activeSection === item.id} onClick={() => handleSectionChange(item.id)} className="liquid-glass-nav-item shadow-[inset_0_0_20px_12px_rgba(255,255,255,0.5)]" />
                  );
                })
              )}
            </>
          )}
          {shouldShowAdminSection && (
            <>
              <div className={`mt-0 mb-4 ${navHovered ? "px-4" : "hidden text-center"}`}>
                <p className="text-xs text-gray-600 uppercase font-medium mb-3 drop-shadow-sm whitespace-nowrap overflow-hidden tracking-wider">{navHovered ? adminSectionTitle : "QTV"}</p>
              </div>
              <div className="liquid-glass-scrollbar overflow-y-auto flex-1 scroll-smooth" style={{ scrollbarWidth: "none", scrollbarColor: "rgba(34, 211, 238, 0.4) transparent" }}>
                {isLoading ? (
                  Array.from({ length: filteredAdminItems.length }, (_, index) => (
                    <NavItemShimmer key={`admin-shimmer-${index}`} expanded={navHovered} index={index + filteredCustomerItems.length} />
                  ))
                ) : (
                  filteredAdminItems.map((item) => {
                    const IconComponent = item.icon as any;
                    return (
                      <NavItem key={item.id} icon={<IconComponent size={20} className="text-gray-600" strokeWidth={2.3} />} text={item.text} expanded={navHovered} active={activeSection === item.id} onClick={() => handleSectionChange(item.id)} className="liquid-glass-nav-item shadow-[inset_0_0_20px_12px_rgba(255,255,255,0.5)]" />
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
        <div className="relative p-4 border-t border-white/30" style={{ background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)" }}>
          {isLoading ? (
            <NavItemShimmer expanded={navHovered} index={filteredCustomerItems.length + filteredAdminItems.length} />
          ) : (
            <NavItem icon={<LogOut size={20} className="text-gray-600" strokeWidth={2.3} />} text={logoutText} expanded={navHovered} active={activeSection === "logout"} onClick={() => handleSectionChange("logout")} className="liquid-glass-nav-item logout-item shadow-[inset_0_0_20px_12px_rgba(255,255,255,0.5)]" />
          )}
        </div>
      </div>
    </>
  );
};

export default LiquidGlassNavigation;