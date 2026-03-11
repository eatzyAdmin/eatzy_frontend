"use client";
import { motion } from "@repo/ui/motion";
import { MapPin, ChevronRight, Lock } from "@repo/ui/icons";

export default function AddressForm({
  value,
  onChange,
  onClick,
  onOpenSaved,
}: {
  value: string;
  onChange: (v: string) => void;
  onClick?: () => void;
  onOpenSaved?: () => void;
}) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      {/* 📱 MOBILE VIEW (Visible on < 768px) */}
      <div
        className="md:hidden cursor-pointer hover:bg-gray-50/50 transition-all active:scale-[0.99]"
        onClick={onClick}
      >
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h4 className="font-bold text-[#1A1A1A]">Địa chỉ giao hàng</h4>
          </div>
        </div>

        <div className="p-4 pt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lime-100 text-[var(--primary)] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="py-2 border-b border-gray-100 min-h-[40px] flex items-center group">
                <span className={`text-[14px] font-bold ${value ? 'text-[#1A1A1A]' : 'text-gray-300'} flex-1 truncate`}>
                  {value || "Chọn địa chỉ giao hàng của bạn"}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
              <div className="mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Nhấn để tìm kiếm địa chỉ trên bản đồ
              </div>
            </div>
          </div>
        </div>
      </div>

    <div className="hidden md:block bg-gray-50/20 cursor-default">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-300" />
            <h4 className="font-bold text-gray-400">Địa chỉ giao hàng</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-2 px-4 py-1.5 bg-[var(--primary)] text-white hover:bg-lime-600 transition-all rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm active:scale-95"
            >
              <MapPin size={12} className="text-white" />
              DÙNG ĐỊA CHỈ ĐÃ LƯU
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <Lock size={12} className="text-gray-300" />
              Cố định trên Map
            </div>
          </div>
        </div>

        <div className="p-5 pt-0">
          <div className="flex items-center gap-3 mt-5">
            <div className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-300 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="py-2 border-b border-gray-100 min-h-[40px] flex items-center opacity-60">
                <span className="text-[14px] font-bold text-gray-500 truncate">
                  {value || "Chưa xác định vị trí"}
                </span>
              </div>
              <div className="mt-2 text-[12px] font-bold italic flex items-start gap-1.5 text-lime-500">
                <div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1 animate-pulse flex-shrink-0" />
                <span>Vui lòng thay đổi vị trí trên bản đồ ở cột bên phải</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
