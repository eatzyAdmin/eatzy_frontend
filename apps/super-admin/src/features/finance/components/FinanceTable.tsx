'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Search, Filter, Play, Pause, AlertCircle, X,
  RotateCcw, Wallet, ArrowUpRight, ArrowDownLeft,
  Calendar, User, Clock, CheckCircle2, XCircle, Info, ChevronRight,
  Eye, Receipt, Activity, Banknote
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, SearchPopup, TableHeader } from '@repo/ui';
import { WalletTransactionResponse, WalletTransactionStatus, WalletTransactionType } from '@repo/types';
import FilterFinanceModal from './FilterFinanceModal';
import TransactionDetailsModal from './TransactionDetailsModal';
import { getFinanceColumns } from './FinanceColumns';
import FinanceFilterBadges from './FinanceFilterBadges';
import { useMemo } from 'react';

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

  const columns = useMemo(() => getFinanceColumns(), []);

  const handleApplyFilters = (query: string) => {
    setFilterQuery(query);
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  const removeFilter = (part: string | RegExp) => {
    const newQuery = filterQuery.replace(part, '')
      .replace(/, ,/g, ',')
      .replace(/\[,/, '[')
      .replace(/,\]/, ']')
      .replace(/\[\]/, '')
      .replace(/^\s*and\s*|\s*and\s*$/g, '')
      .trim();
    handleApplyFilters(newQuery);
  };

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <TableHeader
        title="Finance & Transactions"
        description="Monitor system revenue, driver payouts and customer refunds."
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={() => { onSearch(''); handleApplyFilters(''); }}
        onResetFilters={() => handleApplyFilters('')}
      />

      <div className="px-8 pt-0 pb-4 relative">
        <FinanceFilterBadges
          filterQuery={filterQuery}
          onRemoveFilter={removeFilter}
        />
      </div>

      <div className="p-4 pt-0">
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
          emptyTitle="No transactions found"
          emptyMessage="No transactions found matching your criteria."
          emptyIcon={<Receipt size={48} />}
          onResetFilters={() => { onSearch(''); handleApplyFilters(''); onRefresh(); }}
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
                className="p-2 rounded-xl text-lime-600 bg-lime-100 hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                title="View Receipt"
              >
                <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          )}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      <SearchPopup<{ term: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ term: searchTerm }}
        onSearch={(vals) => onSearch(vals.term)}
        onClear={() => onSearch('')}
        title="Finance Search"
        fields={[
          { key: 'term', label: 'Universal Search', placeholder: 'Search by ID, User, Type or Description...', icon: Search },
        ]}
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
