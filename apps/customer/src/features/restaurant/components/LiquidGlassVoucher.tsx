'use client';

import React from 'react';
import { Tag, Truck } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import type { Voucher } from '@repo/types';

interface LiquidGlassVoucherProps {
  voucher: Voucher;
  className?: string;
}

export const LiquidGlassVoucher: React.FC<LiquidGlassVoucherProps> = ({ voucher, className }) => {
  const isFreeship = voucher.discountType === 'FREESHIP';

  const getTitle = () => {
    if (voucher.description) return voucher.description;
    if (voucher.code) return `Mã: ${voucher.code}`;
    return isFreeship ? 'Miễn phí giao hàng' : 'Giảm giá cực hời';
  };

  const getDiscountValue = () => {
    if (isFreeship) return "FREESHIP";
    if (voucher.discountType === 'PERCENTAGE') return `-${voucher.discountValue}%`;
    return `-${formatVnd(voucher.discountValue || 0)}`;
  };

  const getLabel = () => isFreeship ? 'SHIPPING' : 'DISCOUNT';

  const minOrderValue = voucher.minOrderValue || 0;
  const minText = `MIN. ${formatVnd(minOrderValue)}`;

  return (
    <div className={`relative overflow-hidden rounded-[28px] border border-white/60 bg-white/60 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-4 md:p-4.5 flex flex-col w-full transition-all duration-300 hover:bg-white/80 hover:shadow-xl hover:-translate-y-1 ${className || ""}`}>
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />

      {/* Header: Label & Icon */}
      <div className="flex justify-between items-center mb-0.5 relative z-10">
        <span className="text-[10px] font-black text-gray-400/80 uppercase tracking-[0.15em] font-sans">
          {getLabel()}
        </span>
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-500
          ${isFreeship ? 'text-blue-500 bg-blue-50/50' : 'text-lime-600 bg-lime-50/50'}
        `}>
          {isFreeship ? <Truck size={14} strokeWidth={2.5} /> : <Tag size={14} strokeWidth={2.5} />}
        </div>
      </div>

      {/* Main Value & Description */}
      <div className="mb-2.5 relative z-10">
        <h2 className={`text-[22px] md:text-[26px] font-anton leading-none tracking-tight mb-0.5 ${isFreeship ? 'text-blue-600' : 'text-[#1A1A1A]'}`}>
          {getDiscountValue()}
        </h2>
        <p className="text-[11px] font-bold text-gray-500/80 line-clamp-1 tracking-tight">
          {getTitle()}
        </p>
      </div>

      {/* Bottom: Progress bar & Min Value */}
      <div className="flex items-center gap-3 mt-auto relative z-10">
        <div className="h-1 flex-1 rounded-full bg-gray-100/50 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full ${isFreeship ? 'bg-blue-400' : 'bg-lime-400'}`}
            style={{ width: '45%' }} // Mock progress for aesthetic
          />
        </div>
        <span className="text-[9px] font-black text-gray-400 whitespace-nowrap uppercase tracking-wider">
          {minText}
        </span>
      </div>
    </div>
  );
};
