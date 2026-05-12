"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, ChevronRight, ChevronLeft, CreditCard, Wallet } from "@repo/ui/icons";
import { useState, useEffect } from "react";
import { formatVnd } from "@repo/lib";
import { useNotification, SwipeToConfirm, PullToRefresh } from "@repo/ui";

export default function WithdrawDrawer({ open, onClose, balance }: { open: boolean, onClose: () => void, balance: number }) {
  const [amount, setAmount] = useState("0");
  const { showNotification } = useNotification();
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  useEffect(() => {
    if (open) {
      setStep('input');
      setAmount("0");
      setIsProcessing(false);
      setIsCompleted(false);
    }
  }, [open]);

  const amountNumber = parseInt(amount) || 0;
  const MIN_LIMIT = 50000;

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
    if (nextAmountNum > balance) {
      setShakeKey(prev => prev + 1);
      return;
    }

    setAmount(nextAmountStr);
  };

  const handleNext = () => {
    if (amountNumber < MIN_LIMIT) {
      showNotification({ message: "Amount too small", type: "error", format: "Minimum withdrawal is 50.000đ" });
      return;
    }
    if (amountNumber > balance) {
      setShakeKey(prev => prev + 1);
      showNotification({ message: "Insufficient balance", type: "error", format: "Check your balance and try again!" });
      return;
    }
    setStep('confirm');
  };

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
  };

  const handleSwipeComplete = () => {
    setIsProcessing(true);
    setIsCompleted(true);
    setTimeout(() => {
      showNotification({ message: "Withdrawal request successful", type: "success", format: `Successfully withdrawn ${formatVnd(amountNumber)}` });
      onClose();
      setAmount("0");
    }, 1500);
  };

  const flashTap = { backgroundColor: "rgba(0,0,0,0.08)", scale: 0.96 };
  const canContinue = amountNumber >= MIN_LIMIT && amountNumber <= balance;

  return (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-[#F7F7F7] rounded-t-[32px] overflow-hidden h-[85vh] md:h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <div className="flex items-center gap-2">
                {step === 'confirm' && (
                  <button onClick={() => setStep('input')} className="p-1 -ml-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-6 h-6 text-black" />
                  </button>
                )}
                <h2 className="text-2xl font-bold font-anton text-[#1A1A1A]">
                  {step === 'input' ? "WITHDRAW" : "CONFIRM"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative flex flex-col">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="step-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col h-full"
                  >
                    <PullToRefresh onRefresh={handleRefresh} className="flex-1 no-scrollbar overflow-y-auto">
                      <div className="p-6 flex flex-col items-center">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full mb-4">
                          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Available Balance:</span>
                          <span className="text-[13px] font-extrabold text-[var(--primary)]">{formatVnd(balance)}</span>
                        </div>

                        <div className="flex items-start">
                          <motion.span
                            key={`amount-${shakeKey}`}
                            animate={{
                              x: shakeKey > 0 ? [-10, 10, -10, 10, 0] : 0,
                              color: shakeKey > 0 ? ["#ef4444", "#1A1A1A"] : "#1A1A1A"
                            }}
                            transition={{ duration: 0.4 }}
                            className="text-[64px] font-bold leading-none tracking-tighter"
                          >
                            {amountNumber.toLocaleString('vi-VN')}
                          </motion.span>
                          <span className="text-2xl font-bold text-gray-300 mt-2 ml-1">đ</span>
                        </div>

                        {amountNumber > balance && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs font-bold mt-2">
                            Insufficient balance to withdraw
                          </motion.p>
                        )}
                      </div>
                    </PullToRefresh>

                    {/* Footer / Keypad */}
                    <div className="mt-auto px-6 pb-8 space-y-4">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-tighter">
                            TECH
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1A1A]">Techcombank</p>
                            <p className="text-[11px] text-gray-500 font-medium">Ho Chi Minh Branch • **** 8829</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>

                      <motion.button
                        whileTap={canContinue ? { opacity: 0.8, scale: 0.98 } : {}}
                        disabled={!canContinue}
                        onClick={handleNext}
                        className={`w-full py-4 rounded-3xl text-[20px] font-anton font-bold tracking-tight transition-all shadow-lg ${canContinue
                          ? 'bg-[var(--primary)] text-white shadow-[var(--primary)]/20'
                          : 'bg-gray-200 text-gray-300 shadow-none'
                          }`}
                      >
                        CONTINUE
                      </motion.button>

                      {/* Keypad */}
                      <div className="grid grid-cols-3 gap-y-2 pt-2">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '000', 'DELETE'].map((key) => (
                          <motion.button
                            key={key}
                            whileTap={flashTap}
                            onClick={() => handleKeyPress(key)}
                            className="flex items-center justify-center p-3 outline-none relative rounded-2xl"
                          >
                            {key === 'DELETE' ? (
                              <div className="bg-[#1A1A1A] text-white w-12 h-8 rounded-full flex items-center justify-center shadow">
                                <X size={16} strokeWidth={3.5} />
                              </div>
                            ) : (
                              <span className={`text-[30px] font-extrabold text-gray-700 tracking-tight ${key === '000' ? 'text-[24px] mt-1' : ''}`}>
                                {key}
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 p-6 space-y-8 flex flex-col h-full"
                  >
                    <div className="text-center space-y-2 mt-8">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Withdrawal Amount</div>
                      <div className="text-5xl font-anton text-[#1A1A1A] tracking-tight">
                        {formatVnd(amountNumber)}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <span className="text-gray-500 font-medium">Recipient Account</span>
                        </div>
                        <span className="font-bold text-gray-900 text-right">TECH ***8829</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-lime-50 rounded-lg flex items-center justify-center text-lime-600">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <span className="text-gray-500 font-medium">Transaction Fee</span>
                        </div>
                        <span className="font-bold text-emerald-600 uppercase text-xs">Free</span>
                      </div>
                    </div>

                    <div className="mt-auto pb-10">
                      <SwipeToConfirm
                        text={isCompleted ? "Processing..." : "Slide to withdraw"}
                        onComplete={handleSwipeComplete}
                        disabled={isProcessing || isCompleted}
                        isLoading={isProcessing}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
