"use client";

import { Utensils } from "../icons";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export default function LoadingOverlay({ isLoading, message = "Đang tải..." }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-xl"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
            <div className="absolute inset-0" style={{
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%)"
            }} />
          </div>
          <motion.div
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-[92vw] max-w-md p-8 text-white"
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-white/20 rounded-full" />
                <div className="absolute inset-0 w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin" />
                <Utensils className="absolute inset-0 m-auto text-white" size={26} />
              </div>
              <div className="text-white/80 font-medium animate-pulse">{message}</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 transform -translate-x-full hover:translate-x-full rounded-3xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}