"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { History, Home, Heart, LogOut, User } from "@repo/ui/icons";
import { NavItem, NavItemShimmer, ProfileShimmer, useLoading, useSwipeConfirmation, STORAGE_KEYS } from "@repo/ui";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProtectedMenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();
  const params = useSearchParams();
  const { show } = useLoading();
  const { confirm } = useSwipeConfirmation();

  useEffect(() => {
    // Load user data from localStorage
    const loadUserData = () => {
      try {
        const currentUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUserStr) {
          const user = JSON.parse(currentUserStr);

          // Get customer profile
          const customersStr = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
          if (customersStr) {
            const customers = JSON.parse(customersStr);
            const customer = customers.find((c: any) => c.userId === user.id);

            setUserData({
              ...user,
              ...customer,
            });
          } else {
            setUserData(user);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
      setIsLoading(false);
    };

    const timer = setTimeout(loadUserData, 400);
    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = () => {
    show("Đang tải trang chủ...");
    const next = new URLSearchParams(params.toString());
    next.delete('q');
    router.replace(`/home`, { scroll: false });
    onClose();
  };

  const handleOrderHistoryClick = () => {
    show("Đang tải lịch sử đơn hàng...");
    router.push(`/order-history`);
    onClose();
  };

  const handleFavoritesClick = () => {
    show("Đang tải trang yêu thích...");
    router.push(`/favorites`);
    onClose();
  };

  const handleLogoutClick = () => {
    onClose();
    confirm({
      title: "Xác nhận đăng xuất",
      description: "Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?",
      confirmText: "Vuốt để đăng xuất",
      type: "danger",
      onConfirm: async () => {
        // Simulate 2 second loading
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear auth data
        localStorage.removeItem('access_token');
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

        // Show loading overlay
        show("Đang đăng xuất...");

        // Redirect to login page
        router.replace('/login');
      }
    });
  };

  const customerItems = [
    { id: "home", icon: Home, text: "Trang chủ", onClick: handleHomeClick },
    { id: "history", icon: History, text: "Lịch sử đơn hàng", onClick: handleOrderHistoryClick },
    { id: "favorites", icon: Heart, text: "Yêu thích", onClick: handleFavoritesClick },
    { id: "logout", icon: LogOut, text: "Đăng xuất", onClick: handleLogoutClick, isLogout: true },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            layoutId="menu-overlay"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 150, damping: 18 }}
            className="fixed z-[70] left-6 top-20 w-[260px] max-w-[92vw] rounded-3xl bg-white/8 backdrop-blur-xl border border-white/20 overflow-hidden"
          >

            {isLoading ? (
              <ProfileShimmer expanded={true} />
            ) : (
              <div className="relative flex items-center p-6 border-b border-white/10 text-white/90">
                <div className="relative h-12 w-12 rounded-2xl flex items-center justify-center shadow-[inset_0_0_12px_8px_rgba(255,255,255,0.2)] bg-white/10 border border-white/20">
                  {userData?.profilePhoto ? (
                    <img
                      src={userData.profilePhoto}
                      alt={userData.fullName || 'User'}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <User size={20} className="text-white/60" />
                  )}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <p className="font-semibold text-sm truncate">
                    {userData?.fullName || 'Người dùng'}
                  </p>
                  <p className="text-xs text-white/80 truncate">
                    {userData?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            )}

            <div className="relative flex-1 py-4 px-3 flex flex-col overflow-hidden">
              <div className="mb-3 px-4">
                <p className="text-xs text-white/70 uppercase font-medium">Dành cho khách hàng</p>
              </div>
              {isLoading ? (
                customerItems.map((_, idx) => <NavItemShimmer key={idx} expanded={true} index={idx} />)
              ) : (
                customerItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} onClick={item.onClick} className="cursor-pointer">
                      <NavItem
                        icon={<Icon size={20} className={item.isLogout ? "text-red-400" : "text-white"} />}
                        text={item.text}
                        expanded={true}
                        active={false}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}