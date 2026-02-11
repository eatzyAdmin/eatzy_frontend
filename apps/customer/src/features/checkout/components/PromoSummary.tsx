"use client";

import { Tag, ChevronRight } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";

interface PromoSummaryProps {
  selectedDiscountValue: number;
  selectedShippingValue: number;
  hasVoucher: boolean;
  onClick: () => void;
}

export default function PromoSummary({
  selectedDiscountValue,
  selectedShippingValue,
  hasVoucher,
  onClick,
}: PromoSummaryProps) {
  const totalSaved = selectedDiscountValue + selectedShippingValue;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 cursor-pointer hover:bg-gray-50 transition-all group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 transition-colors group-hover:bg-orange-100">
            <Tag size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[#1A1A1A] text-[15px]">Ưu đãi & Vouchers</h4>
            {hasVoucher ? (
              <p className="text-[13px] font-bold text-lime-600">
                Đã áp dụng, tiết kiệm {formatVnd(totalSaved)}
              </p>
            ) : (
              <p className="text-[13px] text-gray-400 font-medium">Chọn ưu đãi tốt nhất cho bạn</p>
            )}
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
}
