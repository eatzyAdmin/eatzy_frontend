"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] bg-[#78C841] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Pattern (Subtle circles) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#B4E50D] rounded-full blur-3xl opacity-20" />
          </div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative z-10 flex flex-col items-center"
          >
            <div className="w-28 h-28 bg-white rounded-[28px] shadow-2xl flex items-center justify-center mb-8 rotate-3 transform transition-transform hover:rotate-0">
              <span className="font-anton text-[#78C841] text-5xl tracking-tighter">EZ</span>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h1 className="text-4xl font-anton text-white tracking-wide mb-1">
                EATZY
              </h1>
              <p className="text-white/80 text-sm font-medium tracking-widest uppercase">
                Discover Amazing Food
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-12"
          >
            <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
