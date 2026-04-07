"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { 
  ChevronUp, Zap
} from "@repo/ui/icons";
import { PullToRefresh } from "@repo/ui";
import { useDriverProfile } from "@/features/profile/hooks/useDriverProfile";

export default function SettingsPage() {
  const { profile, updateProfile, isUpdating } = useDriverProfile();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Local states for settings
  const [autoAccept, setAutoAccept] = useState(true);
  const [codLimit, setCodLimit] = useState(profile?.codLimit || 2000000);

  useEffect(() => {
    if (profile?.codLimit) {
      setCodLimit(profile.codLimit);
    }
  }, [profile?.codLimit]);

  const handleRefresh = async () => {
    // Artificial delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  const handleUpdateCodLimit = () => {
    updateProfile({
      id: profile.id,
      codLimit: codLimit
    });
  };

  // Handle Scroll To Top button visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (Math.abs(diff) < 3) return;

      if (diff > 0 || currentScrollY < 400) {
        setShowScrollToTop(false);
      } else if (diff < -20) {
        setShowScrollToTop(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const isChanged = codLimit !== profile?.codLimit;

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className="h-screen flex flex-col bg-[#F7F7F7]"
    >
      <div className="h-full w-full flex flex-col bg-[#F7F7F7] overflow-hidden">
        {/* Main Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pt-20 md:pt-32"
        >
          <div className="max-w-2xl mx-auto px-3 pb-32">

            <div className="space-y-3">
              {/* Auto Accept Setting Card */}
              <div className="bg-white rounded-[40px] p-6 md:p-10 border border-transparent shadow-[0_0_25px_rgba(0,0,0,0.05)] flex items-center justify-between transition-all hover:shadow-[0_0_35px_rgba(0,0,0,0.08)] active:scale-[0.99]">
                <div className="flex items-center gap-6">
                  <div className="max-w-[200px] md:max-w-xs">
                    <p className="font-extrabold text-lg tracking-tight text-[#1A1A1A]">Tự động nhận đơn</p>
                    <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed">Hệ thống sẽ tự động gán đơn hàng mới cho bạn</p>
                  </div>
                </div>
                <div className="pl-4">
                  <Switch
                    active={autoAccept}
                    onToggle={() => setAutoAccept(!autoAccept)}
                  />
                </div>
              </div>

              {/* COD Limit Setting Card */}
              <div className="bg-white rounded-[40px] p-6 md:p-10 border border-transparent shadow-[0_0_25px_rgba(0,0,0,0.05)] space-y-10 transition-all hover:shadow-[0_0_35px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="font-extrabold text-lg tracking-tight text-[#1A1A1A]">Hạn mức tiền mặt (COD)</p>
                        <p className="text-xs text-gray-400 font-semibold mt-1 leading-relaxed">Giá trị đơn hàng tối đa bạn có thể nhận</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <span
                      className="text-3xl font-black text-[var(--primary)] tabular-nums tracking-tighter"
                      style={{ filter: 'drop-shadow(0 0 20px rgba(var(--primary-rgb), 0.2))' }}
                    >
                      {formatCurrency(codLimit)}
                    </span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="px-2">
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="100000"
                      value={codLimit}
                      onChange={(e) => setCodLimit(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-[var(--primary)] transition-all"
                    />

                    <div className="flex justify-between mt-4 text-[12px] font-bold text-gray-300 uppercase tracking-widest px-1">
                      <span>100.000₫</span>
                      <span>5.000.000₫</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={!isUpdating && isChanged ? { scale: 1.02 } : {}}
                    whileTap={!isUpdating && isChanged ? { scale: 0.98 } : {}}
                    disabled={isUpdating || !isChanged}
                    onClick={handleUpdateCodLimit}
                    className={`w-full py-5 rounded-[24px] font-bold text-sm shadow-2xl transition-all flex items-center justify-center gap-3 mt-4
                      ${isUpdating || !isChanged 
                        ? 'bg-gray-200 text-gray-900 shadow-none' 
                        : 'bg-[#1A1A1A] text-white shadow-black/20'}`}
                  >
                    {isUpdating ? (
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                    ) : null}
                    <span className="uppercase tracking-tight text-[13px]">
                      {isUpdating ? "Đang cập nhật..." : "Cập nhật hạn mức"}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Version Info */}
              <div className="pt-8 text-center opacity-20">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Eatzy Driver v1.0.4.STB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Scroll To Top Button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="fixed bottom-28 right-5 p-3.5 bg-[var(--primary)] text-white rounded-full shadow-xl shadow-[var(--primary)]/30 z-50 transition-colors"
            >
              <ChevronUp className="w-6 h-6" strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            background: #ffffff;
            border: 4px solid var(--primary);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            transform: scale(1.15);
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
          }
        `}</style>
      </div>
    </PullToRefresh>
  );
}

function Switch({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <div
      className={`w-14 h-7 rounded-full cursor-pointer transition-all relative shrink-0 ${active ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
      onClick={onToggle}
    >
      <motion.div
        animate={{ x: active ? 30 : 3 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-5 h-5 bg-white rounded-full shadow-lg"
      />
    </div>
  );
}
