'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  Search, Filter, Download, FileText, CheckCircle, AlertCircle, X,
  Clock, User, CreditCard, RotateCcw, Bike, Banknote
} from '@repo/ui/icons';
import { DataTable, PremiumSearchPopup } from '@repo/ui';
import { OrderHistoryItem } from '@repo/types';
import OrderHistoryFilterModal from './OrderHistoryFilterModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderExportModal from './OrderExportModal';

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
  const columns = [
    {
      label: 'ORDER ID',
      key: 'id',
      className: 'w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <span className="font-mono text-[12px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm uppercase tracking-tighter">
          #{item.id.replace('ORD-', '')}
        </span>
      )
    },
    {
      label: 'CUSTOMER',
      key: 'customerName',
      className: 'min-w-[220px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex items-center gap-4 py-2">
          <div className="w-10 h-10 rounded-2xl bg-lime-50 border border-lime-100 shadow-sm flex items-center justify-center text-lime-500 overflow-hidden group-hover:scale-105 transition-transform">
            {item.customerAvatar ? (
              <img src={item.customerAvatar} alt={item.customerName} className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[#1A1A1A] text-[13px] tracking-tight leading-tight">{item.customerName}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{item.customerPhone}</span>
          </div>
        </div>
      )
    },
    {
      label: 'ITEMS',
      key: 'itemsCount',
      className: 'max-w-[350px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col gap-1 py-2">
          <div className="w-full truncate" title={item.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}>
            {item.items.map((i, idx) => (
              <div key={idx} className="inline-flex items-center gap-1.5 mr-3 align-middle">
                <span className="flex-shrink-0 min-w-[32px] h-8 px-2 rounded-xl bg-lime-50 text-lime-700 font-bold text-xs flex items-center justify-center border border-lime-100 shadow-sm">
                  {i.quantity}x
                </span>
                <span className="text-sm text-gray-700 font-bold whitespace-nowrap">
                  {i.name}{idx < item.items.length - 1 ? ',' : ''}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-medium tracking-wide leading-none uppercase tracking-widest mt-1">
            {item.itemsCount} items total
          </span>
        </div>
      )
    },
    {
      label: 'DATE',
      key: 'createdAt',
      className: 'min-w-[160px]',
      formatter: (_: any, item: OrderHistoryItem) => {
        const date = new Date(item.createdAt);
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
      label: 'TOTAL',
      key: 'totalAmount',
      className: 'min-w-[140px]',
      formatter: (_: any, item: OrderHistoryItem) => (
        <div className="flex flex-col py-2">
          <span className="font-bold text-[#1A1A1A] text-sm tracking-tighter">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.totalAmount)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="px-1.5 py-0.5 rounded-md bg-gray-50 border border-gray-100 flex items-center gap-1">
              <CreditCard className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">{item.paymentMethod}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, item: OrderHistoryItem) => {
        const statusKey = item.status.toUpperCase();
        const config: any = {
          PENDING: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: Clock, label: 'Chờ xử lý' },
          PREPARING: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: RotateCcw, label: 'Đang chuẩn bị' },
          READY: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', icon: CheckCircle, label: 'Chờ giao hàng' },
          DRIVER_ASSIGNED: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', icon: User, label: 'Đã có tài xế' },
          PICKED_UP: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', icon: Bike, label: 'Đang giao hàng' },
          ARRIVED: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle, label: 'Đã đến nơi' },
          DELIVERED: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Hoàn thành' },
          COMPLETED: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Hoàn thành' },
          REJECTED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Đã hủy' },
          CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Đã hủy' },
          REFUNDED: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Đã hoàn tiền' },
        }[statusKey] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: statusKey };

        const Icon = config.icon || Clock;

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
            className="px-6 py-3.5 rounded-2xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2.5 shadow-lg shadow-gray-200 active:scale-95 ml-2 border border-black group"
          >
            <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-wider">Export</span>
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

            {filterFields.paymentMethod.length > 0 && (
              <button
                onClick={() => handleApplyFilters({ ...filterFields, paymentMethod: [] })}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Thanh toán: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors">{filterFields.paymentMethod.join(', ')}</span></span>
                <X className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}

            {filterFields.paymentStatus && (
              <button
                onClick={() => handleApplyFilters({ ...filterFields, paymentStatus: '' })}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>TT Thanh toán: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors">{filterFields.paymentStatus}</span></span>
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

            {(filterFields.amountRange.min > 0 || filterFields.amountRange.max < 100000000) && (
              <button
                onClick={() => handleApplyFilters({ ...filterFields, amountRange: { min: 0, max: 100000000 } })}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Giá: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                  {filterFields.amountRange.min.toLocaleString()} - {filterFields.amountRange.max.toLocaleString()}
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
            <div className="w-24 h-24 rounded-[36px] bg-gray-50 flex items-center justify-center text-gray-200 mb-8 border-4 border-white shadow-inner">
              <FileText size={48} />
            </div>
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
              Không tìm thấy đơn hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-10 px-10 py-4 bg-[#1A1A1A] text-white rounded-[20px] text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-lime-500 transition-all flex items-center gap-3 group shadow-xl shadow-gray-200"
            >
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
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
      <PremiumSearchPopup<{ term: string }>
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
    </motion.div>
  );
}
