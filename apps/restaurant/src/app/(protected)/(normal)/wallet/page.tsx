'use client';

import { useState, useEffect, useRef } from 'react';
import WalletStatsCards from '@/features/wallet/components/WalletStatsCards';
import WalletTransactionTable from '@/features/wallet/components/WalletTransactionTable';
import WalletBankInfo from '@/features/wallet/components/WalletBankInfo';
import WithdrawModal from '@/features/wallet/components/WithdrawModal';
import { useNotification } from '@repo/ui';
import { ChevronLeft, ChevronRight, Wallet } from '@repo/ui/icons';
import { useMyWallet, useWalletTransactions, type WalletSearchFields } from '@/features/wallet/hooks';

export default function WalletPage() {
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Search and Filter state (lifted up from Table)
  const [searchFields, setSearchFields] = useState<WalletSearchFields>({ id: '', description: '' });
  const [filterQuery, setFilterQuery] = useState('');

  // Scroll states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use hook with search and filter params (server-side)
  const {
    transactions,
    isLoading: isLoadingTransactions,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    total
  } = useWalletTransactions(searchFields, filterQuery);

  // Fetch wallet info (balance, bank details)
  const {
    balance,
    isLoading: isLoadingWallet
  } = useMyWallet();

  const isLoading = isLoadingTransactions || isLoadingWallet;


  // Check scroll state on mount and resize
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [mounted]);

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
      const scrollAmount = 400;
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

  // Handle search field change
  const handleSearchChange = (key: string, value: string) => {
    setSearchFields(prev => ({ ...prev, [key]: value }));
  };

  // Clear all search fields
  const handleClearSearch = () => {
    setSearchFields({ id: '', description: '' });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <div className="px-8 pt-5 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Wallet size={12} />
            Financial Hub
          </span>
        </div>
        <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
          MY WALLET
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Manage earnings, payouts, and bank details overview.
          {total > 0 && <span className="text-lime-600 ml-1">({total} transactions)</span>}
        </p>
      </div>

      {/* Hero Stats Horizontal Scroll Container */}
      <div className="mt-6 mb-8 group relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="overflow-x-auto -mx-6 px-6 w-full pb-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <WalletStatsCards balance={balance} onWithdraw={() => setIsWithdrawModalOpen(true)} isLoading={isLoading}>
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

      {/* Main Table Content */}
      <div className="min-h-[600px] m-6">
        <WalletTransactionTable
          data={transactions}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          onRefresh={refetch}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          onFilter={setFilterQuery}
          searchFields={searchFields}
          filterQuery={filterQuery}
        />
      </div>

      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        onConfirm={handleWithdrawConfirm}
        maxBalance={balance}
      />
    </div>
  );
}
