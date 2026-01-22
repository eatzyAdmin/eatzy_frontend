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
  isBest?: boolean; // Show "Tốt nhất" badge
}

export default function PromoVoucherCard({
  voucher,
  selected,
  onSelect,
  disabled = false,
  reason,
  isBest = false,
}: PromoVoucherCardProps) {
  // Backend uses: FREESHIP, PERCENTAGE, FIXED
  const isFreeship = voucher.discountType === 'FREESHIP';
  const isPercent = voucher.discountType === 'PERCENTAGE';
  const isFixed = voucher.discountType === 'FIXED';

  const expiryText = voucher.endDate
    ? new Date(voucher.endDate).toLocaleDateString('vi-VN')
    : undefined;

  const minText = typeof voucher.minOrderValue === 'number' && voucher.minOrderValue > 0
    ? `Đơn từ ${formatVnd(voucher.minOrderValue)}`
    : undefined;

  // Generate title based on discount type
  const getTitle = () => {
    // Always use description if available (from backend)
    if (voucher.description) return voucher.description;
    if (voucher.title) return voucher.title;

    if (isFreeship) {
      return 'Miễn phí giao hàng';
    } else if (isPercent) {
      return `Giảm ${voucher.discountValue}%`;
    } else if (isFixed) {
      return `Giảm ${formatVnd(voucher.discountValue)}`;
    }
    return 'Ưu đãi';
  };

  // Get discount info text (shows discount value and max)
  const getDiscountInfo = () => {
    if (isFreeship) {
      // Freeship - show max discount if available, otherwise show "Miễn phí vận chuyển"
      if (voucher.maxDiscountAmount) {
        return `Tiết kiệm đến ${formatVnd(voucher.maxDiscountAmount)}`;
      }
      return 'Miễn phí vận chuyển đơn hàng';
    }

    if (isPercent) {
      if (voucher.maxDiscountAmount) {
        return `Giảm ${voucher.discountValue}% • Tối đa ${formatVnd(voucher.maxDiscountAmount)}`;
      }
      return `Giảm ${voucher.discountValue}%`;
    }

    if (isFixed && voucher.discountValue) {
      if (voucher.maxDiscountAmount && voucher.maxDiscountAmount !== voucher.discountValue) {
        return `Giảm ${formatVnd(voucher.discountValue)} • Tối đa ${formatVnd(voucher.maxDiscountAmount)}`;
      }
      return `Giảm ${formatVnd(voucher.discountValue)}`;
    }

    return null;
  };

  // Get icon based on type
  const getIcon = () => {
    if (isFreeship) return <Truck className="w-5 h-5" />;
    if (isPercent) return <Percent className="w-5 h-5" />;
    return <Tag className="w-5 h-5" />;
  };

  // Get icon background color - freeship is blue, others are primary
  const getIconBg = () => {
    if (disabled) return 'bg-gray-300';
    if (isFreeship) return 'bg-blue-500'; // Blue for freeship
    return 'bg-[var(--primary)]'; // Primary (green) for percentage and fixed
  };

  // Get border color based on type - only colored when selected
  const getBorderColor = () => {
    if (disabled) return 'border-gray-200';
    if (!selected) return 'border-gray-300'; // Default gray when not selected
    if (isFreeship) return 'border-blue-500';
    return 'border-[var(--primary)]';
  };

  // Get type badge
  const getTypeBadge = () => {
    if (isFreeship) return { text: 'FREESHIP', bg: 'bg-blue-500' };
    if (isPercent) return { text: `${voucher.discountValue}%`, bg: 'bg-[var(--primary)]' };
    if (isFixed) return { text: formatVnd(voucher.discountValue), bg: 'bg-[var(--primary)]' };
    return null;
  };

  const handleClick = () => {
    if (!disabled) {
      onSelect();
    }
  };

  const discountInfo = getDiscountInfo();
  const typeBadge = getTypeBadge();

  return (
    <div
      className={`
        relative bg-white rounded-[18px] p-5 border-2 border-dashed shadow-sm 
        flex items-center gap-3 transition-all
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
        ${getBorderColor()}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl text-white flex items-center justify-center flex-shrink-0 ${getIconBg()}`}
      >
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`font-semibold text-[13px] line-clamp-1 ${disabled ? 'text-gray-400' : 'text-[#1A1A1A]'}`}>
          {getTitle()}
        </div>

        {/* Discount info line - shows value and max discount */}
        {discountInfo && (
          <div className={`text-[12px] font-medium mt-0.5 ${disabled ? 'text-gray-400' : isFreeship ? 'text-blue-600' : 'text-[var(--primary)]'}`}>
            {discountInfo}
          </div>
        )}

        <div className="text-[11px] text-[#888] mt-1">
          {minText && <span>{minText}</span>}
        </div>

        {disabled && reason && (
          <div className="text-[11px] text-red-500 mt-1">{reason}</div>
        )}

        {/* Code + HSD row at bottom */}
        <div className="flex items-center justify-between mt-1.5 gap-2">
          {voucher.code ? (
            <div className="text-[11px] text-gray-400 font-mono tracking-wider">
              Mã: {voucher.code}
            </div>
          ) : <div />}
          {expiryText && (
            <div className="text-[10px] text-gray-400 whitespace-nowrap">
              HSD: {expiryText}
            </div>
          )}
        </div>
      </div>

      {/* Selection indicator */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) onSelect();
        }}
        disabled={disabled}
        className={`
          w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0
          ${disabled
            ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
            : selected
              ? isFreeship ? 'border-blue-500 bg-blue-500' : 'border-[var(--primary)] bg-[var(--primary)]'
              : 'border-gray-300 bg-white hover:border-gray-400'
          }
        `}
      >
        {selected ? (
          <Check className="w-3.5 h-3.5 text-white" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-transparent" />
        )}
      </button>

      {/* Decorative notches */}
      <div className={`absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border ${disabled ? 'border-gray-200' : !selected ? 'border-gray-300' : isFreeship ? 'border-blue-500' : 'border-[var(--primary)]'}`} />
      <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#F7F7F7] rounded-full border ${disabled ? 'border-gray-200' : !selected ? 'border-gray-300' : isFreeship ? 'border-blue-500' : 'border-[var(--primary)]'}`} />

      {/* Type badge - ALWAYS show */}
      {typeBadge && (
        <div className={`absolute -top-2 left-4 px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${disabled ? 'bg-gray-400' : typeBadge.bg}`}>
          {typeBadge.text}
        </div>
      )}

      {/* Best badge */}
      {isBest && !disabled && (
        <div className="absolute -top-2 right-4 px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500 text-white flex items-center gap-0.5">
          <Star className="w-3 h-3" /> Tốt nhất
        </div>
      )}
    </div>
  );
}
