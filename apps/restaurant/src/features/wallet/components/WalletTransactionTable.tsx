import { DataTable, ColumnDef } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { mockWallet, Transaction } from '../data/mockWallet';
import { mockOrderHistory, OrderHistoryItem } from '@/features/history/data/mockHistory';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download, FileText, CheckCircle, AlertCircle, X, Utensils, Landmark } from '@repo/ui/icons';
import { useState, useMemo } from 'react';
import WalletSearchPopup from './WalletSearchPopup';
import WalletFilterModal from './WalletFilterModal';
import WalletExportModal from './WalletExportModal';
import OrderDetailsModal from '@/features/history/components/OrderDetailsModal';
import WithdrawalDetailsModal from './WithdrawalDetailsModal';

const columns: ColumnDef<Transaction>[] = [
  {
    label: 'TRANSACTION ID',
    key: 'id',
    className: 'w-[140px]',
    formatter: (value, item) => (
      <span className="font-mono text-xs font-medium text-gray-500 bg-white px-2 py-1.5 rounded border border-gray-100">
        #{item.id.split('-')[1]}
      </span>
    )
  },
  {
    label: 'TYPE & DESCRIPTION',
    key: 'description',
    className: 'min-w-[280px]',
    formatter: (value, item) => {
      const isFoodOrder = item.category === 'Food Order';
      const isWithdrawal = item.category === 'Withdrawal';

      return (
        <div className="flex items-start gap-3">
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
    formatter: (value, item) => {
      const date = new Date(item.date);
      return (
        <div className="flex flex-col">
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
    label: 'AMOUNT',
    key: 'amount',
    className: 'min-w-[160px]',
    formatter: (value, item) => {
      const isPositive = item.amount > 0;
      return (
        <div className="flex items-center gap-3">
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
    formatter: (value, item) => {
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

export default function WalletTransactionTable() {
  const [data] = useState(mockWallet.transactions);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);

  // Search State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({
    id: '',
    description: ''
  });

  // Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  const handleSort = (key: string) => {
    const typedKey = key as keyof Transaction;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === typedKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: typedKey, direction });
  };

  const toggleSearch = () => {
    if (!isSearchExpanded) setIsFilterModalOpen(false);
    setIsSearchExpanded(!isSearchExpanded);
  };

  const isFiltered = useMemo(() => {
    return filterFields.status !== '' ||
      filterFields.dateRange.from !== null ||
      filterFields.dateRange.to !== null ||
      filterFields.amountRange.min > -100000000 ||
      filterFields.amountRange.max < 100000000;
  }, [filterFields]);

  const clearFilters = () => {
    setFilterFields({
      status: '',
      dateRange: { from: null, to: null },
      amountRange: { min: -100000000, max: 100000000 }
    });
  };

  const openFilterModal = () => {
    setIsSearchExpanded(false);
    setIsFilterModalOpen(true);
  };

  // Export State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const handleExportData = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    // Simulate API/Processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Exporting ${scope} data as ${format} with columns:`, columns);
    // Future: Implement actual file generation here
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    result = result.filter(item => {
      const idMatch = searchFields.id === '' || item.id.toLowerCase().includes(searchFields.id.toLowerCase());
      const descMatch = searchFields.description === '' || item.description.toLowerCase().includes(searchFields.description.toLowerCase());
      return idMatch && descMatch;
    });

    // Apply Filter
    result = result.filter(item => {
      let dateMatch = true;
      const itemDate = new Date(item.date);

      if (filterFields.dateRange.from) {
        if (itemDate < filterFields.dateRange.from) dateMatch = false;
      }

      if (filterFields.dateRange.to) {
        const endDate = new Date(filterFields.dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) dateMatch = false;
      }

      const statusMatch = filterFields.status === '' || item.status.toLowerCase() === filterFields.status.toLowerCase();

      const amountMatch = item.amount >= filterFields.amountRange.min && item.amount <= filterFields.amountRange.max;

      return dateMatch && statusMatch && amountMatch;
    });

    // Apply Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [data, sortConfig, searchFields, filterFields]);

  const handleRowClick = (item: Transaction) => {
    if (item.category === 'Food Order' && item.orderId) {
      const order = mockOrderHistory.find(o => o.id === item.orderId);
      if (order) {
        setSelectedOrder(order);
      }
    } else if (item.category === 'Withdrawal') {
      setSelectedWithdrawal(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <div className="pb-4 p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
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
          <button
            onClick={toggleSearch}
            className={`w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group ${isSearchExpanded ? 'bg-lime-100 border-lime-200 text-lime-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200'}`}
            title="Search"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {isFiltered ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-lime-500 rounded-xl shadow-lg shadow-lime-200/50 border border-lime-400 group transition-all animate-in fade-in zoom-in duration-200">
              <button
                onClick={openFilterModal}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-lime-600 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <div className="w-px h-4 bg-lime-400 mx-0.5" />
              <button
                onClick={clearFilters}
                className="p-1.5 hover:bg-lime-600 text-white rounded-lg transition-colors"
                title="Clear all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openFilterModal}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200"
              title="Filter"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-gray-200 active:scale-95 ml-2"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-wide">Export</span>
          </button>
        </div>
      </div>

      <div className="px-6 relative">
        <WalletSearchPopup
          isOpen={isSearchExpanded}
          onClose={() => setIsSearchExpanded(false)}
          searchFields={searchFields}
          handleSearchChange={(key: string, value: string) => setSearchFields(prev => ({ ...prev, [key]: value }))}
          clearSearchFields={() => setSearchFields({ id: '', description: '' })}
        />

        <WalletFilterModal
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          filterFields={filterFields}
          onApply={(newFilters) => setFilterFields(newFilters)}
        />

        <WalletExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportData}
          previewData={filteredAndSortedData.slice(0, 5)}
        />

        {isFiltered && (
          <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

            {filterFields.status && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors">{filterFields.status}</span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}

            {(filterFields.dateRange.from || filterFields.dateRange.to) && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, dateRange: { from: null, to: null } }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Date: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                  {filterFields.dateRange.from?.toLocaleDateString()} - {filterFields.dateRange.to?.toLocaleDateString()}
                </span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}

            {(filterFields.amountRange.min > -100000000 || filterFields.amountRange.max < 100000000) && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, amountRange: { min: -100000000, max: 100000000 } }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Amount: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                  {filterFields.amountRange.min.toLocaleString()} - {filterFields.amountRange.max.toLocaleString()}
                </span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <DataTable<Transaction>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          onRowClick={handleRowClick}
          renderActions={(item) => (
            <button
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-300 group"
              title="View Details"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(item);
              }}
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
          headerClassName="bg-slate-200 text-gray-700 border-none rounded-xl text-[11px] font-bold uppercase tracking-widest py-4 mb-2"
        />
      </div>

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
