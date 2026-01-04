"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, ChevronRight, ChevronLeft } from "@repo/ui/icons";
import { useState, useEffect } from "react";
import { formatVnd } from "@repo/lib";
import { useNotification, SwipeToConfirm } from "@repo/ui";

export default function WithdrawDrawer({ open, onClose, balance }: { open: boolean, onClose: () => void, balance: number }) {
  const [amount, setAmount] = useState("");
  const { showNotification } = useNotification();
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep('input');
      setAmount("");
      setIsProcessing(false);
      setIsCompleted(false);
    }
  }, [open]);

  const amounts = [500000, 1000000, 2000000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    setAmount(rawValue);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("de-DE") : "";

  const handleNext = () => {
    if (!amount || Number(amount) <= 0) return;
    if (Number(amount) > balance) {
      showNotification({ message: "Số dư không đủ", type: "error", format: "Kiểm tra lại số tiền và thử lại!" });
      return;
    }
    setStep('confirm');
  };

  const handleSwipeComplete = () => {
    setIsProcessing(true);
    setIsCompleted(true);
    setTimeout(() => {
      showNotification({ message: "Yêu cầu rút tiền thành công", type: "success", format: `Rút thành công ${formatVnd(Number(amount))}` });
      onClose();
      setAmount("");
    }, 1500);
  };

  return (
    <AnimatePresence>
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
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {step === 'confirm' && (
                  <button onClick={() => setStep('input')} className="p-1 -ml-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="w-6 h-6 text-gray-700" />
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

            <div className="p-6 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="step-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Số dư khả dụng</p>
                      <p className="text-2xl font-bold font-anton text-[var(--primary)]">{formatVnd(balance)}</p>
                    </div>

                    {/* Bank Select Mock */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-[10px] text-white font-bold tracking-tighter">
                          TECH
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">Techcombank</p>
                          <p className="text-xs text-gray-500">**** 8829</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label className="text-sm font-bold text-[#1A1A1A] mb-2 block">Nhập số tiền</label>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formattedAmount}
                          onChange={handleAmountChange}
                          placeholder="0"
                          className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-4 text-2xl font-bold text-[#1A1A1A] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder:text-gray-300"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">đ</span>
                      </div>
                    </div>

                    {/* Quick select */}
                    <div className="flex gap-2">
                      {amounts.map((v) => (
                        <button
                          key={v}
                          onClick={() => setAmount(v.toString())}
                          className="flex-1 py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                        >
                          {formatVnd(v)}
                        </button>
                      ))}
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className={`w-full py-4 rounded-2xl font-bold text-2xl font-anton shadow-lg shadow-black/10 mt-4 transition-all ${!amount ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--primary)] text-white'
                        }`}
                      disabled={!amount}
                    >
                      CONTINUE
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2 mb-8">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Số tiền rút</div>
                      <div className="text-5xl font-anton text-[#1A1A1A] tracking-tight">
                        {formatVnd(Number(amount))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tài khoản nhận</span>
                        <span className="font-medium text-gray-900">Techcombank •••• 8829</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí giao dịch</span>
                        <span className="font-medium text-gray-900">0đ (Miễn phí)</span>
                      </div>
                      <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                        <span className="text-gray-500">Thời gian dự kiến</span>
                        <span className="font-bold text-green-600">Ngay lập tức</span>
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="flex items-center justify-center">
                        <SwipeToConfirm
                          text={isCompleted ? "Đang xử lý..." : "Trượt để rút tiền"}
                          onComplete={handleSwipeComplete}
                          disabled={isProcessing || isCompleted}
                          isLoading={isProcessing}
                        />              </div>
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
