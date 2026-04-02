"use client";

import { useIsMobile } from "../../../hooks/useIsMobile";
import { ImageWithFallback, useLoading } from "@repo/ui";
import { motion } from "@repo/ui/motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bike, Clock, CheckCircle, ShieldCheck, ChevronRight, ArrowLeft } from "@repo/ui/icons";

export default function RegisterPageContent() {
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const router = useRouter();
  const { hide } = useLoading();

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  const handleBack = () => {
    router.push("/login");
  };

  const handleSuccess = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden selection:bg-lime-500 selection:text-black">
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-start lg:justify-center lg:pl-[50%]">
        <motion.div
          initial={isDesktop ? { opacity: 0, x: 20 } : { y: "100%" }}
          animate={{ y: 0, opacity: 1, x: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 150 }}
          className="w-full max-w-xl bg-white lg:bg-white rounded-none lg:rounded-[42px] p-4 lg:p-14 flex flex-col min-h-screen lg:min-h-0 lg:max-h-none overflow-y-auto no-scrollbar outline-none shadow-none"
        >
          {/* Header Section - Refined for mobile */}
          <div className="flex items-center gap-4 lg:gap-5 mb-8 lg:mb-12">
            {!isDesktop && (
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-black active:scale-95 transition-all shadow-sm border border-gray-100 flex-shrink-0"
              >
                <ArrowLeft size={18} strokeWidth={3} />
              </button>
            )}

            {isDesktop && (
              <div className="w-16 h-16 rounded-[24px] bg-lime-500 flex items-center justify-center border-4 border-white shadow-xl flex-shrink-0">
                <Bike className="w-8 h-8 text-white" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-3xl lg:text-5xl font-anton font-bold text-black tracking-tighter leading-none uppercase">JOIN THE FLEET</h1>
              <p className="text-gray-400 font-bold text-[9px] lg:text-[10px] mt-1 italic uppercase tracking-[0.3em]">Partner Registration Portal</p>
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10 flex-1">
            {/* Invitation text kept hidden per user's edit, but spacing remains consistent */}

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-3 lg:gap-5">
              <div className="bg-white rounded-[32px] lg:rounded-[40px] p-5 lg:p-7 border-2 border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:border-lime-200">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gray-50 shadow-sm flex items-center justify-center mb-4 lg:mb-5 border border-gray-100">
                  <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-lime-600" />
                </div>
                <h4 className="text-[9px] lg:text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] mb-1">FLEXIBILITY</h4>
                <div className="font-black text-black text-sm lg:text-lg uppercase tracking-tight">Your Way</div>
              </div>

              <div className="bg-white rounded-[32px] lg:rounded-[40px] p-5 lg:p-7 border-2 border-gray-100 shadow-sm flex flex-col items-center text-center transition-all hover:border-lime-200">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gray-50 shadow-sm flex items-center justify-center mb-4 lg:mb-5 border border-gray-100">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-lime-600" />
                </div>
                <h4 className="text-[9px] lg:text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] mb-1">EARNINGS</h4>
                <div className="font-black text-black text-sm lg:text-lg uppercase tracking-tight">Highest Pay</div>
              </div>
            </div>

            {/* Step Visualizer */}
            <div className="bg-white border-2 border-black rounded-[40px] lg:rounded-[48px] p-8 lg:p-10 text-black shadow-none relative overflow-hidden">
              <h4 className="text-[9px] lg:text-[10px] font-anton text-gray-400 uppercase tracking-[0.5em] text-center mb-8 lg:mb-10">ONBOARDING MISSION</h4>
              <div className="flex justify-between items-center relative gap-4">
                <div className="absolute left-8 lg:left-10 right-8 lg:right-10 top-5 lg:top-6 h-0.5 bg-black/10 z-0" />
                {[1, 2, 3].map((num) => (
                  <div key={num} className="relative z-10 flex flex-col items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-lime-500 text-black shadow-lg flex items-center justify-center font-anton text-lg lg:text-xl border-[3px] lg:border-4 border-black">
                      {num}
                    </div>
                    <span className="text-[8px] lg:text-[10px] font-black text-black/60 uppercase tracking-widest leading-none">
                      {num === 1 ? "PROFILE" : num === 2 ? "VERIFY" : "PROFIT"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Banner */}
            <div className="bg-gray-50 border-2 border-gray-100 p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] flex items-center gap-4 lg:gap-5 shadow-sm">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 border-2 border-gray-200">
                <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-lime-600" strokeWidth={2.5} />
              </div>
              <p className="text-[10px] lg:text-[11px] text-gray-700 leading-relaxed font-bold italic">
                Your partner security and data integrity are protected by Eatzy&apos;s advanced encryption portal.
              </p>
            </div>

            {/* Final Action Buttons */}
            <div className="pt-6 lg:pt-10 pb-10 lg:pb-6 space-y-4 lg:space-y-5">
              <button
                onClick={handleSuccess}
                className="w-full h-16 lg:h-20 bg-lime-500 text-black rounded-full font-black text-lg lg:text-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-lime-500/20 group"
              >
                <span className="font-anton font-extrabold uppercase trackin-wider">START MISSION</span>
                <ChevronRight size={24} strokeWidth={2.8} className="transition-transform group-hover:translate-x-2 pt-1" />
              </button>

              <button
                onClick={handleBack}
                className="w-full h-10 lg:h-12 rounded-full font-bold text-gray-500 hover:text-black transition-all flex items-center justify-center gap-2 uppercase text-[9px] lg:text-[10px] tracking-[0.4em] pt-0.5 lg:pt-1"
              >
                <ArrowLeft size={16} strokeWidth={3} />
                <span>Return to Portal</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
