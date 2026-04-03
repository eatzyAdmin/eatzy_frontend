"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { Home, History, Wallet, User, Settings as SettingsIcon } from "@repo/ui/icons";
import { useMobileExitGuard } from "@/hooks/useMobileExitGuard";
import { NormalLoadingProvider, NormalLoadingOverlay } from "./context/NormalLoadingContext";
import { BottomNavProvider, useBottomNav } from "./context/BottomNavContext";

function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = [
    { name: "History", id: "history", path: "/history", icon: History },
    { name: "Wallet", id: "wallet", path: "/wallet", icon: Wallet },
    { name: "Home", id: "home", path: "/home", icon: Home },
    { name: "Settings", id: "settings", path: "/settings", icon: SettingsIcon },
    { name: "Profile", id: "profile", path: "/profile", icon: User },
  ];

  return (
    <div className="pointer-events-auto backdrop-blur-xl text-black rounded-[32px] border border-white/40 px-2 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 flex items-center justify-between">
      {tabs.map((tab) => {
        const isActive = tab.path === "/home" ? (pathname === "/home" || pathname === "/") : pathname?.includes(tab.path);

        return (
          <motion.button
            key={tab.id}
            initial={false}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 180, damping: 10 }}
            onClick={() => router.replace(tab.path)}
            className="flex flex-col items-center justify-center flex-1 h-[60px] gap-0 outline-none select-none"
          >
            <div className={`flex items-center justify-center rounded-full transition-all duration-300 relative z-10
              ${tab.id === 'home'
                ? (isActive ? 'w-14 h-14 mx-3 bg-black text-white shadow-lg scale-110' : 'w-14 h-14 mx-3 bg-white/20 text-gray-400 shadow-md scale-110')
                : (isActive ? 'w-12 h-12 bg-black text-white shadow-md scale-110' : 'w-12 h-12 text-gray-400 active:bg-gray-200/50 active:scale-95')
              }`}
            >
              <div className="relative">
                <tab.icon className={tab.id === 'home' ? "w-7 h-7" : "w-6 h-6"} strokeWidth={2.5} />
              </div>
            </div>
            {tab.id !== 'home' && (
              <span className={`text-[10px] font-bold whitespace-nowrap text-gray-400 relative z-20 transition-all duration-300 ${isActive ? 'mt-1' : 'mt-[-5px]'}`}>
                {tab.name}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function AnimatedNavigation() {
  const { isVisible } = useBottomNav();

  return (
    <motion.div
      initial={{ y: 200, x: "-50%" }}
      animate={{ y: isVisible ? 0 : 200, x: "-50%" }}
      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
      className="fixed bottom-2 left-1/2 w-[95.5%] max-w-xl z-[50] pointer-events-none"
    >
      <Navigation />
    </motion.div>
  );
}

import DriverHeader from "@/features/layout/components/DriverHeader";

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useMobileExitGuard();

  const isHome = pathname === "/home" || pathname === "/";
  const isProfileOrSettings = pathname?.includes("/profile") || pathname?.includes("/settings");
  const isNoHeader = pathname?.includes("/history") || pathname?.includes("/wallet");

  return (
    <NormalLoadingProvider>
      <BottomNavProvider>
        <div className="fixed inset-0 overflow-hidden flex flex-col">
          <DriverHeader />
          <div className="flex-1 relative overflow-hidden">
            {children}
          </div>
          <NormalLoadingOverlay />
          <AnimatedNavigation />
        </div>
      </BottomNavProvider>
    </NormalLoadingProvider>
  );
}
