'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Tag, Truck, ChevronLeft } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import { useRestaurantVouchers } from '../hooks/useRestaurantVouchers';
import { MobileLiquidGlassVoucher } from './MobileLiquidGlassVoucher';
import type { Voucher } from '@repo/types';

interface RestaurantVouchersProps {
  restaurantId: number | null;
}

export const RestaurantVouchers: React.FC<RestaurantVouchersProps> = ({ restaurantId }) => {
  const { data: vouchers, isLoading } = useRestaurantVouchers(restaurantId);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll state
  const directionRef = useRef(1);
  const requestRef = useRef<number | null>(null);

  const animateScroll = () => {
    const el = scrollRef.current;
    if (!el || isInteracting) {
      requestRef.current = requestAnimationFrame(animateScroll);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;

    if (directionRef.current === 1) {
      if (el.scrollLeft >= maxScroll - 1) directionRef.current = -1;
      else el.scrollLeft += 0.6;
    } else {
      if (el.scrollLeft <= 1) directionRef.current = 1;
      else el.scrollLeft -= 0.6;
    }
    requestRef.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    if (isHovered && vouchers && vouchers.length > 3) {
      requestRef.current = requestAnimationFrame(animateScroll);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isHovered, vouchers, isInteracting]);

  if (isLoading || !vouchers || vouchers.length === 0) return null;

  const displayVouchers = vouchers.slice(0, 10);
  const COLLAPSED_WIDTH = 490;
  const COLLAPSED_HEIGHT = 92;
  const EXPANDED_HEIGHT = 185;

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-40 flex justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsInteracting(false);
      }}
    >
      <motion.div
        initial={false}
        animate={{
          width: isHovered ? '100.2%' : `${COLLAPSED_WIDTH}px`,
          height: isHovered ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          borderTopLeftRadius: '48px',
          borderTopRightRadius: isHovered ? '48px' : '0px',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.28)',
        }}
        transition={{
          type: "spring",
          damping: 35, // Softer settling
          stiffness: 220,
          mass: 1
        }}
        className="backdrop-blur-3xl border-t border-l border-white/30 shadow-[-20px_-10px_60px_rgba(0,0,0,0.15)] flex items-center relative overflow-hidden will-change-[width,height]"
      >
        {/* WE USE A DUAL-LAYER OVERLAY APPROACH FOR MAXIMUM SMOOTHNESS */}
        <div className="absolute inset-0 w-full h-full relative">

          {/* COLLAPSED LAYER */}
          <motion.div
            initial={false}
            animate={{
              opacity: isHovered ? 0 : 1,
              scale: isHovered ? 0.95 : 1,
              display: isHovered ? 'none' : 'flex'
            }}
            transition={{ duration: 0.3 }}
            className="px-10 flex flex-row-reverse items-center justify-between w-full h-full absolute inset-0 pointer-events-none"
          >
            {/* Label */}
            <div className="flex flex-row-reverse items-center gap-3 pl-8 border-l border-black/10 flex-shrink-0">
              <div className="w-11 h-11 rounded-[16px] bg-[#1A1A1A] flex items-center justify-center shadow-xl rotate-[3deg]">
                <Tag className="w-5 h-5 text-lime-400" />
              </div>
              <div className="flex flex-col items-end whitespace-nowrap">
                <span className="text-[17px] font-anton uppercase tracking-widest text-[#1A1A1A] leading-none mb-0.5 pt-0.5">VOUCHERS</span>
                <span className="text-[9px] font-bold text-black/40 uppercase tracking-tighter">Ưu đãi hời</span>
              </div>
            </div>

            {/* Preview Vouchers */}
            <div className="flex flex-row-reverse items-center gap-10 flex-1 px-4 overflow-hidden">
              {displayVouchers.slice(0, 3).map((voucher) => (
                <VoucherCompactBar key={voucher.id} voucher={voucher} />
              ))}
            </div>

            {/* Hint Arrow */}
            <motion.div
              animate={{ x: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex-shrink-0"
            >
              <ChevronLeft className="text-black/30" size={20} strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* EXPANDED LAYER */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key="expanded-content"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.13 } }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center z-10"
              >
                <div
                  ref={scrollRef}
                  onMouseDown={() => setIsInteracting(true)}
                  onMouseUp={() => setIsInteracting(false)}
                  onTouchStart={() => setIsInteracting(true)}
                  onTouchEnd={() => setIsInteracting(false)}
                  className={`
                    flex items-center gap-8 overflow-x-auto no-scrollbar py-10 w-full h-full scroll-smooth
                    ${vouchers.length <= 3 ? 'justify-center' : ''}
                  `}
                >
                  {displayVouchers.map((voucher, index) => (
                    <DetailedVoucherCard key={voucher.id} voucher={voucher} index={index} />
                  ))}
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const VoucherCompactBar = ({ voucher }: { voucher: Voucher }) => {
  const isFreeship = voucher.discountType === 'FREESHIP';
  const val = isFreeship ? "FREE SHIP" : voucher.discountType === 'PERCENTAGE' ? `-${voucher.discountValue}%` : `-${formatVnd(voucher.discountValue || 0)}`;

  return (
    <div className="flex flex-col items-end whitespace-nowrap">
      <span className={`text-[22px] font-anton leading-none tracking-tight ${isFreeship ? 'text-blue-600' : 'text-[#1A1A1A]'}`}>
        {val}
      </span>
      <span className="text-[10px] font-bold text-black/40 uppercase mt-0.5">
        Min {formatVnd(voucher.minOrderValue || 0)}
      </span>
    </div>
  );
};

