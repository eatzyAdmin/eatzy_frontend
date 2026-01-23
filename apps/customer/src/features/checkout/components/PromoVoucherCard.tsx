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
    if (voucher.title) return voucher.title;
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
        relative overflow-hidden rounded-[20px] p-4 transition-all duration-300 border
        ${disabled
          ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed'
          : selected
            ? 'bg-white border-lime-500 shadow-md ring-1 ring-lime-500 cursor-pointer'
            : 'bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-lime-200 cursor-pointer'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Left Icon Part */}
        <div className={`
          w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0
          ${disabled
            ? 'bg-gray-100 text-gray-400'
            : isFreeship
              ? 'bg-blue-50 text-blue-600'
              : 'bg-lime-50 text-lime-600'
          }
        `}>
          {isFreeship ? <Truck className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
        </div>

        {/* Middle Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`text-sm font-bold truncate ${disabled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
              {getTitle()}
            </h4>
            {isBest && !disabled && (
              <span className="bg-yellow-100 text-yellow-700 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                Best
              </span>
            )}
          </div>

          {/* Discount details */}
          {discountInfo && (
            <div className={`text-xs font-medium mb-1 line-clamp-1 ${disabled ? 'text-gray-400' : isFreeship ? 'text-blue-600' : 'text-[var(--primary)]'}`}>
              {discountInfo}
            </div>
          )}

          <div className="flex items-center gap-2">
            {minText && (
              <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                {minText}
              </span>
            )}
            <span className="text-[10px] font-medium text-gray-400">
              {voucher.endDate ? `HSD: ${new Date(voucher.endDate).toLocaleDateString('vi-VN')}` : 'No expiry'}
            </span>
          </div>

          {disabled && reason && (
            <div className="text-[10px] font-bold text-[var(--danger)] mt-1">{reason}</div>
          )}
        </div>

        {/* Right Selection */}
        <div className={`
          w-6 h-6 rounded-full border flex items-center justify-center transition-all flex-shrink-0
          ${selected
            ? 'bg-lime-500 border-lime-500 text-white'
            : 'bg-transparent border-gray-300'
          }
        `}>
          {selected && <Check className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
}
