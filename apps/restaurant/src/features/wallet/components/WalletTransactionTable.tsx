'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  ArrowDownLeft, ArrowUpRight, Search, Filter, Download, FileText,
  CheckCircle, AlertCircle, X, Utensils, Landmark, RotateCcw,
  Clock
} from '@repo/ui/icons';
import { DataTable, PremiumSearchPopup } from '@repo/ui';
import { OrderHistoryItem } from '@repo/types';
import WalletFilterModal from './WalletFilterModal';
import WalletExportModal from './WalletExportModal';
import OrderDetailsModal from '@/features/history/components/OrderDetailsModal';
import { useOrderDetail } from '@/features/history/hooks/useOrderDetail';
import { useLoading } from '@repo/ui';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';
import { Transaction } from '../types';
import { WalletSearchFields } from '../hooks/useWalletTransactions';

interface WalletTransactionTableProps {
  data: Transaction[];
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
  const { getOrderDetail } = useOrderDetail();
  const { show, hide } = useLoading();

  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

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
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Transaction | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Column definitions
  const columns = [
    {
      label: 'TRANSACTION ID',
      key: 'id',
      className: 'w-[140px]',
      formatter: (_: any, item: Transaction) => (
        <span className="font-mono text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm uppercase tracking-tighter">
          #{item.id.includes('-') ? item.id.split('-')[1] : item.id}
        </span>
      )
    },
    {
      label: 'TYPE & DESCRIPTION',
      key: 'description',
      className: 'min-w-[280px]',
      formatter: (_: any, item: Transaction) => {
        const isFoodOrder = item.category === 'Food Order';
        const isWithdrawal = item.category === 'Withdrawal';

        return (
          <div className="flex items-start gap-3 py-2">
            <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center border shadow-sm shrink-0 ${isFoodOrder
              ? 'bg-lime-50 text-lime-600 border-lime-100'
              : isWithdrawal
                ? 'bg-red-50 text-red-600 border-red-100'
                : 'bg-gray-50 text-gray-500 border-gray-100'
              }`}>
              {isFoodOrder && <Utensils className="w-4 h-4" />}
              {isWithdrawal && <Landmark className="w-4 h-4" />}
              {!isFoodOrder && !isWithdrawal && <FileText className="w-4 h-4" />}
            </div>
            <div className="flex flex-col gap-0.5">
              <span className={`text-[10px] uppercase tracking-widest font-bold ${isFoodOrder ? 'text-lime-600' : isWithdrawal ? 'text-red-600' : 'text-gray-400'
                }`}>
                {item.category}
              </span>
              <span className="font-bold text-gray-900 text-sm md:text-base font-heading line-clamp-1">{item.description}</span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'DATE',
      key: 'date',
      className: 'min-w-[140px]',
      formatter: (_: any, item: Transaction) => {
        const date = new Date(item.date);
        return (
          <div className="flex flex-col py-2">
            <span className="text-[#1A1A1A] font-bold text-[13px] uppercase tracking-tight">
              {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3 h-3 text-gray-300" />
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      label: 'AMOUNT',
      key: 'amount',
      className: 'min-w-[160px]',
      formatter: (_: any, item: Transaction) => {
        const isPositive = item.amount > 0;
        return (
          <div className="flex items-center gap-3 py-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-lime-100 text-lime-600' : 'bg-red-50 text-red-500'}`}>
              {isPositive ? <ArrowDownLeft className="w-4 h-4" strokeWidth={2.5} /> : <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />}
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-sm ${isPositive ? 'text-lime-600' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                Bal: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.balanceAfter)}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, item: Transaction) => {
        const isSuccess = item.status === 'success';
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border tracking-wide shadow-sm ${isSuccess
            ? 'bg-lime-100 text-lime-700 border-lime-200'
            : 'bg-red-100 text-red-700 border-red-200'
            }`}>
            {isSuccess ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {isSuccess ? 'Thành công' : 'Thất bại'}
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
  };

  const handleRowClick = async (item: Transaction) => {
    if ((item.category === 'Food Order' || item.type === 'revenue') && item.orderId) {
      try {
        show();
        const order = await getOrderDetail(item.orderId);
        if (order) {
          setSelectedOrder(order);
        }
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        hide();
      }
    } else if (item.category === 'Withdrawal') {
      setSelectedWithdrawal(item);
    }
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
      {/* Header */}
      <div className="pb-4 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-lime-400 rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Transactions</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            History of your earnings and payouts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group
                    ${(searchFields.id || searchFields.description)
                ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/30 border-transparent'
                : 'bg-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border-transparent'}`}
            title="Search"
          >
            <Search className={`w-5 h-5 ${(searchFields.id || searchFields.description) ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
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
          {((searchFields.id || searchFields.description) || activeFiltersCount > 0) && (
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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
              Không tìm thấy giao dịch nào khớp với tiêu chí tìm kiếm của bạn.
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
          <DataTable<Transaction>
            data={data}
            columns={columns}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={onLoadMore}
            onRowClick={handleRowClick}
            emptyMessage="Không tìm thấy giao dịch nào."
            handleSort={(key) => console.log('Sort by', key)}
            renderActions={(item: Transaction) => (
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
        )}
      </div>

      {/* Modals */}
      <PremiumSearchPopup<{ query: string }>
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
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      <WithdrawalDetailsModal
        transaction={selectedWithdrawal}
        onClose={() => setSelectedWithdrawal(null)}
      />
    </motion.div>
  );
}
