"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, CreditCard, Wallet, ChevronLeft } from "@repo/ui/icons";
import { useState, useEffect } from "react";
import { formatVnd } from "@repo/lib";
import { useNotification, SwipeToConfirm } from "@repo/ui";

export default function TopUpDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
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

  const amounts = [100000, 200000, 500000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    setAmount(rawValue);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("de-DE") : "";

  const handleNext = () => {
    if (!amount || Number(amount) <= 0) return;
    setStep('confirm');
  };

  const handleSwipeComplete = () => {
    setIsProcessing(true);
    setIsCompleted(true);
    setTimeout(() => {
      showNotification({ message: "Nạp tiền thành công", type: "success", format: `Nạp thành công ${formatVnd(Number(amount))}` });
      onClose();
      setAmount("");
    }, 1000);
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
                  {step === 'input' ? "TOP UP" : "CONFIRM"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="step-input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Method Select Mock */}
                    <div>
                      <label className="text-sm font-bold text-[#1A1A1A] mb-3 block">Phương thức thanh toán</label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-[var(--primary)] relative overflow-hidden">
                          <div className="absolute top-0 right-0 bg-[var(--primary)] text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl">Đã chọn</div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-600">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A]">Chuyển khoản ngân hàng</p>
                              <p className="text-xs text-gray-500">Miễn phí giao dịch</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-600">
                              <Wallet className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1A1A1A]">Ví điện tử Momo</p>
                              <p className="text-xs text-gray-500">Liên kết ngay</p>
                            </div>
                          </div>
                        </div>
                      </div>
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
                      className={`w-full py-4 rounded-2xl font-bold font-anton text-2xl shadow-lg shadow-[var(--primary)]/30 mt-4 transition-all ${!amount ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--primary)] text-white'
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
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Số tiền nạp</div>
                      <div className="text-5xl font-anton text-[#1A1A1A] tracking-tight">
                        {formatVnd(Number(amount))}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phương thức</span>
                        <span className="font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí giao dịch</span>
                        <span className="font-medium text-gray-900">0đ (Miễn phí)</span>
                      </div>
                    </div>

                    <div className="py-4">
                      <div className="flex items-center justify-center">
                        <SwipeToConfirm
                          text={isCompleted ? "Đang xử lý..." : "Trượt để nạp tiền"}
                          onComplete={handleSwipeComplete}
                          disabled={isProcessing || isCompleted}
                          isLoading={isProcessing}
                        />
                      </div>
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
