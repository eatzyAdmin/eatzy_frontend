"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { ChevronLeft, X, MoreHorizontal } from "@repo/ui/icons";
import { useState, useEffect, useMemo } from "react";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";
import { PullToRefresh } from "@repo/ui";

interface WalletManageViewProps {
  balance: number;
  onBack: () => void;
  onRefresh?: () => Promise<void>;
  defaultType?: 'TOPUP' | 'WITHDRAW';
}

export default function WalletManageView({
  balance,
  onBack,
  onRefresh,
  defaultType = 'TOPUP'
}: WalletManageViewProps) {
  useMobileBackHandler(true, onBack);
  const [activeType, setActiveType] = useState<'TOPUP' | 'WITHDRAW'>(defaultType);
  const [amount, setAmount] = useState<string>("0");
  const [shakeKey, setShakeKey] = useState(0);

  // Reset amount on tab change
  useEffect(() => {
    setAmount("0");
  }, [activeType]);

  const handleRefresh = async () => {
    if (onRefresh) await onRefresh();
    // Optional: Reset amount on refresh too for clean state
    setAmount("0");
  };

  const amountNumber = parseInt(amount) || 0;
  const MAX_LIMIT = 99999999;
  const MIN_LIMIT = 10000;

  // Natural number rounding (always down) for balance and limits
  const currentMax = activeType === 'TOPUP' ? MAX_LIMIT : Math.floor(Math.min(MAX_LIMIT, balance));

  // Dynamic Quick Amounts Logic
  const quickAmounts = useMemo(() => {
    if (amountNumber === 0) return [50000, 100000, 500000];

    // Find smallest k such that amountNumber * 10^k >= 10,000
    let k = 0;
    while (amountNumber * Math.pow(10, k) < 10000 && k < 10) {
      k++;
    }

    const results = [
      amountNumber * Math.pow(10, k),
      amountNumber * Math.pow(10, k + 1),
      amountNumber * Math.pow(10, k + 2)
    ];

    // Filter by max 8 digits
    return results.filter(val => Math.floor(val).toString().length <= 8 && val > amountNumber && val <= currentMax);
  }, [amountNumber, currentMax]);

  const triggerErrorAnimation = () => {
    setShakeKey(prev => prev + 1);
  };

  const handleKeyPress = (key: string) => {
    if (key === 'DELETE') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
      return;
    }

    let nextAmountStr = amount;
    if (key === '000') {
      if (amount === "0") return;
      nextAmountStr = amount + "000";
    } else {
      nextAmountStr = amount === "0" ? key : amount + key;
    }

    const nextAmountNum = parseInt(nextAmountStr);

    if (nextAmountNum > currentMax) {
      triggerErrorAnimation();
      return; // Block input
    }

    setAmount(nextAmountStr);
  };

  const canContinue = amountNumber >= MIN_LIMIT && amountNumber <= currentMax;

  const pageTransition = {
    type: "spring",
    damping: 25,
    stiffness: 180,
    mass: 0.8
  };

  const flashTap = { backgroundColor: "rgba(0,0,0,0.08)", scale: 0.96 };

  return (
    <motion.div
      key="wallet-manage-view"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={pageTransition}
      className="fixed inset-0 z-[100] bg-[#F7F7F7] flex flex-col overflow-hidden shadow-2xl"
    >
      {/* Full Page PullToRefresh - Wrapping header and content */}
      <PullToRefresh
        onRefresh={handleRefresh}
        className="flex-1"
        pullText="Kéo để cập nhật số dư"
        releaseText="Thả tay để cập nhật"
        refreshingText="Đang cập nhật..."
      >
        <div className="flex flex-col min-h-full pt-2 bg-[#F7F7F7] pb-40">
          {/* Header - Now moves with pull */}
          <div className="flex items-center justify-between px-2 h-14 relative z-[110]">
            <button onClick={onBack} className="flex items-center gap-1.5 group px-1">
              <ChevronLeft size={26} className="text-[#1A1A1A]" strokeWidth={2.5} />
              <span className="text-[17px] font-extrabold text-[#1A1A1A] tracking-tight">
                {activeType === 'TOPUP' ? 'Deposit' : 'Withdraw'}
              </span>
            </button>

            <div className="flex items-center bg-gray-100/70 rounded-full px-1.5 py-1.5 gap-0.5">
              <button className="px-2.5 py-0.5 text-gray-400">
                <MoreHorizontal size={18} />
              </button>
              <div className="w-[1px] h-3 bg-gray-300 mx-0.5" />
              <button onClick={onBack} className="px-2.5 py-0.5 text-gray-700">
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mt-4 px-12">
            <div className="bg-gray-200/30 p-0.5 rounded-full flex items-center w-full max-w-[280px]">
              <button
                onClick={() => setActiveType('TOPUP')}
                className={`flex-1 py-3 rounded-full text-[15px] font-bold transition-all ${activeType === 'TOPUP'
                  ? 'bg-white text-[var(--primary)] border-[2px] border-primary shadow-sm'
                  : 'text-gray-400'
                  }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setActiveType('WITHDRAW')}
                className={`flex-1 py-3 rounded-full text-[15px] font-bold transition-all ${activeType === 'WITHDRAW'
                  ? 'bg-white text-[var(--primary)] border-[2px] border-primary shadow-sm'
                  : 'text-gray-400'
                  }`}
              >
                Withdraw
              </button>
            </div>
          </div>

          {/* Info Label - Bolder natural amounts */}
          <div className="mt-8 px-6 flex flex-col items-center justify-center gap-1 text-[14px] font-semibold text-gray-600">
            <div className="flex items-center gap-1">
              <span>
                {activeType === 'TOPUP' ? 'Maximum ' : 'Balance: '}
                <span className="font-extrabold text-[#1A1A1A]">
                  {currentMax.toLocaleString('vi-VN')}đ
                </span>
              </span>
            </div>
          </div>

          {/* Amount Display */}
          <div className="mt-4 flex flex-col items-center relative">
            <div className="flex items-start">
              <motion.span
                key={`amount-${shakeKey}`}
                animate={{
                  x: shakeKey > 0 ? [-10, 10, -10, 10, 0] : 0,
                  color: shakeKey > 0 ? ["#ef4444", "var(--primary)"] : "var(--primary)"
                }}
                transition={{ duration: 0.4 }}
                className="text-[54px] font-bold leading-none tracking-tight"
              >
                {amountNumber.toLocaleString('vi-VN')}
              </motion.span>
              <span className="text-xl font-bold text-gray-300 mt-1 ml-1">đ</span>
            </div>

            {/* Error Messages */}
            <div className="h-6 mt-2">
              <AnimatePresence>
                {amountNumber > 0 && amountNumber < MIN_LIMIT && (
                  <motion.p
                    key="min-error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-red-500 text-[12px] font-bold"
                  >
                    Minimum amount is 10,000đ
                  </motion.p>
                )}
                {amountNumber >= currentMax && (
                  <motion.p
                    key="max-error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-red-500 text-[12px] font-bold"
                  >
                    Maximum limit reached
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Keypad Area */}
          <div className="mt-auto px-4 pb-8 flex flex-col gap-4">
            {/* Continue Action */}
            <motion.button
              whileTap={canContinue ? { opacity: 0.8, scale: 0.98 } : {}}
              disabled={!canContinue}
              className={`w-full py-3.5 rounded-3xl text-[18px] font-bold tracking-tight transition-all ${canContinue
                ? 'bg-[var(--primary)] text-white shadow shadow-blue-500/10'
                : 'bg-gray-200/30 text-gray-300 shadow-none'
                }`}
            >
              Continue
            </motion.button>

            {/* Dynamic Quick Amount Options */}
            <div className="flex gap-2.5 px-0.5">
              {quickAmounts.map(amt => (
                <motion.button
                  key={amt}
                  whileTap={flashTap}
                  onClick={() => setAmount(amt.toString())}
                  className="flex-1 py-2 rounded-2xl bg-gray-200/30 text-gray-700 font-extrabold text-[12px] transition-colors active:bg-gray-200"
                >
                  {amt.toLocaleString('vi-VN')}
                </motion.button>
              ))}
            </div>

            {/* Keypad with Flash Effect */}
            <div className="grid grid-cols-3 w-full max-w-[320px] mx-auto gap-y-2 pt-0">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '000', 'DELETE'].map((key) => (
                <motion.button
                  key={key}
                  whileTap={flashTap}
                  onClick={() => handleKeyPress(key)}
                  className="flex items-center justify-center p-3 outline-none relative rounded-2xl"
                >
                  {key === 'DELETE' ? (
                    <div className="bg-[var(--primary)] text-white w-12 h-8 rounded-full flex items-center justify-center shadow">
                      <X size={16} strokeWidth={3.5} />
                    </div>
                  ) : (
                    <span className={`text-[28px] font-extrabold text-gray-500 tracking-tight`}>
                      {key}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </PullToRefresh>
    </motion.div>
  );
}
