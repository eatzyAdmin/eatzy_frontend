"use client";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, CheckCircle2 } from "@repo/ui/icons";
import type { PaymentMethod } from "@repo/types";
import { formatVnd } from "@repo/lib";
import { useState, useEffect } from "react";

interface PaymentMethodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  methods: { key: PaymentMethod; label: string; icon: React.ReactNode; color: string; sub: string }[];
  selectedValue: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  balance: number | null;
}

export default function PaymentMethodDrawer({
  isOpen,
  onClose,
  methods,
  selectedValue,
  onChange,
  balance,
}: PaymentMethodDrawerProps) {
  const [tempSelected, setTempSelected] = useState<PaymentMethod>(selectedValue);

  useEffect(() => {
    if (isOpen) {
      setTempSelected(selectedValue);
    }
  }, [isOpen, selectedValue]);

  const handleConfirm = () => {
    onChange(tempSelected);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Content */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="relative bg-white w-full rounded-t-[40px] overflow-hidden flex flex-col h-[60vh] max-h-[60vh] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <div>
                <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] uppercase leading-none">PAYMENT GATEWAY</h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase mt-2">
                  Secure Checkout • Select Method
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 px-4 space-y-6 no-scrollbar">

              {/* Selection List */}
              <div className="space-y-3">
                {methods.map((m) => {
                  const isSelected = tempSelected === m.key;
                  const isEatzyPay = m.key === 'EATZYPAY';

                  return (
                    <div
                      key={m.key}
                      onClick={() => setTempSelected(m.key)}
                      className={`
                        relative p-5 rounded-[28px] border-2 transition-all duration-300 flex items-center justify-between group cursor-pointer
                        ${isSelected
                          ? 'bg-lime-50/30 border-lime-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                          ${isSelected ? 'bg-white text-lime-600 shadow-sm' : 'bg-gray-50 text-gray-500'}
                        `}>
                          {m.icon}
                        </div>
                        <div>
                          <span className={`block text-[9px] font-bold uppercase mb-1 ${isSelected ? 'text-lime-600/60' : 'text-gray-500'}`}>
                            {isEatzyPay ? "Digital Wallet" : m.sub}
                          </span>
                          <span className={`block text-lg font-anton font-bold uppercase leading-none ${isSelected ? 'text-[#1A1A1A]' : 'text-gray-500'}`}>
                            {m.label}
                          </span>
                          {isEatzyPay && balance !== null && (
                            <span className={`block text-[14px] font-bold mt-1.5 ${isSelected ? 'text-lime-600' : 'text-gray-500'}`}>
                              Balance: {formatVnd(balance)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'bg-lime-500 text-white shadow-lg shadow-lime-200' : 'bg-gray-100 text-gray-300'}
                      `}>
                        {isSelected ? <CheckCircle2 size={24} /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Footer Action Button */}
            <div className="p-4 bg-white border-t border-gray-100">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                className="w-full py-4 rounded-[24px] bg-[#1A1A1A] text-white font-bold text-xl font-anton shadow-xl shadow-black/10 transition-all uppercase tracking-wider"
              >
                Confirm
              </motion.button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
