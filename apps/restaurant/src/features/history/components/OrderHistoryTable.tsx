'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  Search, Filter, Download, FileText, CheckCircle, AlertCircle, X,
  Clock, User, CreditCard, RotateCcw, Bike, Banknote, Calendar, Package
} from '@repo/ui/icons';
import { DataTable, SearchPopup, TableHeader } from '@repo/ui';
import { OrderHistoryItem } from '@repo/types';
import OrderHistoryFilterModal from './OrderHistoryFilterModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderExportModal from './OrderExportModal';
import { getOrderHistoryColumns } from './OrderHistoryColumns';
import OrderHistoryFilterBadges from './OrderHistoryFilterBadges';
import { useMemo } from 'react';

interface OrderHistoryTableProps {
  data: OrderHistoryItem[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
  filterQuery: string;
}

export default function OrderHistoryTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onSearch,
  onFilter,
  searchTerm,
  filterQuery
}: OrderHistoryTableProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Filter fields for modal
  const [filterFields, setFilterFields] = useState<{
    status: string;
    paymentMethod: string[];
    paymentStatus: string;
    dateRange: { from: Date | null; to: Date | null };
    amountRange: { min: number; max: number };
  }>({
    status: '',
    paymentMethod: [],
    paymentStatus: '',
    dateRange: { from: null, to: null },
    amountRange: { min: 0, max: 100000000 },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Column definitions
  const columns = useMemo(() => getOrderHistoryColumns(), []);

  const handleApplyFilters = (newFilters: typeof filterFields) => {
    setFilterFields(newFilters);

    // Build filter query string for API (Spring Filter syntax)
    const filters: string[] = [];

    // 1. Order Status
    if (newFilters.status) {
      filters.push(`orderStatus:'${newFilters.status}'`);
    }

    // 2. Payment Method
    if (newFilters.paymentMethod.length > 0) {
      const methodFilters = newFilters.paymentMethod
        .flatMap(m => [`paymentMethod:'${m}'`, `paymentMethod:'${m.toLowerCase()}'`])
        .join(' or ');
      filters.push(`(${methodFilters})`);
    }

    // 3. Payment Status
    if (newFilters.paymentStatus) {
      filters.push(`paymentStatus:'${newFilters.paymentStatus}'`);
    }

    // 4. Date Range
    if (newFilters.dateRange.from) {
      const fromDate = new Date(newFilters.dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      filters.push(`createdAt>:'${fromDate.toISOString()}'`);
    }
    if (newFilters.dateRange.to) {
      const toDate = new Date(newFilters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filters.push(`createdAt<:'${toDate.toISOString()}'`);
    }

    // 5. Amount Range
    if (newFilters.amountRange.min > 0) {
      filters.push(`totalAmount>=${newFilters.amountRange.min}`);
    }
    if (newFilters.amountRange.max < 100000000) {
      filters.push(`totalAmount<=${newFilters.amountRange.max}`);
    }

    const query = filters.join(' and ');
    onFilter(query);
    setActiveFiltersCount(filters.length);
  };

  const handleClearFilters = () => {
    setFilterFields({
      status: '',
      paymentMethod: [],
      paymentStatus: '',
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 100000000 },
    });
    onFilter('');
    onSearch('');
    setActiveFiltersCount(0);
    onRefresh();
  };

  const handleExportAction = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Exporting:', { format, scope, columns });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <TableHeader
        title="Orders"
        description="History of your customers' orders and their status"
        searchTerm={searchTerm}
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
        <OrderHistoryFilterBadges
          filterFields={filterFields}
          onApplyFilters={handleApplyFilters}
        />
      </div>

      {/* Table - DataTable handles loading states and infinite scroll */}
      <div className="p-4 pt-0">
        <DataTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={onLoadMore}
          onRowClick={(item) => setSelectedOrder(item)}
          emptyTitle="No Orders Found"
          emptyMessage="Không tìm thấy đơn hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
          emptyIcon={<FileText size={48} />}
          onResetFilters={handleClearFilters}
          handleSort={(key) => console.log('Sort by', key)}
          renderActions={(item: OrderHistoryItem) => (
            <button
              onClick={() => setSelectedOrder(item)}
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
      <SearchPopup<{ term: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ term: searchTerm }}
        onSearch={(val) => onSearch(val.term)}
        onClear={() => {
          onSearch('');
          setIsSearchOpen(false);
        }}
        title="Order Search"
        fields={[
          {
            key: 'term',
            label: 'Order ID or Customer',
            placeholder: 'Search by Order ID or Customer Name...',
            icon: Search
          }
        ]}
      />

      <OrderHistoryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filterFields={filterFields}
        onApply={handleApplyFilters}
      />

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <OrderExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportAction}
        previewData={data}
      />
    </motion.div >
  );
}
