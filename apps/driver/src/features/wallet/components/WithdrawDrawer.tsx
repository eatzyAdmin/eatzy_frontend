"use client";

import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, ChevronRight, CreditCard } from "@repo/ui/icons";
import { useState } from "react";
import { formatVnd } from "@repo/lib";
import { useSwipeConfirmation, useLoading, useNotification } from "@repo/ui";

export default function WithdrawDrawer({ open, onClose, balance }: { open: boolean, onClose: () => void, balance: number }) {
  const [amount, setAmount] = useState("");
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  const amounts = [500000, 1000000, 2000000];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-digits
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    setAmount(rawValue);
  };

  const formattedAmount = amount ? Number(amount).toLocaleString("de-DE") : "";

  const handleWithdraw = () => {
    if (!amount || Number(amount) <= 0) return;
    if (Number(amount) > balance) {
      showNotification({ message: "Số dư không đủ", type: "error", format: "Kiểm tra lại số tiền và thử lại!" });
      return;
    }

    confirm({
      title: "Xác nhận rút tiền",
      description: `Rút ${formatVnd(Number(amount))} về tài khoản Techcombank`,
      confirmText: "Trượt để xác nhận",
      onConfirm: () => {
        setTimeout(() => {
          showNotification({ message: "Yêu cầu rút tiền thành công", type: "success", format: `Rút thành công ${formatVnd(Number(amount))}` });
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
              <h2 className="text-2xl font-bold font-anton text-[#1A1A1A]">RÚT TIỀN</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                onClick={handleWithdraw}
                className={`w-full py-4 rounded-2xl font-bold text-2xl font-anton shadow-lg shadow-black/10 mt-4 transition-all ${!amount ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[var(--primary)] text-white'
                  }`}
                disabled={!amount}
              >
                CONFIRM WITHDRAW
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
