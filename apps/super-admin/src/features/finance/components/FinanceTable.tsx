'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Search, Filter, Play, Pause, AlertCircle, X,
  RotateCcw, Wallet, ArrowUpRight, ArrowDownLeft,
  Calendar, User, Clock, CheckCircle2, XCircle, Info, ChevronRight,
  Eye, Receipt
} from 'lucide-react';
import { DataTable, useSwipeConfirmation } from '@repo/ui';
import { WalletTransactionResponse, WalletTransactionStatus, WalletTransactionType } from '@repo/types';
import { format } from 'date-fns';
import FinanceSearchPopup from './FinanceSearchPopup';
import FilterFinanceModal from './FilterFinanceModal';
import TransactionDetailsModal from './TransactionDetailsModal';

interface FinanceTableProps {
  data: WalletTransactionResponse[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
  onSort: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function FinanceTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onSearch,
  onFilter,
  searchTerm,
  onSort,
  sortField,
  sortDirection
}: FinanceTableProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransactionResponse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getTransactionTypeStyle = (type: string) => {
    const isCredit = ['DEPOSIT', 'REFUND', 'DELIVERY_EARNING', 'RESTAURANT_EARNING', 'EARNING', 'TOP_UP'].includes(type);
    return {
      isCredit,
      color: isCredit ? 'text-lime-600 bg-lime-50 border-lime-100' : 'text-orange-600 bg-orange-50 border-orange-100',
      icon: isCredit ? <ArrowDownLeft size={14} className="stroke-[2.5]" /> : <ArrowUpRight size={14} className="stroke-[3]" />
    };
  };

  const getStatusBadge = (status: WalletTransactionStatus) => {
    switch (status) {
      case 'SUCCESS':
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-lime-100 text-lime-600 border border-lime-100/50">
            <CheckCircle2 size={12} strokeWidth={3.2} />
            Success
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-amber-100 text-amber-600 border border-amber-100/50">
            <Clock size={12} strokeWidth={3.2} className="animate-pulse" />
            Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-red-100 text-red-600 border border-red-100/50">
            <AlertCircle size={12} strokeWidth={3.2} />
            Failed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit bg-gray-100 text-gray-400 border border-gray-100/50">
            <Info size={10} />
            {status}
          </span>
        );
    }
  };

  const columns = [
    {
      label: 'TRANSACTION & ENTITY',
      key: 'id',
      formatter: (_: any, tx: WalletTransactionResponse) => {
        const typeStyle = getTransactionTypeStyle(tx.transactionType as string);
        return (
          <div className="flex items-center gap-4 py-3 group/info">
            <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm border ${typeStyle.color}`}>
                <Wallet size={20} strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                TX-{tx.id.toString().padStart(6, '0')}
                <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black border ${typeStyle.color}`}>
                  {tx.transactionType.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <User size={10} /> {tx.wallet.user.name}
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="truncate max-w-[150px]">{tx.description}</span>
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'FINANCIAL IMPACT',
      key: 'amount',
      formatter: (_: any, tx: WalletTransactionResponse) => {
        const typeStyle = getTransactionTypeStyle(tx.transactionType as string);
        return (
          <div className="py-2 flex items-center gap-6">
            <div className="flex flex-col">
              <div className={`flex items-center gap-1.5 mb-0.5 font-anton text-lg ${typeStyle.isCredit ? 'text-lime-600' : 'text-orange-600'}`}>
                {typeStyle.isCredit ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
              </div>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction Value</span>
            </div>

            <div className="h-8 w-px bg-gray-100" />

            <div className="flex flex-col">
              <span className="font-anton text-sm text-gray-900 mb-0.5">
                {new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)}đ
              </span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Running Balance</span>
            </div>
          </div>
        )
      }
    },
    {
      label: 'TIMELINE',
      key: 'createdAt',
      formatter: (val: string) => {
        const date = new Date(val);
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center shadow-sm">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-anton text-gray-900 uppercase tracking-tight">
                {format(date, 'MMM d, yyyy')}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {format(date, 'HH:mm:ss')}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      label: 'SETTLEMENT STATUS',
      key: 'status',
      formatter: (val: WalletTransactionStatus) => getStatusBadge(val)
    }
  ];

  const handleApplyFilters = (query: string) => {
    setFilterQuery(query);
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <div className="pb-4 p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Financial Records</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5" style={{ wordSpacing: "1px" }}>
            Comprehensive overview of all platform transactions and wallet movements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group
                    ${searchTerm
                ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent'
                : 'bg-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border-transparent'}`}
            title="Search"
          >
            <Search className={`w-5 h-5 ${searchTerm ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
          </button>

          {activeFiltersCount > 0 ? (
            <div className="flex items-center gap-1 p-1 pr-2 bg-primary rounded-2xl shadow-lg shadow-primary/20 border border-primary/40 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-black/10 rounded-2xl transition-colors"
              >
                <Filter className="w-4 h-4 text-white fill-current" />
                <span className="text-xs font-bold text-white uppercase tracking-wide">Filtered</span>
              </button>
              <button
                onClick={() => { handleApplyFilters(''); }}
                className="p-1.5 hover:bg-black/10 text-white rounded-2xl transition-colors"
                title="Clear all"
              >
                <X size={16} className="w-4 h-4" />
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

          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={() => { onSearch(''); handleApplyFilters(''); }}
              className="w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all ml-1 flex items-center justify-center"
              title="Clear All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <DataTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={onLoadMore}
          handleSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          emptyMessage="No transactions found matching your criteria."
          onRowClick={(tx) => {
            setSelectedTransaction(tx);
            setIsDetailsOpen(true);
          }}
          renderActions={(tx) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTransaction(tx);
                  setIsDetailsOpen(true);
                }}
                className="p-2 rounded-xl text-primary bg-lime-50 hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                title="View Receipt"
              >
                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          )}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      <FinanceSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearch={onSearch}
      />

      <FilterFinanceModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        activeQuery={filterQuery}
      />

      <TransactionDetailsModal
        isOpen={isDetailsOpen}
        transaction={selectedTransaction}
        onClose={() => setIsDetailsOpen(false)}
      />
    </motion.div>
  );
}
