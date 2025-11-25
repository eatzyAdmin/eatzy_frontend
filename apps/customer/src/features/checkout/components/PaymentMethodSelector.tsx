"use client";
import { motion } from "@repo/ui/motion";
import type { PaymentMethod } from "@repo/types";
import { Wallet, CreditCard, Banknote, Check } from "@repo/ui/icons";

const METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { key: "EATZYPAY", label: "EatzyPay", icon: <Wallet className="w-5 h-5" /> },
  { key: "VNPAY", label: "VnPay", icon: <CreditCard className="w-5 h-5" /> },
  { key: "CASH", label: "Tiền mặt", icon: <Banknote className="w-5 h-5" /> },
];

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  return (
    <div className="p-4">
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-2">Hình thức thanh toán</div>
      <div className="grid grid-cols-3 gap-3">
        {METHODS.map((m, index) => (
          <motion.div
            key={m.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(m.key)}
            className={`relative cursor-pointer p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${
              value === m.key
                ? 'border-[var(--primary)] bg-gradient-to-br from-[var(--secondary)]/10 to-[var(--primary)]/10 shadow-sm'
                : 'border-gray-200 bg-white hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${value === m.key ? 'bg-[var(--primary)] text-white' : 'bg-gray-100 text-gray-700'}`}>
                {m.icon}
              </div>
              <div>
                <div className="text-[13px] font-semibold text-[#1A1A1A]">{m.label}</div>
                <div className="text-[11px] text-[#666]">{m.key === 'EATZYPAY' ? 'Thanh toán Eatzy' : m.key === 'VNPAY' ? 'VnPay QR' : 'Thanh toán khi nhận hàng'}</div>
              </div>
              {/* Background icon */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <div className={`opacity-[0.1] transform scale-[4.5] translate-y-6 translate-x-12 ${value === m.key ? 'text-[var(--primary)]' : 'text-gray-500'}`}>
                  {m.icon}
                </div>
              </div>
            </div>
            {value === m.key && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-7 h-7 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
