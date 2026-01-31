'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  Search, Filter, Download, FileText, CheckCircle, AlertCircle, X,
  Clock, User, CreditCard, RotateCcw
} from '@repo/ui/icons';
import { DataTable } from '@repo/ui';
import { OrderHistoryItem } from '@repo/types';
import OrderHistoryFilterModal from './OrderHistoryFilterModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderExportModal from './OrderExportModal';
import WalletSearchPopup from '@/features/wallet/components/WalletSearchPopup';

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
    dateRange: { from: Date | null; to: Date | null };
    amountRange: { min: number; max: number };
  }>({
    status: '',
    paymentMethod: [],
    dateRange: { from: null, to: null },
    amountRange: { min: 0, max: 100000000 },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Column definitions
  const columns = [
    {
      label: 'ORDER ID',
      key: 'id',
      className: 'w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <span className="font-mono text-xs font-medium text-gray-500 bg-white px-2 py-1.5 rounded border border-gray-100">
          #{item.id.replace('ORD-', '')}
        </span>
      )
    },
    {
      label: 'CUSTOMER',
      key: 'customerName',
      className: 'min-w-[200px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
            {item.customerAvatar ? (
              <img src={item.customerAvatar} alt={item.customerName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-sm">{item.customerName}</span>
            <span className="text-[10px] text-gray-400 font-medium">{item.customerPhone}</span>
          </div>
        </div>
      )
    },
    {
      label: 'ITEMS',
      key: 'itemsCount',
      className: 'min-w-[220px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col gap-1 py-2">
          <div className="flex items-center flex-wrap gap-y-1 gap-x-1.5">
            {item.items.slice(0, 3).map((i, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span className="flex-shrink-0 h-6 px-2 rounded-lg bg-gray-100 text-[#1A1A1A] font-anton font-bold text-xs flex items-center justify-center border border-gray-200">
                  {i.quantity}x
                </span>
                <span className="text-xs text-gray-700 font-bold whitespace-nowrap">
                  {i.name}{idx < Math.min(item.items.length, 3) - 1 ? ',' : ''}
                </span>
              </div>
            ))}
            {item.items.length > 3 && (
              <span className="text-xs text-gray-400 font-medium">...</span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide">
            {item.itemsCount} items total
          </span>
        </div>
      )
    },
    {
      label: 'DATE',
      key: 'createdAt',
      className: 'min-w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => {
        const date = new Date(item.createdAt);
        return (
          <div className="flex flex-col py-2">
            <span className="text-gray-900 font-semibold text-sm">
              {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <span className="text-gray-400 text-xs font-medium mt-0.5">
              at {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )
      }
    },
    {
      label: 'TOTAL',
      key: 'totalAmount',
      className: 'min-w-[120px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col py-2">
          <span className="font-bold text-gray-900 text-sm">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1 uppercase font-medium">
            <CreditCard className="w-3 h-3" /> {item.paymentMethod}
          </span>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, item: OrderHistoryItem) => {
        const statusKey = item.status.toLowerCase();
        const config = {
          completed: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Completed' },
          delivered: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Completed' },
          cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Cancelled' },
          refunded: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Refunded' },
        }[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: statusKey };

        const Icon = config.icon;

        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${config.bg} ${config.text} ${config.border}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
          </span>
        )
      }
    }
  ];

  const handleApplyFilters = (newFilters: typeof filterFields) => {
    setFilterFields(newFilters);

    // Build filter query string for API
    const filters: string[] = [];

    if (newFilters.status) {
      filters.push(`orderStatus~'${newFilters.status}'`);
    }

    if (newFilters.dateRange.from) {
      filters.push(`createdAt>:'${newFilters.dateRange.from.toISOString()}'`);
    }
    if (newFilters.dateRange.to) {
      const toDate = new Date(newFilters.dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      filters.push(`createdAt<:'${toDate.toISOString()}'`);
    }

    const query = filters.join(' and ');
    onFilter(query);
    setActiveFiltersCount(filters.length);
  };

  const handleClearFilters = () => {
    setFilterFields({
      status: '',
      paymentMethod: [],
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 100000000 },
    });
    onFilter('');
    onSearch('');
    setActiveFiltersCount(0);
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
      {/* Header with Title and Search/Filter actions */}
      <div className="pb-4 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Orders List</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage your past orders and view details
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group
                    ${searchTerm
                ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30 border-transparent'
                : 'bg-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border-transparent'}`}
            title="Search"
          >
            <Search className={`w-5 h-5 ${searchTerm ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
          </button>

          {/* Filter Button */}
          {activeFiltersCount > 0 ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-full shadow-lg shadow-lime-500/20 border border-lime-400 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-black/10 rounded-full transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <button
                onClick={handleClearFilters}
                className="p-1.5 hover:bg-black/10 text-white rounded-2xl transition-colors"
                title="Clear all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95 ml-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">Export</span>
          </button>

          {/* Clear All Button */}
          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={handleClearFilters}
              className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1 flex items-center justify-center"
              title="Clear All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Badges */}
      <div className="px-8 pt-0 pb-4 relative">
        {filterQuery && (
          <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

            {filterFields.status && (
              <button
                onClick={() => handleApplyFilters({ ...filterFields, status: '' })}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors">{filterFields.status}</span></span>
                <X className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}

            {(filterFields.dateRange.from || filterFields.dateRange.to) && (
              <button
                onClick={() => handleApplyFilters({ ...filterFields, dateRange: { from: null, to: null } })}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Date: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                  {filterFields.dateRange.from?.toLocaleDateString()} - {filterFields.dateRange.to?.toLocaleDateString()}
                </span></span>
                <X className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table - DataTable handles loading states and infinite scroll */}
      <div className="p-4 pt-0">
        {data.length === 0 && !isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
              <FileText size={48} />
            </div>
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
              Không tìm thấy đơn hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-8 px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-lime-500 transition-all flex items-center gap-2 group"
            >
              <RotateCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={onLoadMore}
            onRowClick={(item) => setSelectedOrder(item)}
            emptyMessage="Không tìm thấy đơn hàng nào."
            handleSort={(key) => console.log('Sort by', key)}
            renderActions={(item: OrderHistoryItem) => (
              <button
                onClick={() => setSelectedOrder(item)}
                className="p-2 rounded-xl text-gray-400 hover:text-lime-600 hover:bg-lime-100 transition-all duration-300 shadow-sm"
                title="View Details"
              >
                <FileText size={18} />
              </button>
            )}
            headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
          />
        )}
      </div>

      {/* Modals */}
      <WalletSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchFields={{ id: searchTerm, description: '' }}
        handleSearchChange={(key: string, value: string) => {
          if (key === 'id') onSearch(value);
        }}
        clearSearchFields={() => onSearch('')}
        placeholders={{ id: 'Search Order ID...', description: 'Search Customer Name...' }}
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
    </motion.div>
  );
}
