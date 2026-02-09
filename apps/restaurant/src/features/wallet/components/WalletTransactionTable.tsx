'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  Search, Download, FileText
} from '@repo/ui/icons';
import { DataTable, SearchPopup, TableHeader } from '@repo/ui';
import type { WalletTransaction } from '@repo/types';
import WalletFilterModal from './WalletFilterModal';
import WalletExportModal from './WalletExportModal';
import OrderDetailsModal from '@/features/history/components/OrderDetailsModal';
import { useOrderDetail } from '@/features/history/hooks/useOrderDetail';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';
import { WalletSearchFields } from '../hooks/useWalletTransactions';
import { getWalletTransactionColumns } from './WalletTransactionColumns';
import WalletFilterBadges from './WalletFilterBadges';
import { useMemo } from 'react';

interface WalletTransactionTableProps {
  data: WalletTransaction[];
  isLoading: boolean;

  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onSearchChange: (key: string, value: string) => void;
  onClearSearch: () => void;
  onFilter: (query: string) => void;
  searchFields: WalletSearchFields;
  filterQuery: string;
}

export default function WalletTransactionTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onSearchChange,
  onClearSearch,
  onFilter,
  searchFields,
  filterQuery
}: WalletTransactionTableProps) {
  const { order, isLoading: isOrderLoading, fetchOrder, clearOrder } = useOrderDetail();

  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Filter fields for modal
  const [filterFields, setFilterFields] = useState<{
    status: string;
    dateRange: { from: Date | null; to: Date | null };
    amountRange: { min: number; max: number };
  }>({
    status: '',
    dateRange: { from: null, to: null },
    amountRange: { min: -100000000, max: 100000000 }
  });

  // Modal States
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WalletTransaction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Column definitions
  const columns = useMemo(() => getWalletTransactionColumns(), []);

  const handleApplyFilters = (newFilters: typeof filterFields) => {
    setFilterFields(newFilters);

    // Build filter query string for API
    const filters: string[] = [];

    if (newFilters.status) {
      filters.push(`status~'${newFilters.status.toUpperCase()}'`);
    }

    if (newFilters.dateRange.from) {
      filters.push(`createdAt>:'${newFilters.dateRange.from.toISOString()}'`);
    }
    if (newFilters.dateRange.to) {
      const toDate = new Date(newFilters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filters.push(`createdAt<:'${toDate.toISOString()}'`);
    }

    // Amount Range filter
    if (newFilters.amountRange.min > -100000000) {
      filters.push(`amount>=${newFilters.amountRange.min}`);
    }
    if (newFilters.amountRange.max < 100000000) {
      filters.push(`amount<=${newFilters.amountRange.max}`);
    }

    const query = filters.join(' and ');
    onFilter(query);
    setActiveFiltersCount(filters.length);
  };

  const handleClearFilters = () => {
    setFilterFields({
      status: '',
      dateRange: { from: null, to: null },
      amountRange: { min: -100000000, max: 100000000 }
    });
    onFilter('');
    onClearSearch();
    setActiveFiltersCount(0);
    onRefresh();
  };

  const handleRowClick = (item: WalletTransaction) => {
    // Show order details for Food Order, Commission, or revenue transactions
    if ((item.category === 'Food Order' || item.category === 'Commission' || item.type === 'revenue') && item.orderId) {
      setIsOrderModalOpen(true);
      fetchOrder(item.orderId);
    } else if (item.category === 'Withdrawal') {
      setSelectedWithdrawal(item);
    }
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    clearOrder();
  };

  const handleExportData = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Exporting ${scope} data as ${format} with columns:`, columns);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <TableHeader
        title="Transactions"
        description="History of your earnings and payouts"
        searchTerm={searchFields.id || searchFields.description}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={handleClearFilters}
        onResetFilters={handleClearFilters}
        activeColorClass="bg-lime-500"
        activeShadowClass="shadow-lime-500/30"
        activeBorderClass="border-lime-400"
        indicatorColorClass="bg-lime-400"
        extraActions={
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95 ml-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">Export</span>
          </button>
        }
      />

      <div className="px-8 pt-0 pb-4 relative">
        <WalletFilterBadges
          filterFields={filterFields}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Table - DataTable handles loading states and infinite scroll */}
      <div className="p-4 pt-0">
        <DataTable<WalletTransaction>
          data={data}
          columns={columns}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={onLoadMore}
          onRowClick={handleRowClick}
          emptyTitle="No Transactions Found"
          emptyMessage="Không tìm thấy giao dịch nào khớp với tiêu chí tìm kiếm của bạn."
          emptyIcon={<FileText size={48} />}
          onResetFilters={handleClearFilters}
          handleSort={(key) => console.log('Sort by', key)}
          renderActions={(item: WalletTransaction) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(item);
              }}
              className="p-2 rounded-xl bg-lime-100 text-lime-600 hover:text-lime-700 hover:bg-lime-200 transition-all duration-300 shadow-sm"
              title="View Details"
            >
              <FileText size={18} />
            </button>
          )}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      {/* Modals */}
      <SearchPopup<{ query: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ query: searchFields.id || searchFields.description }}
        onSearch={(vals) => {
          onSearchChange('id', vals.query);
          onSearchChange('description', vals.query);
        }}
        onClear={() => {
          onClearSearch();
          setIsSearchOpen(false);
        }}
        title="Transaction Search"
        fields={[
          { key: 'query', label: 'Universal Search', placeholder: 'ID or Description...', icon: Search },
        ]}
      />

      <WalletFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterFields={filterFields}
        onApply={handleApplyFilters}
      />

      <WalletExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportData}
        previewData={data.slice(0, 5)}
      />

      <OrderDetailsModal
        order={order}
        onClose={handleCloseOrderModal}
        isLoading={isOrderLoading}
        isOpen={isOrderModalOpen}
      />

      <WithdrawalDetailsModal
        transaction={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />
    </motion.div>
  );
}
