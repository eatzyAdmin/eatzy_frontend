"use client";
import type { Voucher } from "@repo/types";
import { Tag, Percent, Truck, Check, Star, ChevronRight, Store } from "@repo/ui/icons";
import { formatVnd } from "@repo/lib";
import Link from "next/link";

interface PromoVoucherCardProps {
  voucher: Voucher;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  reason?: string;
  isBest?: boolean;
  currentOrderValue?: number;
  restaurantSlug?: string;
}

export default function PromoVoucherCard({
  voucher,
  selected,
  onSelect,
  disabled = false,
  reason,
  isBest = false,
  currentOrderValue,
  restaurantSlug,
}: PromoVoucherCardProps) {
  const isFreeship = voucher.discountType === 'FREESHIP';

  const getIneligibleBenefitText = () => {
    if (isFreeship) {
      return `giảm đến ${formatVnd(voucher.maxDiscountAmount || 0)} phí ship`;
    }
    if (voucher.discountType === 'PERCENTAGE') {
      return `giảm ${voucher.discountValue}% giá món`;
    }
    return `giảm ${formatVnd(voucher.discountValue)} giá món`;
  };

  const missingAmount = (typeof currentOrderValue === 'number' && typeof voucher.minOrderValue === 'number')
    ? Math.max(0, voucher.minOrderValue - currentOrderValue)
    : null;

  const getTitle = () => {
    if (voucher.description) return voucher.description.toUpperCase();
    if (voucher.code) return `CODE: ${voucher.code}`;
    return isFreeship ? 'DELIVERY DISCOUNT' : 'ORDER DISCOUNT';
  };

  const handleClick = () => {
    if (!disabled) onSelect();
  };

  const primaryValue = isFreeship && voucher.maxDiscountAmount
    ? formatVnd(voucher.maxDiscountAmount)
    : isFreeship ? 'FREE SHIP' :
      voucher.discountType === 'PERCENTAGE' ? `${voucher.discountValue}%` :
        formatVnd(voucher.discountValue);

  const subValueInfo = isFreeship
    ? (voucher.maxDiscountAmount ? 'OFF SHIPPING' : null)
    : (voucher.discountType === 'PERCENTAGE' && voucher.maxDiscountAmount)
      ? `OFF FOOD, Up to ${formatVnd(voucher.maxDiscountAmount)}`
      : 'OFF FOOD';

  const minOrderText = typeof voucher.minOrderValue === 'number' && voucher.minOrderValue > 0
    ? `Min. Order ${formatVnd(voucher.minOrderValue)}`
    : 'No Min. Order';

  const showBestPanel = isBest && !disabled;
  const showReasonPanel = disabled && reason;

  return (
    <div className={`
      w-full group/voucher relative transition-all duration-500 mb-4
      ${showReasonPanel ? 'rounded-[28px] md:rounded-[32px] p-0' : ''}
    `}>
      {/* Best Match Badge - Back to original corner pill design */}
      {isBest && !disabled && (
        <div className="absolute -top-3 left-6 z-20">
          <div
            className="flex items-center justify-center rounded-full h-[22px] px-3 select-none overflow-hidden shadow-md relative"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            }}
          >
            <div
              className="absolute inset-0 z-0 opacity-40 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer-swipe 2s infinite linear'
              }}
            />
            <div className="relative flex items-center gap-1.5 h-full">
              <Star size={11} className="text-white fill-current flex-shrink-0" />
              <span className="text-[10px] font-bold text-white uppercase tracking-tight leading-none translate-y-[0.5px]">
                Best Match
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Card Component */}
      <div
        onClick={handleClick}
        className={`
          relative w-full text-left p-3.5 md:p-4 rounded-[28px] md:rounded-[32px] border-[3px] transition-all duration-500 group flex items-stretch gap-4 z-10 shadow-[0_0_15px_rgba(0,0,0,0.06)]
          ${disabled
            ? 'bg-gray-50 border-gray-100 cursor-not-allowed peer/inner'
            : selected
              ? isFreeship
                ? 'bg-blue-50 border-blue-400 cursor-pointer'
                : 'bg-lime-50 border-[var(--primary)] cursor-pointer'
              : 'bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
          }
        `}
      >
        {/* Usage Multiplier - Positioned relative to the inner card corner */}
        {typeof voucher.remainingUsage === 'number' && (
          <div className={`absolute -top-2 -right-1 z-10 transition-opacity duration-500 ${disabled ? 'opacity-50' : 'opacity-100'}`}>
            <div className="bg-black text-white font-anton font-bold text-[12px] px-2.5 py-0.5 rounded-xl border-2 border-black shadow-lg flex items-center justify-center">
              x{voucher.remainingUsage}
            </div>
          </div>
        )}

        {/* Main Content Area - WISE Layout */}
        {/* Main Content Area - WISE Layout */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
              ${selected
                ? isFreeship ? 'bg-blue-200 text-blue-700' : 'bg-lime-200 text-lime-800'
                : 'bg-gray-100 text-gray-400'}
              transition-colors duration-500
            `}>
              {isFreeship ? <Truck size={16} strokeWidth={3} /> : <Tag size={16} strokeWidth={3} />}
            </div>
            <span className={`text-[10px] font-extrabold uppercase tracking-[0.05em] ${disabled ? 'text-gray-400 opacity-60' : 'text-gray-400'}`}>
              {getTitle()}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <h4 className={`
              font-anton font-normal text-2xl md:text-3xl leading-none tracking-tight transition-all
              ${isFreeship ? 'text-blue-600' : 'text-[var(--primary)]'} ${disabled ? 'opacity-40' : 'opacity-100'}
            `}>
              {primaryValue}
            </h4>
            {subValueInfo && (
              <span className={`text-[13px] font-extrabold ${isFreeship ? 'text-blue-300' : 'text-[var(--primary)]'} ${disabled ? 'opacity-30' : 'opacity-70'}
                `}>
                {subValueInfo}
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
            <span className={`text-[11px] font-bold ${selected ? 'text-gray-600' : 'text-gray-400'}`}>
              {minOrderText}
            </span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className={`text-[11px] font-bold ${selected ? 'text-gray-600' : 'text-gray-400 opacity-60'}`}>
              {voucher.endDate ? `Valid until ${new Date(voucher.endDate).toLocaleDateString('en-GB')}` : 'No Expiry'}
            </span>
          </div>
        </div>

        {/* Side Action Area */}
        {!disabled && (
          <div className="flex flex-col items-center justify-center pl-3 md:pl-4">
            <div className={`
              w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-500
              ${selected
                ? isFreeship ? 'bg-blue-500 text-white' : 'bg-lime-500 text-white'
                : 'bg-gray-100 text-transparent scale-90'}
              shadow-sm
            `}>
              <Check size={selected ? 16 : 10} strokeWidth={6} className="transition-all duration-500" />
            </div>
          </div>
        )}
      </div>

      {/* REASON PANEL - "Peeking out" below the card - Interactive Shop Link */}
      {showReasonPanel && (
        <>
          <Link
            href={restaurantSlug ? `/restaurants/${restaurantSlug}` : '#'}
            className="relative z-10 px-3.5 md:px-5 py-2.5 md:py-3.5 flex items-center justify-between group/reason transition-colors cursor-pointer peer/bottom"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover/reason:text-[var(--primary)] transition-colors shadow-sm">
                <Store size={12} />
              </div>
              <div className="flex flex-col">
                {missingAmount !== null && missingAmount > 0 ? (
                  <div className="flex items-baseline gap-1 md:gap-1.5 text-[10px] md:text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                    <span className="translate-y-[-0.5px]">Mua thêm</span>
                    <span className="font-anton text-[13px] md:text-[15px] text-black tracking-normal leading-none translate-y-[1px]">{formatVnd(missingAmount)}</span>
                    <span className="translate-y-[-0.5px]">để nhận {getIneligibleBenefitText()}</span>
                  </div>
                ) : (
                  <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    {reason}
                  </span>
                )}
              </div>
            </div>

            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white flex items-center justify-center text-gray-300 group-hover/reason:text-gray-600 transition-all group-hover/reason:translate-x-1 shadow-sm">
              <ChevronRight size={16} strokeWidth={3} />
            </div>
          </Link>

          {/* This background div reacts ONLY when the peeking parts are hovered. It must come AFTER the peers in the DOM. */}
          <div className="absolute inset-0 z-0 bg-gray-100 transition-colors peer-hover/top:bg-gray-200/90 peer-hover/bottom:bg-gray-200/90 rounded-[28px] md:rounded-[32px] pointer-events-none" />
        </>
      )}
    </div>
  );
}

// Add global styles for animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes shimmer-swipe {
      0% { transform: translateX(-150%); }
      100% { transform: translateX(150%); }
    }
    .font-anton { font-family: var(--font-anton), var(--font-sans); }
  `;
  document.head.appendChild(style);
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
