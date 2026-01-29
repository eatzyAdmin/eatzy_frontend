'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, Phone, MapPin,
  Trash2, Edit, Play, Pause, Star, RotateCcw,
  Globe, X, Percent, ExternalLink, Lock, Unlock, ShieldCheck, AlertTriangle
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, ImageWithFallback } from '@repo/ui';
import { Restaurant, RestaurantStatus } from '@repo/types';
import RestaurantSearchPopup from './RestaurantSearchPopup';
import FilterRestaurantModal from './FilterRestaurantModal';
import RestaurantDetailsModal from './RestaurantDetailsModal';

interface RestaurantsTableProps {
  data: Restaurant[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, userId: number, isActive: boolean) => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
}

export default function RestaurantsTable({
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
  searchTerm
}: RestaurantsTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filterQuery, setFilterQuery] = useState('');

  const handleRowClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsDetailsOpen(true);
  };

  const handleToggleStatusRequest = (restaurant: Restaurant) => {
    const isActive = restaurant.owner?.isActive ?? true;

    confirm({
      title: isActive ? 'Tạm khóa đối tác?' : 'Mở khóa đối tác?',
      type: isActive ? 'danger' : 'info',
      description: isActive
        ? `Tài khoản của đối tác ${restaurant.name} sẽ không thể đăng nhập vào hệ thống sau khi bị khóa.`
        : `Tài khoản của đối tác ${restaurant.name} sẽ có thể đăng nhập lại vào hệ thống ngay lập tức.`,
      confirmText: isActive ? "Slide to Lock" : "Slide to Unlock",
      onConfirm: async () => {
        if (restaurant.owner) {
          await onToggleStatus(restaurant.id, restaurant.owner.id, isActive);
        }
      }
    });
  };

  const handleDeleteRequest = (restaurant: Restaurant) => {
    confirm({
      title: 'Xóa cửa hàng?',
      type: 'danger',
      description: "Hành động này không thể hoàn tác. Cửa hàng sẽ bị xóa vĩnh viễn khỏi hệ thống.",
      confirmText: "Slide to Delete",
      onConfirm: async () => {
        await onDelete(restaurant.id);
      }
    });
  };

  const columns = [
    {
      label: 'RESTAURANT INFO',
      key: 'name',
      formatter: (_: any, r: Restaurant) => {
        return (
          <div className="flex items-center gap-4 py-2">
            <div className="relative group/avatar">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden shadow-lg shadow-black/5 border border-gray-100 transition-transform group-hover/avatar:scale-105 duration-300">
                <ImageWithFallback
                  src={r.avatarUrl || ''}
                  alt={r.name}
                  fill
                  className="object-cover rounded-[inherit]"
                  containerClassName="rounded-[inherit]"
                />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${r.status === 'OPEN' ? 'bg-lime-500' : 'bg-gray-400'}`} />
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                {r.name}
                {r.slug && (
                  <a href={`/restaurant/${r.slug}`} target="_blank" className="text-gray-300 hover:text-primary transition-colors">
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                ID: {r.id} <span className="text-gray-200">|</span> Owner: {r.owner?.name || 'Admin'}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'LOCATION & CONTACT',
      key: 'address',
      formatter: (_: any, r: Restaurant) => (
        <div className="py-2 flex flex-col gap-1.5 max-w-[200px]">
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={12} className="mt-0.5 text-gray-400 shrink-0" />
            <span className="text-xs font-semibold line-clamp-1">{r.address}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={12} className="text-gray-400 shrink-0" />
            <span className="text-[13px] font-anton tracking-tight">{r.contactPhone || 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      label: 'PERFORMANCE',
      key: 'averageRating',
      formatter: (_: any, r: Restaurant) => {
        const rating = r.averageRating || 0;
        const reviews = r.reviewCount || 0;
        return (
          <div className="flex items-center gap-4 py-2">
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl border border-amber-100 shadow-sm shrink-0">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-lg font-anton leading-none mt-0.5">{rating.toFixed(1)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {reviews} Reviews
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className={`w-1.5 h-1.5 rounded-full ${s <= Math.round(rating) ? 'bg-amber-400' : 'bg-gray-100'}`} />
                ))}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'COMMISSION',
      key: 'commissionRate',
      formatter: (_: any, r: Restaurant) => (
        <div className="flex items-center gap-2">
          <div className="font-anton text-lg text-[#1A1A1A]">
            {Math.round(r.commissionRate || 0)}%
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'status',
      formatter: (_: any, r: Restaurant) => {
        const isActive = r.owner?.isActive ?? true;
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive
            ? 'bg-lime-100 text-lime-600 border border-lime-100 shadow-sm'
            : 'bg-red-100 text-red-600 border border-red-100 shadow-sm'
            }`}>
            {isActive ? (
              <>
                <ShieldCheck size={12} strokeWidth={3.2} />
                Unlocked
              </>
            ) : (
              <>
                <Lock size={12} strokeWidth={3.2} />
                Locked
              </>
            )}
          </span>
        );
      }
    }
  ];

  const handleApplyFilters = (query: string) => {
    setFilterQuery(query);
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <div className="pb-4 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Partner Restaurants</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5" style={{ wordSpacing: "1px" }}>
            Manage your network of food partners and their operational status.
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

            {['OPEN', 'CLOSED', 'LOCKED', 'PENDING'].map(s => {
              // Note: LOCKED maps to owner.isActive:false in handleApply
              if (s === 'LOCKED' && filterQuery.includes('owner.isActive:false')) {
                return (
                  <button
                    key={s}
                    onClick={() => handleApplyFilters(filterQuery.replace('owner.isActive:false', '').replace(/or\s*$/, '').replace(/^\s*and\s*|\s*and\s*$/g, '').replace(/\(\s*\)/g, '').trim())}
                    className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">{s}</span></span>
                    <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                );
              }
              if (filterQuery.includes(`'${s}'`)) {
                return (
                  <button
                    key={s}
                    onClick={() => handleApplyFilters(filterQuery.replace(`'${s}'`, '').replace(/, ,/g, ',').replace(/\[,/, '[').replace(/,\]/, ']').replace(/\[\]/, '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                    className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
                  >
                    <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">{s}</span></span>
                    <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                  </button>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        {data.length === 0 && !isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-200 mb-6">
              <Building2 size={48} />
            </div>
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900 mb-2">No Restaurants Found</h3>
            <p className="text-gray-400 text-sm max-w-xs font-medium leading-relaxed">
              Không tìm thấy cửa hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc.
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
            onRowClick={handleRowClick}
            emptyMessage="Không tìm thấy cửa hàng nào khớp với tiêu chí tìm kiếm của bạn."
            handleSort={(key) => console.log('Sort by', key)}
            renderActions={(restaurant: Restaurant) => {
              const isLocked = restaurant.status === 'LOCKED';
              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStatusRequest(restaurant); }}
                    className={`p-2 rounded-xl transition-all duration-300 shadow-sm ${(restaurant.owner?.isActive ?? true)
                      ? 'text-amber-500 bg-amber-100 hover:bg-amber-200'
                      : 'text-lime-600 bg-lime-100 hover:bg-lime-200'
                      }`}
                    title={(restaurant.owner?.isActive ?? true) ? 'Khóa đối tác (Lock)' : 'Mở khóa (Unlock)'}
                  >
                    {(restaurant.owner?.isActive ?? true) ? <Lock size={18} /> : <ShieldCheck size={18} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(restaurant); }}
                    className="p-2 rounded-xl text-lime-600 bg-lime-100 hover:bg-lime-200 transition-all duration-300 shadow-sm"
                    title="Edit details"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteRequest(restaurant); }}
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

      <RestaurantSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearch={onSearch}
      />

      <FilterRestaurantModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        activeQuery={filterQuery}
      />

      <RestaurantDetailsModal
        isOpen={isDetailsOpen}
        restaurant={selectedRestaurant}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedRestaurant(null);
        }}
      />
    </motion.div>
  );
}
