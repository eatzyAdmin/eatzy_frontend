"use client";

import { motion } from "@repo/ui/motion";
import { ChevronRight, Bike } from "@repo/ui/icons";
import { useRouter } from "next/navigation";

interface MobileRegisterDrawerProps {
  onBackToLogin: () => void;
}

export default function MobileRegisterDrawer({ onBackToLogin }: MobileRegisterDrawerProps) {
  const router = useRouter();

  return (
    <motion.div
      key="register-drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 150 }}
      className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] h-[55vh] justify-center items-center text-center space-y-8 outline-none"
    >
      <div className="w-20 h-20 bg-lime-100 flex items-center justify-center rounded-[32px] border-4 border-lime-200">
        <Bike size={40} className="text-lime-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">Become a Partner</h2>
        <p className="text-gray-400 font-medium italic px-6 leading-relaxed">Ready to join the fleet? Please visit our portal to complete your registration.</p>
      </div>

      <div className="w-full space-y-4">
        <button
          onClick={() => router.push("/register")}
          className="w-full h-16 bg-black text-white rounded-full font-black text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.15)]"
        >
          <span className="tracking-tight">Apply Now</span>
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        <button
          onClick={onBackToLogin}
          className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] pt-2 hover:text-black transition-colors"
        >
          Return to Login
        </button>
      </div>
    </motion.div>
  );
}
