'use client';

import { useState, useEffect, useRef } from 'react';
import WalletStatsCards from '@/features/wallet/components/WalletStatsCards';
import WalletTransactionTable from '@/features/wallet/components/WalletTransactionTable';
import WalletBankInfo from '@/features/wallet/components/WalletBankInfo';
import WithdrawModal from '@/features/wallet/components/WithdrawModal';
import { useLoading, useNotification } from '@repo/ui';
import { ChevronLeft, ChevronRight } from '@repo/ui/icons';

export default function WalletPage() {
  const { hide } = useLoading();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    hide();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Increased slightly to show off shimmer
    return () => clearTimeout(timer);
  }, [hide]);

  // Check scroll state on mount and resize
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        // Use a small epsilon (1px) for float math safety
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [isLoading]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const totalScroll = scrollWidth - clientWidth;
      const progress = totalScroll > 0 ? (scrollLeft / totalScroll) : 0;

      setScrollProgress(progress);
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  const scrollBy = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Approximate card width
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleWithdrawConfirm = (amount: number) => {
    showNotification({
      message: `Withdrawal of ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)} initiated!`,
      type: 'success',
      format: 'Your funds are on the way.'
    });
  };

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-anton font-bold text-[#1A1A1A] mb-2">My Wallet</h1>
        <p className="text-gray-500 font-medium text-lg">Manage earnings, payouts, and bank details overview.</p>
      </div>

      {/* Hero Stats Horizontal Scroll Container */}
      <div className="mb-8 group relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto -mx-6 px-6 w-full pb-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <WalletStatsCards onWithdraw={() => setIsWithdrawModalOpen(true)} isLoading={isLoading}>
            {/* Bank Info Card */}
            <div className="min-w-[400px] snap-start">
              <WalletBankInfo isLoading={isLoading} />
            </div>

            {/* Finance Help Widget */}
            <div className="min-w-[340px] snap-start">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-[32px] p-8 border border-orange-100 shadow-sm h-full flex flex-col gap-6 justify-center">
                <div>
                  <h4 className="font-anton font-bold text-2xl text-orange-900 mb-3">Finance Help</h4>
                  <p className="text-sm text-orange-800/80 leading-relaxed">
                    Having trouble with your payouts or need to change your tax information? Our financial support team is available 24/7.
                  </p>
                </div>
                <button className="w-full py-3 rounded-xl bg-orange-100 text-orange-700 font-bold text-sm hover:bg-orange-200 transition-colors">
                  Contact Financial Support
                </button>
              </div>
            </div>
          </WalletStatsCards>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => scrollBy('left')}
          className={`absolute left-0 top-1/3 -translate-y-1/4 z-10 w-16 h-16 bg-white/70 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center text-gray-700 border border-gray-100 hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all duration-300 ${canScrollLeft ? 'opacity-100 translate-x-2' : 'opacity-0 pointer-events-none -translate-x-4'
            }`}
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <button
          onClick={() => scrollBy('right')}
          className={`absolute right-0 top-1/3 -translate-y-1/4 z-10 w-16 h-16 bg-white/70 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center text-gray-700 border border-gray-100 hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all duration-300 ${canScrollRight ? 'opacity-100 -translate-x-2' : 'opacity-0 pointer-events-none translate-x-4'
            }`}
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        {/* Custom Scroll Indicator */}
        <div className="flex justify-center w-full mt-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-300 rounded-full transition-transform duration-100 ease-out will-change-transform"
              style={{
                width: '33%',
                transform: `translateX(${scrollProgress * 200}%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Table Content - Full Width */}
      <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <WalletTransactionTable />
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
      />
    </div>
  );
}
