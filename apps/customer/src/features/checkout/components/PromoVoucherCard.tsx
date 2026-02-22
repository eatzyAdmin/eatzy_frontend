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
        relative w-full text-left p-3 md:p-4 rounded-[28px] border-2 transition-all duration-300 group flex items-center gap-4
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
      {/* Best Choice Badge (EXACT miniaturized SwipeToConfirm Loading UI - Gold Edition) */}
      {isBest && !disabled && (
        <div className="absolute -top-3 md:-top-2 left-4">
          <div
            className="relative flex items-center rounded-xl h-[22px] px-3 select-none overflow-hidden shadow-sm"
            style={{
              background: 'linear-gradient(to right, #FBBF24, #FDE047)', // Brighter, fresher gold matching the primary blue's vibrancy
            }}
          >
            {/* Native Shimmer Overlay Effect from SwipeToConfirm */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer-swipe 3s infinite linear'
              }}
            />

            <div className="relative flex items-center gap-1.5">
              {/* Spinner exactly from SwipeToConfirm UI package but scaled down */}
              <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                Best choice
              </span>
            </div>
          </div>
        </div>
      )}

      {/* usage multiplier badge (shopee-style - floating on edge) */}
      {typeof voucher.remainingUsage === 'number' && (
        <div className="absolute -top-1 -right-2">
          <div className="bg-[#FFF1F1] text-[#EE4D2D] text-[12px] font-anton font-bold px-2 py-0.5 rounded-lg border border-[#FFDADA] shadow-md flex items-center justify-center min-w-[32px] transform rotate-[10deg] hover:rotate-0 transition-transform duration-300">
            x{voucher.remainingUsage}
          </div>
        </div>
      )}

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
        {/* Primary Info: Discount Amount/Value */}
        {discountInfo ? (
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`text-[17px] font-bold tracking-tight transition-all leading-tight ${disabled
              ? 'text-gray-400'
              : isFreeship ? 'text-blue-600' : 'text-[var(--primary)]'
              }`}>
              {discountInfo}
            </h4>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className={`text-[15px] font-bold tracking-tight truncate transition-all ${disabled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
              {getTitle()}
            </h4>
          </div>
        )}

        {/* Secondary Info: Description/Code */}
        {discountInfo && (
          <div className={`text-[12px] font-medium text-gray-500 mb-1 line-clamp-1 transition-all ${disabled ? 'opacity-50' : ''}`}>
            {getTitle()}
          </div>
        )}

        <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
          {minText && (
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">
              {minText}
            </span>
          )}
          {minText && <div className="w-[3px] h-[3px] rounded-full bg-gray-300 flex-shrink-0" />}
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex-shrink-0">
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

// Add global styles for shimmer
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shimmer-swipe {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}
