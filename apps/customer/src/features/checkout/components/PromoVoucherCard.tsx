"use client";
import type { Voucher } from "@repo/types";
import { Tag, Percent, Truck, Check, Star } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";

interface PromoVoucherCardProps {
  voucher: Voucher;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  reason?: string;
  isBest?: boolean;
}

export default function PromoVoucherCard({
  voucher,
  selected,
  onSelect,
  disabled = false,
  reason,
  isBest = false,
}: PromoVoucherCardProps) {
  const isFreeship = voucher.discountType === 'FREESHIP';

  const getTitle = () => {
    if (voucher.description) return voucher.description;
    if (voucher.code) return `Voucher: ${voucher.code}`;
    if (isFreeship) return 'Miễn phí giao hàng';
    return `Giảm ${formatVnd(voucher.discountValue)}`;
  };

  // Get discount info text (shows discount value and max)
  const getDiscountInfo = () => {
    if (isFreeship) {
      if (voucher.maxDiscountAmount) {
        return `Tiết kiệm đến ${formatVnd(voucher.maxDiscountAmount)}`;
      }
      return 'Miễn phí vận chuyển đơn hàng';
    }

    if (voucher.discountType === 'PERCENTAGE') {
      if (voucher.maxDiscountAmount) {
        return `Giảm ${voucher.discountValue}% • Tối đa ${formatVnd(voucher.maxDiscountAmount)}`;
      }
      return `Giảm ${voucher.discountValue}%`;
    }

    if (voucher.discountType === 'FIXED' && voucher.discountValue) {
      return `Giảm ${formatVnd(voucher.discountValue)}`;
    }

    return null;
  };

  const discountInfo = getDiscountInfo();
  const minText = typeof voucher.minOrderValue === 'number' && voucher.minOrderValue > 0
    ? `Đơn từ ${formatVnd(voucher.minOrderValue)}`
    : undefined;

  const handleClick = () => {
    if (!disabled) onSelect();
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-full text-left p-3 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
        ${disabled
          ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
          : selected
            ? isFreeship
              ? 'bg-blue-50 border-blue-100 shadow-sm cursor-pointer'
              : 'bg-lime-50 border-lime-100 shadow-sm cursor-pointer'
            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50 cursor-pointer'
        }
      `}
    >
      {/* Icon Box */}
      <div className={`
        w-11 h-11 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300
        ${disabled
          ? 'bg-gray-200 text-gray-400'
          : selected
            ? isFreeship
              ? 'bg-blue-200 text-blue-700'
              : 'bg-lime-200 text-lime-700'
            : 'bg-gray-100 text-gray-400 group-hover:bg-white'
        }
      `}>
        {isFreeship ? <Truck size={20} strokeWidth={2.5} /> : <Tag size={20} strokeWidth={2.5} />}
      </div>

      {/* Middle Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className={`text-[15px] font-bold tracking-tight truncate transition-all ${disabled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
            {getTitle()}
          </h4>
          {isBest && !disabled && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200">
              <div className="w-1 h-1 rounded-full bg-amber-600 animate-pulse"></div>
              BEST
            </span>
          )}
        </div>

        {/* Discount details */}
        {discountInfo && (
          <div className={`text-[12px] font-bold tracking-tight mb-1 line-clamp-1 transition-all ${disabled ? 'text-gray-400' : isFreeship ? 'text-blue-600' : 'text-lime-600'}`}>
            {discountInfo}
          </div>
        )}

        <div className="flex items-center gap-3">
          {minText && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {minText}
            </span>
          )}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {voucher.endDate ? `HSD: ${new Date(voucher.endDate).toLocaleDateString('vi-VN')}` : 'NO EXPIRY'}
          </span>
        </div>

        {disabled && reason && (
          <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-red-100 mt-2 w-fit">
            {reason}
          </div>
        )}
      </div>

      {/* Checkmark Circle at the end */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
        ${disabled
          ? 'bg-gray-100 text-transparent scale-90'
          : selected
            ? isFreeship
              ? 'bg-blue-500 text-white scale-100 shadow-md shadow-blue-500/30'
              : 'bg-lime-500 text-white scale-100 shadow-md shadow-lime-500/30'
            : 'bg-gray-100 text-transparent scale-90 group-hover:border-gray-200'
        }
      `}>
        <Check size={16} strokeWidth={4} className={selected ? "opacity-100" : "opacity-0"} />
      </div>
    </div>
  );
}
