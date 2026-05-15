"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { BellRing, Landmark, MessageSquare } from "@repo/ui/icons";

export default function DriverHeader() {
  const pathname = usePathname();
  const router = useRouter();

  // Navigation Logic
  const isHome = pathname === "/home" || pathname === "/";
  const isProfileOrSettings = pathname?.includes("/profile") || pathname?.includes("/settings");
  const isHidden = pathname?.includes("/history") || pathname?.includes("/wallet") || pathname?.includes("/messages");

  if (isHidden) return null;

  // Header Style Mapping based on Customer App Parity
  const headerStyles = isHome
    ? {
      container: "bg-[#F7F7F7]/70 backdrop-blur-sm border-b border-white/20 rounded-b-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.09)] p-3",
      button: "bg-white/70 border-white/20 text-gray-800",
      logo: "text-gray-500",
      logoDot: "text-gray-400",
      earnings: "bg-white/20 border-white/20 text-gray-900"
    }
    : {
      container: "backdrop-blur-xl [mask-image:linear-gradient(to_bottom,black_70%,transparent)] p-3 md:p-6", // Exact Customer Profile Header Style
      button: "bg-gray-100 border-gray-200 text-gray-900",
      logo: "text-gray-900",
      logoDot: "text-gray-700",
      earnings: "bg-gray-100 border-gray-200 text-gray-900"
    };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerStyles.container}`}
    >
      <div className="flex items-center justify-between">
        {/* Left Section: Menu-like behavior with Logo */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/messages")}
            className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-colors ${headerStyles.button}`}
          >
            <BellRing strokeWidth={2.3} className={`w-5 h-5 ${isHome ? 'text-gray-500' : 'text-gray-900'}`} />
          </motion.button>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h1 className={`text-2xl font-black font-anton tracking-tight ${headerStyles.logo}`}>
              my.<span className={headerStyles.logoDot}>Eatzy</span>
            </h1>
          </motion.div>
        </div>

        {/* Right Section: Earnings Display (Parity with Customer Cart/Order button) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col items-end pr-1"
        >
          <span className={`text-[9px] font-anton font-extrabold uppercase tracking-[0.2em] leading-none mb-0.5 ${isHome ? 'text-gray-400' : 'text-gray-400'}`}>Today's Income</span>
          <div className={`flex items-center gap-1 font-anton font-bold tracking-tighter leading-none ${isHome ? 'text-gray-600' : 'text-gray-800'}`}>
            <span className="text-md">1.285.000 ₫</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
