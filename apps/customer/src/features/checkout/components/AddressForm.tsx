"use client";
import { motion } from "@repo/ui/motion";
import { MapPin } from "@repo/ui/icons";

export default function AddressForm({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative bg-white rounded-[18px] p-5 border-2 border-dashed border-gray-200 shadow-sm">
      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="absolute -right-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Địa chỉ</div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 text-gray-500 flex items-center justify-center">
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Chưa chọn địa chỉ từ bản đồ"
            className="w-full bg-transparent outline-none text-[14px] px-0 py-2 border-b-2 border-dashed border-gray-300 focus:border-gray-500"
          />
          <motion.div className="text-[12px] text-[#555] mt-2">Có thể cập nhật sau khi chọn trên bản đồ</motion.div>
        </div>
      </div>
    </div>
  );
}
