"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "@repo/ui/motion";
import type { PaymentMethod } from "@repo/types";
import { Wallet, CreditCard, Banknote, Check, ChevronRight } from "@repo/ui/icons";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { formatVnd } from "@repo/lib";
import { TextShimmer } from "@repo/ui";
import PaymentMethodDrawer from "./PaymentMethodDrawer";

const METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode; color: string; sub: string }[] = [
  { key: "EATZYPAY", label: "EatzyPay", icon: <Wallet className="w-5 h-5" />, color: "lime", sub: "Ví điện tử" },
  { key: "VNPAY", label: "VnPay", icon: <CreditCard className="w-5 h-5" />, color: "blue", sub: "QR Code" },
  { key: "CASH", label: "By Cash", icon: <Banknote className="w-5 h-5" />, color: "lime", sub: "COD" },
];

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  const { balance, isLoading: isWalletLoading } = useWallet();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
        {/* 🟢 DESKTOP HEADER */}
        <div className="hidden md:flex px-6 py-5 border-b border-gray-50 items-center gap-2 bg-gray-50/30">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Payment Method</h4>
        </div>

        {/* 📱 MOBILE HEADER */}
        <div className="md:hidden px-4 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h4 className="font-bold text-[#1A1A1A]">Payment Method</h4>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-0.5 text-lime-600 font-bold text-[12px]"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 pt-0 pb-2 md:pt-5 md:pb-5">
          {/* 🟢 DESKTOP GRID */}
          <div className="hidden md:grid grid-cols-3 gap-3">
            {METHODS.map((m, index) => {
              const isSelected = value === m.key;

              const getCardStyle = () => {
                if (!isSelected) return 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm';
                if (m.color === 'gray') return 'bg-gray-50 border-gray-300 shadow-sm ring-1 ring-gray-200';
                return `bg-${m.color}-50 border-${m.color}-200 shadow-sm`;
              };

              const getIconStyle = () => {
                if (!isSelected) return 'bg-gray-100 text-gray-500';
                if (m.color === 'gray') return 'bg-[#1A1A1A] text-white';
                return `bg-${m.color}-100 text-${m.color}-700`;
              };

              const getCheckBg = () => {
                if (m.color === 'gray') return 'bg-[#1A1A1A]';
                return `bg-${m.color}-500`;
              };

              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChange(m.key)}
                  className={`
                    relative cursor-pointer p-4 rounded-[20px] border-2 transition-all duration-300 flex flex-col gap-3
                    ${getCardStyle()}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${getIconStyle()}`}>
                      {m.icon}
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className={`w-6 h-6 rounded-full ${getCheckBg()} text-white flex items-center justify-center`}
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex-1">
                    <div className={`text-[14px] font-bold ${isSelected ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{m.label}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                      {m.key === 'EATZYPAY' ? 'E-Wallet' : m.key === 'VNPAY' ? 'QR Code' : 'COD'}
                    </div>
                  </div>

                  {/* 🟢 Balance at bottom-right for EatzyPay Desktop */}
                  {m.key === 'EATZYPAY' && (
                    <div className="absolute bottom-4 right-4 text-right">
                      {isWalletLoading ? (
                        <TextShimmer width={70} height={18} className="rounded-full" />
                      ) : (
                        <div className={`text-[16px] font-bold font-anton tracking-tight ${isSelected ? 'text-lime-600' : 'text-gray-500'}`}>
                          {formatVnd(balance || 0)}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 📱 MOBILE HORIZONTAL LIST */}
          <div className="md:hidden mt-4">
            <div className="flex overflow-x-auto no-scrollbar gap-3 pb-3 -mx-4 px-4">
              {mounted && METHODS.map((m) => {
                const isSelected = value === m.key;
                const isEatzyPay = m.key === 'EATZYPAY';

                return (
                  <motion.button
                    layout
                    key={m.key}
                    onClick={() => onChange(m.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-[22px] border-2 
                      transition-all duration-300 shadow-sm shrink-0 min-w-[160px]
                      ${isSelected
                        ? 'bg-lime-50 border-lime-200 ring-1 ring-lime-100 shadow-lime-100/50'
                        : 'bg-white border-gray-200 hover:border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all duration-300 
                      shadow-sm
                      ${isSelected
                        ? 'bg-lime-500 text-white shadow-lime-200'
                        : 'bg-gray-100 text-gray-400 border border-gray-100'
                      }
                    `}>
                      {m.icon}
                    </div>

                    {/* Content like TableFilterBadges */}
                    <div className="flex flex-col -space-y-0.5 text-left min-w-0">
                      <span className={`text-[9px] font-black uppercase tracking-[0.1em] transition-colors truncate ${isSelected ? 'text-lime-600/70' : 'text-gray-400'}`}>
                        {isEatzyPay ? 'E-Wallet' : m.sub}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[13px] font-bold tracking-tight transition-colors truncate ${isSelected ? 'text-[#1A1A1A]' : 'text-gray-700'}`}>
                          {isEatzyPay ? (
                            isWalletLoading ? (
                              <TextShimmer width={70} height={16} className="bg-gray-200" />
                            ) : (
                              formatVnd(balance || 0).replace('₫', 'đ')
                            )
                          ) : m.label}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-lime-500 flex items-center justify-center shrink-0">
                            <Check className="text-white w-2.5 h-2.5" strokeWidth={5} />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE PAYMENT DRAWER */}
      <PaymentMethodDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        methods={METHODS}
        selectedValue={value}
        onChange={onChange}
        balance={balance}
      />
    </>
  );
}
