"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, CreditCard, Wallet } from "@repo/ui/icons";
import { useState } from "react";
import { formatVnd } from "@repo/lib";
import { useSwipeConfirmation, useNotification } from "@repo/ui";

export default function TopUpDrawer({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  const amounts = [100000, 200000, 500000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    setAmount(rawValue);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("de-DE") : "";

  const handleTopUp = () => {
    if (!amount || Number(amount) <= 0) return;

    confirm({
      title: "Xác nhận nạp tiền",
      description: `Nạp ${formatVnd(Number(amount))} vào ví tài xế`,
      confirmText: "Trượt để thanh toán",
      onConfirm: () => {
        setTimeout(() => {
          showNotification({ message: "Nạp tiền thành công", type: "success", format: `Nạp thành công ${formatVnd(Number(amount))}` });
          onClose();
          setAmount("");
        }, 1000);
      }
    });
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
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold font-anton text-[#1A1A1A]">TOP UP</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                onClick={handleTopUp}
                className={`w-full py-4 rounded-2xl font-bold font-anton text-2xl shadow-lg shadow-[var(--primary)]/30 mt-4 transition-all ${!amount ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--primary)] text-white'
                  }`}
                disabled={!amount}
              >
                CONTINUE
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
