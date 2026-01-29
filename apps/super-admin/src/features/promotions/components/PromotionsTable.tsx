'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, FileText, Tag,
  Trash2, Edit, Play, Pause, AlertCircle, Calendar, Globe, X,
  ChevronRight, ArrowRight, RotateCcw, Truck
} from 'lucide-react';
import { DataTable, LoadingSpinner, useNotification, useSwipeConfirmation } from '@repo/ui';
import { Voucher, DiscountType } from '@repo/types';
import { format } from 'date-fns';
import FilterPromotionModal from './FilterPromotionModal';
import PromotionSearchPopup from './PromotionSearchPopup';

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

  const columns = [
    {
      label: 'CAMPAIGN INFO',
      key: 'code',
      formatter: (_: any, promo: Voucher) => {
        const isActive = promo.active ?? false;
        const isFreeShip = promo.discountType === DiscountType.FREESHIP;
        const copyToClipboard = (e: React.MouseEvent) => {
          e.stopPropagation();
          navigator.clipboard.writeText(promo.code);
          // notification showing the code was copied would be nice, but table doesn't have direct access.
          // We can use the props or a local toast if available.
        };

        return (
          <div className="flex items-center gap-4 py-2 group/info">
            <div className={`w-12 h-12 rounded-2xl ${isActive ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-lg shadow-black/5`}>
              {isFreeShip ? <Truck size={20} className="stroke-[2.5]" /> : <Tag size={20} className="stroke-[2.5]" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1">{promo.code}</div>
                <button
                  onClick={copyToClipboard}
                  className="opacity-0 group-hover/info:opacity-100 p-1 hover:bg-gray-100 rounded-md transition-all text-gray-400 hover:text-primary"
                  title="Copy code"
                >
                  <FileText size={12} />
                </button>
              </div>
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
        const minOrder = promo.minOrderValue ?? 0;
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
        const total = promo.totalQuantity ?? 0;
        const remaining = promo.remainingQuantity ?? 0;
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
          <div className="py-2 flex flex-col gap-1">
            {/* Date Range */}
            <div className="flex items-center gap-2 text-gray-800">
              <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                <Calendar size={14} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</span>
                <span className="text-xs font-anton tracking-tight leading-none">
                  {format(start, start.getFullYear() !== end.getFullYear() ? 'MMM d, yyyy' : 'MMM d')} - {format(end, 'MMM d, yyyy')}
                </span>
              </div>
            </div>

            {/* Scope Badge */}
            <div className="relative group/scope">
              {applyToAll ? (
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50/50 px-3 py-1.5 rounded-xl border border-blue-100/50 w-fit shadow-sm">
                  <Globe size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-anton uppercase tracking-wider">Global System</span>
                </div>
              ) : (
                <div
                  onMouseEnter={() => setHoveredVoucherId(promo.id)}
                  onMouseLeave={() => setHoveredVoucherId(null)}
                  className="flex items-center gap-2 text-primary bg-gray-50/50 px-3 py-1.5 rounded-xl border border-gray-100/20 w-fit cursor-default hover:bg-gray-100/50 transition-colors"
                >
                  <Building2 size={12} strokeWidth={2.5} />
                  <span className="text-[10px] font-anton uppercase tracking-wider underline decoration-primary/30 decoration-dashed underline-offset-2">
                    {restaurantCount} Restaurants
                  </span>

                  <AnimatePresence>
                    {hoveredVoucherId === promo.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="absolute bottom-full left-0 mb-4 bg-[#1A1A1A] text-white p-5 rounded-[28px] shadow-2xl z-[100] min-w-[240px] border border-white/10 pointer-events-none origin-bottom-left"
                      >
                        <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                              <Building2 size={12} strokeWidth={2.5} />
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Locations</div>
                          </div>
                          <div className="text-[11px] font-anton text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                            {restaurantCount}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                          {promo.restaurants?.map(r => (
                            <div key={r.id} className="text-[12px] truncate flex items-center gap-2.5 font-bold text-gray-100 group/item">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(132,204,22,0.4)]" />
                              {r.name}
                            </div>
                          ))}
                        </div>

                        {/* Tooltip Arrow */}
                        <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#1A1A1A] transform rotate-45 border-r border-b border-white/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive ? 'bg-lime-100 text-lime-600 border border-lime-100' : 'bg-gray-100 text-gray-400 border border-gray-100'}`}>
            {isActive ? (
              <>
                <Play size={10} fill="currentColor" />
                Running
              </>
            ) : (
              <>
                <Pause size={10} fill="currentColor" />
                Paused
              </>
            )}
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
      <div className="pb-4 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
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
            <div className="flex items-center gap-1 p-1 pr-2 bg-primary rounded-full shadow-lg shadow-primary/20 border border-primary/40 animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-3 py-2.5 hover:bg-black/10 rounded-full transition-colors"
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

      <div className="px-8 pt-0 pb-4 relative">
        {filterQuery && (
          <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

            {/* Campaign Status */}
            {filterQuery.includes('active:true') && (
              <button
                onClick={() => handleApplyFilters(filterQuery.replace('active:true', '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">Running</span></span>
                <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}
            {filterQuery.includes('active:false') && (
              <button
                onClick={() => handleApplyFilters(filterQuery.replace('active:false', '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">Paused</span></span>
                <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}

            {/* Discount Type */}
            {['PERCENTAGE', 'FIXED', 'FREESHIP'].map(type => {
              if (filterQuery.includes(`discountType:'${type}'`)) {
                return (
                  <button
                    key={type}
                    onClick={() => handleApplyFilters(filterQuery.replace(`discountType:'${type}'`, '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                    className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <span>Type: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">{type}</span></span>
                    <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                );
              }
              return null;
            })}

            {/* Min Order Value */}
            {filterQuery.includes('minOrderValue >=') && (
              <button
                onClick={() => handleApplyFilters(filterQuery.replace(/minOrderValue >= \d+/, '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Order Value: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">Filtered</span></span>
                <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
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
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={onLoadMore}
            onRowClick={onEdit}
            emptyMessage="Không tìm thấy chiến dịch nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
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
