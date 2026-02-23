'use client';

import React from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChevronUp, ChevronDown } from '@repo/ui/icons';
import { useRestaurantVouchers } from '../hooks/useRestaurantVouchers';
import { LiquidGlassVoucher } from './LiquidGlassVoucher';
import { MobileLiquidGlassVoucher } from './MobileLiquidGlassVoucher';

interface RestaurantVouchersProps {
  restaurantId: number | null;
}

export const RestaurantVouchers: React.FC<RestaurantVouchersProps> = ({ restaurantId }) => {
  const { data: vouchers, isLoading } = useRestaurantVouchers(restaurantId);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = React.useState(false);
  const [showBottom, setShowBottom] = React.useState(false);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowTop(el.scrollTop > 10);
    setShowBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 10);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    handleScroll();

    // Check again after vouchers load/animate
    const timer = setTimeout(handleScroll, 500);
    return () => clearTimeout(timer);
  }, [vouchers]);

  if (isLoading || !vouchers || vouchers.length === 0) return null;

  // Show more vouchers since it's scrollable now
  const displayVouchers = vouchers.slice(0, 10);

  return (
    <div className="absolute left-3 top-3 bottom-3 z-20 w-[260px] group/container">
      {/* Top scroll indicator */}
      <AnimatePresence>
        {showTop && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-2 left-0 right-0 mx-auto w-fit z-30 pointer-events-none"
          >
            <div className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-xl border border-white/80 grid place-items-center text-[#1A1A1A] shadow-xl shadow-black/5">
              <ChevronUp size={20} strokeWidth={3} className="-translate-y-[1px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main scrollable area */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full h-full flex flex-col gap-3 overflow-y-auto no-scrollbar py-2 px-2"
      >
        <AnimatePresence>
          {displayVouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 120,
                delay: index * 0.1
              }}
            >
              <LiquidGlassVoucher voucher={voucher} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom scroll indicator */}
      <AnimatePresence>
        {showBottom && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-2 left-0 right-0 mx-auto w-fit z-30 pointer-events-none"
          >
            <div className="w-9 h-9 rounded-full bg-white/50 backdrop-blur-xl border border-white/80 grid place-items-center text-[#1A1A1A] shadow-xl shadow-black/5">
              <ChevronDown size={20} strokeWidth={3} className="translate-y-[0.5px]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MobileRestaurantVouchers: React.FC<RestaurantVouchersProps> = ({ restaurantId }) => {
  const { data: vouchers, isLoading } = useRestaurantVouchers(restaurantId);

  if (isLoading || !vouchers || vouchers.length === 0) return null;

  const displayVouchers = vouchers.slice(0, 6);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex gap-2 px-2 pb-4 min-w-full">
        <AnimatePresence>
          {displayVouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <MobileLiquidGlassVoucher voucher={voucher} />
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Spacer for the last item gap */}
        <div className="w-1 shrink-0" />
      </div>
    </div>
  );
};
