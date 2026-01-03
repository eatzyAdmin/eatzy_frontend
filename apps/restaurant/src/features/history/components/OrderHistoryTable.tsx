import { DataTable, ColumnDef } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { mockOrderHistory, OrderHistoryItem } from '../data/mockHistory';
import { Search, Filter, Download, FileText, CheckCircle, AlertCircle, X, Clock, User, CreditCard, RotateCcw } from '@repo/ui/icons';
import { useState, useMemo } from 'react';
import WalletSearchPopup from '@/features/wallet/components/WalletSearchPopup';
import OrderHistoryFilterModal from './OrderHistoryFilterModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderExportModal from './OrderExportModal';

const columns: ColumnDef<OrderHistoryItem>[] = [
  {
    label: 'ORDER ID',
    key: 'id',
    className: 'w-[140px]',
    formatter: (value, item) => (
      <span className="font-mono text-xs font-medium text-gray-500 bg-white px-2 py-1.5 rounded border border-gray-100">
        {item.id}
      </span>
    )
  },
  {
    label: 'CUSTOMER',
    key: 'customerName',
    className: 'min-w-[200px]',
    formatter: (value, item) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
          <User className="w-4 h-4" />
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
    formatter: (value, item) => (
      <div className="flex flex-col gap-1">
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
    formatter: (value, item) => {
      const date = new Date(item.createdAt);
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
    label: 'TOTAL',
    key: 'totalAmount',
    className: 'min-w-[120px]',
    formatter: (value, item) => (
      <div className="flex flex-col">
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
    formatter: (value, item) => {
      const config = {
        completed: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Completed' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Cancelled' },
        refunded: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Refunded' },
      }[item.status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: item.status };

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

export default function OrderHistoryTable() {
  const [data] = useState(mockOrderHistory);
  // const { showNotification } = useNotification();
  const [sortConfig, setSortConfig] = useState<{ key: keyof OrderHistoryItem; direction: 'asc' | 'desc' } | null>(null);
  // Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Search State
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchFields, setSearchFields] = useState({
    id: '',
    description: ''
  });

  // Updated Filter State
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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

  const handleSort = (key: string) => {
    const typedKey = key as keyof OrderHistoryItem;
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
      filterFields.paymentMethod.length > 0 ||
      filterFields.dateRange.from !== null ||
      filterFields.dateRange.to !== null ||
      filterFields.amountRange.min > 0 ||
      filterFields.amountRange.max < 100000000;
  }, [filterFields]);

  const clearFilters = () => {
    setFilterFields({
      status: '',
      paymentMethod: [],
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 100000000 },
    });
  };

  const openFilterModal = () => {
    setIsSearchExpanded(false);
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

  const handleExportAction = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Actual implementation would send request to backend
    console.log('Exporting:', { format, scope, columns });
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply Search
    result = result.filter(item => {
      const idMatch = searchFields.id === '' || item.id.toLowerCase().includes(searchFields.id.toLowerCase());
      const nameMatch = searchFields.description === '' || item.customerName.toLowerCase().includes(searchFields.description.toLowerCase());
      return idMatch && nameMatch;
    });

    // Apply Filter
    result = result.filter(item => {
      let dateMatch = true;
      const itemDate = new Date(item.createdAt);

      if (filterFields.dateRange.from) {
        if (itemDate < filterFields.dateRange.from) dateMatch = false;
      }

      if (filterFields.dateRange.to) {
        const endDate = new Date(filterFields.dateRange.to);
        endDate.setHours(23, 59, 59, 999);
        if (itemDate > endDate) dateMatch = false;
      }

      const statusMatch = filterFields.status === '' || item.status === filterFields.status;
      const paymentMatch = filterFields.paymentMethod.length === 0 || filterFields.paymentMethod.includes(item.paymentMethod);
      const amountMatch = item.totalAmount >= filterFields.amountRange.min && item.totalAmount <= filterFields.amountRange.max;

      return dateMatch && statusMatch && paymentMatch && amountMatch;
    });

    // Apply Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [data, sortConfig, searchFields, filterFields]);

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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Orders List</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Manage your past orders and view details
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
            onClick={handleExport}
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
          placeholders={{ id: 'Search Order ID...', description: 'Search Customer Name...' }}
        />

        <OrderHistoryFilterModal
          isOpen={isFilterModalOpen}
          onClose={closeFilterModal}
          filterFields={filterFields}
          onApply={(newFilters) => setFilterFields(newFilters)}
        />

        <OrderExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          onExport={handleExportAction}
          previewData={filteredAndSortedData}
        />

        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />

        {isFiltered && (
          <div className="px-8 pt-4 pb-0 flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

            {/* Status Badge */}
            {filterFields.status && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, status: '' }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors">{filterFields.status}</span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}

            {/* Payment Badge */}
            {filterFields.paymentMethod.length > 0 && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, paymentMethod: [] }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Method: <span className="text-lime-600 uppercase group-hover:text-red-500 transition-colors uppercase">{filterFields.paymentMethod.join(', ')}</span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}

            {/* Date Badge */}
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

            {/* Amount Badge */}
            {(filterFields.amountRange.min > 0 || filterFields.amountRange.max < 100000000) && (
              <button
                onClick={() => setFilterFields(prev => ({ ...prev, amountRange: { min: 0, max: 100000000 } }))}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Price: <span className="text-lime-600 group-hover:text-red-500 transition-colors">
                  {new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(filterFields.amountRange.min)} - {new Intl.NumberFormat('vi-VN', { notation: "compact" }).format(filterFields.amountRange.max)}
                </span></span>
                <X className="w-3 h-3 opacity-0 w-0 group-hover:opacity-100 group-hover:w-3 transition-all duration-300 ease-out" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        <DataTable<OrderHistoryItem>
          data={filteredAndSortedData}
          columns={columns}
          handleSort={handleSort}
          sortField={sortConfig?.key}
          sortDirection={sortConfig?.direction}
          renderActions={(item) => (
            <button
              onClick={() => setSelectedOrder(item)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all duration-300 group"
              title="View Details"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
          onRowClick={(item) => setSelectedOrder(item)}
          headerClassName="bg-slate-200 text-gray-700 border-none rounded-xl text-[11px] font-bold uppercase tracking-widest py-4 mb-2"
        />
      </div>
    </motion.div>
  );
}
