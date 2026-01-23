"use client";
import { motion } from "@repo/ui/motion";
import type { PaymentMethod } from "@repo/types";
import { Wallet, CreditCard, Banknote, Check } from "@repo/ui/icons";

const METHODS: { key: PaymentMethod; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "EATZYPAY", label: "EatzyPay", icon: <Wallet className="w-5 h-5" />, color: "lime" },
  { key: "VNPAY", label: "VnPay", icon: <CreditCard className="w-5 h-5" />, color: "blue" },
  { key: "CASH", label: "Tiền mặt", icon: <Banknote className="w-5 h-5" />, color: "gray" },
];

export default function PaymentMethodSelector({ value, onChange }: { value: PaymentMethod; onChange: (m: PaymentMethod) => void }) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
        <CreditCard className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Payment Method</h4>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {METHODS.map((m, index) => {
            const isSelected = value === m.key;

            // Dynamic styles helper
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
                  relative cursor-pointer p-4 rounded-[20px] border transition-all duration-300 flex flex-col gap-3
                  ${getCardStyle()}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${getIconStyle()}`}>
                    {m.icon}
                  </div>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`w-6 h-6 rounded-full ${getCheckBg()} text-white flex items-center justify-center`}>
                      <Check className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </div>

                <div>
                  <div className={`text-[13px] font-bold ${isSelected ? 'text-[#1A1A1A]' : 'text-gray-600'}`}>{m.label}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    {m.key === 'EATZYPAY' ? 'E-Wallet' : m.key === 'VNPAY' ? 'QR Code' : 'COD'}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
