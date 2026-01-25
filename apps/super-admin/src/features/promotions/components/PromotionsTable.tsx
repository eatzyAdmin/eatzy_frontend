'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, FileText, Tag,
  Trash2, Edit, Play, Pause, AlertCircle, Calendar, Globe, X,
  ChevronRight, ArrowRight, RotateCcw
} from 'lucide-react';
import { DataTable, LoadingSpinner, useNotification, useSwipeConfirmation } from '@repo/ui';
import { Voucher, DiscountType } from '@repo/types';
import { format } from 'date-fns';
import FilterPromotionModal from './FilterPromotionModal';
import PromotionSearchPopup from './PromotionSearchPopup';

interface PromotionsTableProps {
  data: Voucher[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (promo: Voucher) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
}

export default function PromotionsTable({
  data,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
  onToggleStatus,
  onSearch,
  onFilter,
  searchTerm
}: PromotionsTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleActionRequest = (promo: Voucher, type: 'delete' | 'toggle_status') => {
    const isDelete = type === 'delete';
    const isActive = (promo as any).active ?? false;

    confirm({
      title: isDelete ? 'Xóa chiến dịch?' : (isActive ? 'Tạm dừng chiến dịch?' : 'Kích hoạt chiến dịch?'),
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

  const columns = [
    {
      label: 'CAMPAIGN INFO',
      key: 'code',
      formatter: (_: any, promo: Voucher) => {
        const isActive = (promo as any).active ?? false;
        return (
          <div className="flex items-center gap-4 py-2">
            <div className={`w-12 h-12 rounded-2xl ${isActive ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-lg shadow-black/5`}>
              <Tag size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1">{promo.code}</div>
              <div className="text-xs text-gray-400 font-medium line-clamp-1">{promo.description}</div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'VALUE',
      key: 'discountValue',
      formatter: (_: any, promo: Voucher) => {
        const dValue = promo.discountValue ?? 0;
        const minOrder = (promo as any).minOrderValue ?? 0;
        let displayValue = '';
        let typeLabel = '';

        if (promo.discountType === DiscountType.PERCENTAGE) {
          displayValue = `${dValue}%`;
          typeLabel = 'PERCENTAGE';
        } else if (promo.discountType === DiscountType.FIXED) {
          displayValue = `${new Intl.NumberFormat('vi-VN').format(dValue)}đ`;
          typeLabel = 'FIXED AMOUNT';
        } else if (promo.discountType === DiscountType.FREESHIP) {
          displayValue = `FREE`;
          typeLabel = 'SHIPPING';
        }

        return (
          <div className="py-2">
            <div className="font-anton text-xl text-[#1A1A1A]">
              {displayValue}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                {typeLabel}
              </div>
              <div className="text-[9px] font-bold text-primary uppercase tracking-tight flex items-center gap-1 mt-1">
                Min Order: {new Intl.NumberFormat('vi-VN').format(minOrder)}đ
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'USAGE & LIMIT',
      key: 'remainingQuantity',
      formatter: (_: any, promo: Voucher) => {
        const total = (promo as any).totalQuantity ?? 0;
        const remaining = (promo as any).remainingQuantity ?? 0;
        const used = total - remaining;
        const percent = total > 0 ? Math.min(100, (used / total) * 100) : 0;
        const isNearFull = percent > 80;
        return (
          <div className="w-[120px]">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className={isNearFull ? "text-orange-500" : "text-gray-600"}>{used} used</span>
              <span className="text-gray-400">/ {total}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${isNearFull ? 'bg-orange-500' : 'bg-lime-500'}`}
              />
            </div>
          </div>
        );
      }
    },
    {
      label: 'PERIOD & SCOPE',
      key: 'startDate',
      formatter: (_: any, promo: Voucher) => {
        const start = promo.startDate ? new Date(promo.startDate) : new Date();
        const end = promo.endDate ? new Date(promo.endDate) : new Date();
        const applyToAll = (promo as any).applyToAll ?? (!promo.restaurants || promo.restaurants.length === 0);
        const restaurantCount = promo.restaurants?.length || 0;

        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              {format(start, 'MMM d')} - {format(end, 'MMM d, yyyy')}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
              {applyToAll ? (
                <div className="flex items-center gap-1 text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                  <Globe size={10} /> Global Scope
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-100">
                  <Building2 size={10} /> {restaurantCount} Restaurants
                </div>
              )}
            </div>
          </div>
        );
      }
    },
    {
      label: 'STATUS',
      key: 'active',
      formatter: (_: any, promo: Voucher) => {
        const isActive = (promo as any).active ?? false;
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${isActive ? 'bg-lime-100 text-lime-700' : 'bg-gray-100 text-gray-500'}`}>
            {isActive ? 'Running' : 'Paused'}
          </span>
        );
      }
    }
  ];

  const handleApplyFilters = (query: string) => {
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      {/* Header with Title and Search/Filter actions */}
      <div className="pb-4 p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Active Campaigns</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Monitor and manage your marketing promotions efficiently.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Button */}
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
        {data.length === 0 && !isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
              <Tag size={48} />
            </div>
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 mb-2">No Campaigns Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
              Không tìm thấy chiến dịch nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
            </p>
            <button
              onClick={() => { onSearch(''); handleApplyFilters(''); }}
              className="mt-8 px-8 py-4 bg-[#1A1A1A] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all flex items-center gap-2 group"
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
            emptyMessage="Không tìm thấy chiến dịch nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
            handleSort={(key) => console.log('Sort by', key)}
            renderActions={(promo: Voucher) => {
              const isActive = (promo as any).active ?? false;
              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActionRequest(promo, 'toggle_status')}
                    className={`p-2 rounded-xl transition-all duration-300 shadow-sm ${isActive ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-lime-500 bg-lime-50 hover:bg-lime-100'}`}
                    title={isActive ? 'Pause' : 'Activate'}
                  >
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => onEdit(promo)}
                    className="p-2 rounded-xl text-lime-500 bg-lime-50 hover:bg-lime-100 transition-all duration-300 shadow-sm"
                    title="Edit details"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleActionRequest(promo, 'delete')}
                    className="p-2 rounded-xl bg-red-50 text-red-500 hover:text-red-700 hover:bg-red-100 transition-all duration-300 shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            }}
            headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
          />
        )}
      </div>

      <PromotionSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearch={onSearch}
      />

      <FilterPromotionModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
      />
    </motion.div>
  );
}
