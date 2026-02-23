'use client';

import React from 'react';
import { Tag, Truck } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import type { Voucher } from '@repo/types';

interface MobileLiquidGlassVoucherProps {
  voucher: Voucher;
}

export const MobileLiquidGlassVoucher: React.FC<MobileLiquidGlassVoucherProps> = ({ voucher }) => {
  const isFreeship = voucher.discountType === 'FREESHIP';

  const getDiscountValue = () => {
    if (isFreeship) return "FREESHIP";
    if (voucher.discountType === 'PERCENTAGE') return `-${voucher.discountValue}%`;
    return `-${formatVnd(voucher.discountValue || 0)}`;
  };

  const minOrderValue = voucher.minOrderValue || 0;
  const minText = minOrderValue > 0 ? `Min ${formatVnd(minOrderValue)}` : "No Min";

  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.05),0_0_4px_rgba(0,0,0,0.02)] px-3 py-3 flex items-center gap-3 min-w-[140px]`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isFreeship ? 'text-blue-600 bg-blue-100' : 'text-lime-700 bg-lime-100'}
      `}>
        {isFreeship ? <Truck size={14} strokeWidth={2.5} /> : <Tag size={14} strokeWidth={2.5} />}
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`text-[16px] font-anton font-bold leading-tight tracking-tight ${isFreeship ? 'text-blue-600' : 'text-[#1A1A1A]'}`}>
          {getDiscountValue()}
        </span>
        <span className="text-[9px] font-medium text-gray-400 tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
          {minText}
        </span>
      </div>
    </div>
  );
};