const DetailedVoucherCard = ({ voucher, index }: { voucher: Voucher, index: number }) => {
  const isFreeship = voucher.discountType === 'FREESHIP';
  const val = isFreeship ? "FREE SHIP" : voucher.discountType === 'PERCENTAGE' ? `-${voucher.discountValue}%` : `-${formatVnd(voucher.discountValue || 0)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.04 }}
      className="flex flex-col items-center justify-center min-w-[260px] h-full whitespace-nowrap"
    >
      <div className={`
        flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center mb-3
        ${isFreeship ? 'bg-blue-100/60 text-blue-600' : 'bg-lime-100/60 text-lime-600'}
        shadow-sm
      `}>
        {isFreeship ? <Truck size={20} strokeWidth={2.5} /> : <Tag size={20} strokeWidth={2.5} />}
      </div>

      <span className={`text-[34px] md:text-[38px] font-anton leading-[1] tracking-tight mb-2 ${isFreeship ? 'text-blue-600' : 'text-[#1A1A1A]'}`}>
        {val}
      </span>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[12px] font-bold text-[#1A1A1A]/80 uppercase tracking-tight truncate max-w-[220px]">
          {voucher.description || (isFreeship ? 'Miễn phí giao hàng' : 'Giảm trực tiếp')}
        </span>
        <div className="flex items-center gap-1.5 opacity-40">
          <div className="w-1 h-1 rounded-full bg-black" />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Đơn tối thiểu {formatVnd(voucher.minOrderValue || 0)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const MobileRestaurantVouchers: React.FC<RestaurantVouchersProps> = ({ restaurantId }) => {
  const { data: vouchers, isLoading } = useRestaurantVouchers(restaurantId);
  if (isLoading || !vouchers || vouchers.length === 0) return null;
  const displayVouchers = vouchers.slice(0, 6);
  return (
    <div className="w-full overflow-x-auto no-scrollbar px-2">
      <div className="flex gap-3 pb-5 pt-2 min-w-full">
        {displayVouchers.map((v) => (
          <div key={v.id} className="flex-shrink-0">
            <MobileLiquidGlassVoucher voucher={v} />
          </div>
        ))}
      </div>
    </div>
  );
};
