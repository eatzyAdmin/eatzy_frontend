"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, PiggyBank, Unlock, FilePen, FilePlus } from "lucide-react";
import SwipeToConfirm from "../primitives/SwipeToConfirm";

type ModalType = "warning" | "success" | "danger" | "info" | "update" | "add" | "unlock";

export function SwipeConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  description = "Vui lòng vuốt để xác nhận hành động này",
  confirmText = "Vuốt để xác nhận",
  type = "warning",
  icon,
  confirmDetails,
  isProcessing = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  type?: ModalType;
  icon?: React.ReactNode;
  confirmDetails?: Record<string, string | number | null | undefined> | null;
  isProcessing?: boolean;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsCompleted(false);
      setShowProcessing(false);
      setIsConfirming(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isProcessing && isCompleted) {
      const t = setTimeout(() => setShowProcessing(true), 50);
      return () => clearTimeout(t);
    } else if (!isProcessing) {
      setShowProcessing(false);
    }
  }, [isProcessing, isCompleted]);

  const handleConfirmComplete = () => {
    if (isConfirming) return;
    setIsCompleted(true);
    setIsConfirming(true);
    setTimeout(() => onConfirm && onConfirm(), 100);
  };

  const theme = useMemo(() => {
    switch (type) {
      case "success":
        return { accent: "text-emerald-600", ring: "ring-emerald-500", bg: "bg-emerald-50/10" };
      case "danger":
        return { accent: "text-red-600", ring: "ring-red-500", bg: "bg-red-50/10" };
      case "warning":
        return { accent: "text-amber-600", ring: "ring-amber-500", bg: "bg-amber-50/10" };
      default:
        return { accent: "text-blue-600", ring: "ring-blue-500", bg: "bg-blue-50/10" };
    }
  }, [type]);

  const IconComponent = useMemo(() => {
    switch (type) {
      case "success":
        return Check;
      case "danger":
      case "warning":
        return AlertTriangle;
      case "unlock":
        return Unlock;
      case "update":
        return FilePen;
      case "add":
        return FilePlus;
      default:
        return AlertTriangle;
    }
  }, [type]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative w-full max-w-md mx-2 sm:mx-0 bg-white/70 backdrop-blur-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/40`}
            initial={{ y: "100%", scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: "100%", scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-white/50 border border-white/40 ${theme.bg}`}>
                  {icon ?? <IconComponent className={theme.accent} size={24} />}
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/40 hover:bg-white/60 transition-all"
                disabled={isCompleted || isProcessing}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="text-gray-600">
                  <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="relative">
              {showProcessing ? (
                <motion.div className="p-10 flex flex-col items-center justify-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="p-4 rounded-2xl mb-6 bg-white/60 border border-white/40 animate-pulse">
                  <svg className="animate-spin" width="56" height="56" viewBox="0 0 24 24" style={{ color: "var(--primary)" }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
                    <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                </div>
                <p className="text-gray-700 text-center font-medium">Đang xử lý...</p>
                </motion.div>
              ) : (
                <motion.div className="p-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-gray-700 mb-6 text-center">{description}</p>
                {confirmDetails && (
                  <div className={`rounded-2xl p-5 mb-8 bg-white/50 border border-white/40 ${theme.bg}`}>
                    {Object.entries(confirmDetails).map(([label, value]) => (
                        <div key={label} className="flex justify-between items-center py-1">
                          <span className="text-gray-500 font-medium">{label}:</span>
                          <span className="font-semibold text-gray-700">{value as any}</span>
                        </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-center mb-3">
                  <SwipeToConfirm
                    onComplete={handleConfirmComplete}
                    text={isCompleted ? "Đã xác nhận!" : confirmText}
                    disabled={isCompleted || isProcessing}
                    type={type === "danger" ? "danger" : type === "success" ? "success" : type === "warning" ? "warning" : "info"}
                  />
                </div>
                <div className="text-sm text-gray-600 text-center">
                  {isCompleted ? "Đang chuẩn bị xử lý..." : "Vuốt nút sang phải để xác nhận"}
                </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SwipeConfirmationModal;