"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Settings, ChevronUp } from "@repo/ui/icons";
import { EmptyState } from "@/components/ui/EmptyState";
import { useBottomNav } from "../context/BottomNavContext";
import { PullToRefresh } from "@repo/ui";

export default function SettingsPage() {
  const router = useRouter();
  const { setIsVisible } = useBottomNav();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleRefresh = async () => {
    // Artificial delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  // Auto-hide bottom nav on scroll and handle Scroll To Top button visibility
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentScrollY = container.scrollTop;
      const diff = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (Math.abs(diff) < 3) return;

      // 1. Bottom Nav visibility
      if (diff > 5 && currentScrollY > 20) {
        setIsVisible(false);
      } else if (diff < -5) {
        setIsVisible(true);
      }

      // 2. Scroll to top button visibility (threshold 400px)
      if (diff > 0 || currentScrollY < 400) {
        setShowScrollToTop(false);
      } else if (diff < -20) {
        setShowScrollToTop(true);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [setIsVisible]);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className="h-screen flex flex-col bg-[#F7F7F7]"
    >
      <div className="h-full w-full flex flex-col bg-[#F7F7F7] overflow-hidden">
        {/* Main Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto no-scrollbar scroll-smooth pt-24"
        >
          <div className="max-w-2xl mx-auto px-3 relative">

            {/* Header Area - Replicating History/Wallet Pattern */}
            {/* <div className="flex items-center gap-4 py-3 pb-0 pt-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <div>
                <h1
                  className="text-[32px] font-bold leading-tight text-[#1A1A1A]"
                  style={{
                    fontStretch: "condensed",
                    letterSpacing: "-0.01em",
                    fontFamily: "var(--font-anton), var(--font-sans)",
                  }}
                >
                  SETTINGS
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-0.5">
                  Configure your application preferences
                </p>
              </div>
            </div> */}

            {/* Content Area - Placeholder with EmptyState */}
            <div className="py-20">
              <EmptyState
                icon={Settings}
                title="Coming Soon"
                description="Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau nhé!"
                className="py-12"
              />
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
        `}</style>
      </div>
    </PullToRefresh>
  );
}
