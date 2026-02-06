'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, FileText, Tag,
  Trash2, Edit, Play, Pause, AlertCircle, Calendar, Globe, X,
  ChevronRight, ArrowRight, RotateCcw, Truck, DollarSign
} from 'lucide-react';
import { DataTable, LoadingSpinner, useNotification, useSwipeConfirmation, SearchPopup, TableHeader } from '@repo/ui';
import { Voucher, DiscountType } from '@repo/types';
import FilterPromotionModal from './FilterPromotionModal';
import { getPromotionsColumns } from './PromotionsColumns';
import PromotionsFilterBadges from './PromotionsFilterBadges';

interface PromotionsTableProps {
  data: Voucher[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onEdit: (promo: Voucher) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
  filterQuery: string;
}

export default function PromotionsTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onEdit,
  onDelete,
  onToggleStatus,
  onSearch,
  onFilter,
  searchTerm,
  filterQuery
}: PromotionsTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [hoveredVoucherId, setHoveredVoucherId] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleActionRequest = (promo: Voucher, type: 'delete' | 'toggle_status') => {
    const isDelete = type === 'delete';
    const isActive = (promo as any).active ?? false;

    confirm({
      title: isDelete ? 'Xóa chiến dịch?' : (isActive ? 'Tạm dừng chiến dịch?' : 'Kích hoạt chiến dịch?'),
      type: isDelete ? 'danger' : 'info',
      description: isDelete
        ? "Hành động này không thể hoàn tác. Chiến dịch sẽ bị xóa vĩnh viễn khỏi hệ thống."
        : (isActive
          ? "Tạm dừng sẽ khiến người dùng không thể áp dụng mã giảm giá này."
          : "Kích hoạt sẽ cho phép người dùng áp dụng mã giảm giá ngay lập tức."),
      confirmText: isDelete ? "Slide to Delete" : "Slide to Confirm",
      onConfirm: async () => {
        if (type === 'delete') {
          await onDelete(promo.id);
        } else {
          await onToggleStatus(promo.id);
        }
      }
    });

  };

  const columns = useMemo(() => getPromotionsColumns({ hoveredVoucherId, setHoveredVoucherId }), [hoveredVoucherId]);

  const handleApplyFilters = (query: string) => {
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  const removeFilter = (regex: string | RegExp) => {
    const newQuery = filterQuery.replace(regex, '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim();
    handleApplyFilters(newQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      {/* Header with Title and Search/Filter actions */}
      <TableHeader
        title="Promotions & Campaigns"
        description="Create and manage discount codes, vouchers and marketing campaigns."
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={() => { onSearch(''); handleApplyFilters(''); }}
        onResetFilters={() => handleApplyFilters('')}
      />

      <div className="px-8 pt-0 pb-4 relative">
        <PromotionsFilterBadges
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
          onRowClick={onEdit}
          emptyTitle="No Campaigns Found"
          emptyMessage="Không tìm thấy chiến dịch nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
          emptyIcon={<Tag size={48} />}
          onResetFilters={() => { onSearch(''); handleApplyFilters(''); onRefresh(); }}
          handleSort={(key) => console.log('Sort by', key)}
          renderActions={(promo: Voucher) => {
            const isActive = (promo as any).active ?? false;
            return (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleActionRequest(promo, 'toggle_status')}
                  className={`p-2 rounded-xl transition-all duration-300 shadow-sm ${isActive ? 'text-amber-500 bg-amber-100 hover:bg-amber-200' : 'text-lime-600 bg-lime-100 hover:bg-lime-200'}`}
                  title={isActive ? 'Pause' : 'Activate'}
                >
                  {isActive ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={() => onEdit(promo)}
                  className="p-2 rounded-xl text-lime-600 bg-lime-100 hover:bg-lime-200 transition-all duration-300 shadow-sm"
                  title="Edit details"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleActionRequest(promo, 'delete')}
                  className="p-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-all duration-300 shadow-sm"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          }}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      <SearchPopup<{ term: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ term: searchTerm }}
        onSearch={(vals) => onSearch(vals.term)}
        onClear={() => onSearch('')}
        title="Promotions Search"
        fields={[
          { key: 'term', label: 'Universal Search', placeholder: 'Type campaign code or description...', icon: Search },
        ]}
      />

      <FilterPromotionModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </motion.div>
  );
}
