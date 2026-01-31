'use client';

import { useState, useEffect } from 'react';
import { History } from '@repo/ui/icons';
import { useOrderHistory } from '@/features/history/hooks/useOrderHistory';
import OrderHistoryTable from '@/features/history/components/OrderHistoryTable';

export default function OrderHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    orders,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    total
  } = useOrderHistory(searchTerm, filterQuery);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <div className="px-8 pt-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <History size={12} />
                Order Records
              </span>
            </div>
            <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
              ORDER HISTORY
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              View and manage your past order records.
              {total > 0 && <span className="text-lime-600 ml-1">({total} orders)</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px] m-6">
        <OrderHistoryTable
          data={orders}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          onRefresh={refetch}
          onSearch={setSearchTerm}
          onFilter={setFilterQuery}
          searchTerm={searchTerm}
          filterQuery={filterQuery}
        />
      </div>
    </div>
  );
}
