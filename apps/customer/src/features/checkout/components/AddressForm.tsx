"use client";
import { motion } from "@repo/ui/motion";
import { MapPin } from "@repo/ui/icons";

export default function AddressForm({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
        <MapPin className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Delivery Address</h4>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lime-100 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Chưa chọn địa chỉ từ bản đồ"
              className="w-full bg-transparent outline-none text-[14px] font-bold text-[#1A1A1A] placeholder:text-gray-300 placeholder:font-normal px-0 py-2 border-b border-gray-100 focus:border-lime-500 transition-colors"
            />
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">
              Có thể cập nhật sau khi chọn trên bản đồ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
