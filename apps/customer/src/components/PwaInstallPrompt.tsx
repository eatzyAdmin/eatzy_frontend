"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { X, Download, Share } from "@repo/ui/icons";
import { motion, AnimatePresence } from "@repo/ui/motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

declare global {
  interface Window {
    MSStream: unknown;
  }
  interface Navigator {
    standalone?: boolean;
  }
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIosDevice);

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (isStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Only show on login page
    if (pathname !== "/login") {
      setShowPrompt(false);
      return;
    }

    const isDismissed = sessionStorage.getItem("pwa_install_dismissed");
    if (isDismissed) return;

    // If we have a prompt (Android/Desktop) or if it's iOS (manual instructions)
    if (deferredPrompt || (isIOS && !window.matchMedia("(display-mode: standalone)").matches && !navigator.standalone)) {
      const timer = setTimeout(() => setShowPrompt(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [pathname, deferredPrompt, isIOS]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[999998]"
          />

          {/* Drawer Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[999999] bg-white rounded-t-[32px] p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.2)]"
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 shadow-sm shrink-0 overflow-hidden relative border border-gray-100">
                <Image
                  src="/icon-192x192.png"
                  alt="App Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold font-anton text-[#1A1A1A] leading-tight">
                  INSTALL APP
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                  Đặt món nhanh chóng và nhận ưu đãi độc quyền ngay trên điện thoại của bạn.
                </p>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {isIOS ? (
                <div className="w-full bg-blue-50 rounded-xl p-4 border border-blue-100 flex items-start gap-3">
                  <div className="mt-0.5 text-blue-500 shrink-0">
                    <Share className="w-5 h-5" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Dành cho iOS:</p>
                    <p className="opacity-90 leading-tight">
                      Nhấn vào nút <span className="font-bold">Chia sẻ</span> bên dưới trình duyệt, sau đó chọn <span className="font-bold">&quot;Thêm vào Màn hình chính&quot;</span>.
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 rounded-2xl bg-[var(--primary)] hover:opacity-90 text-white text-2xl font-bold shadow-lg shadow-[var(--primary)]/30 active:scale-95 transition-all flex items-center justify-center gap-2 font-anton tracking-wide"
                >
                  <Download className="w-5 h-5" />
                  INSTALL NOW
                </button>
              )}

              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
