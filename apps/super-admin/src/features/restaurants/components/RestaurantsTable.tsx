'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  Building2, Search, Filter, Plus, Phone, MapPin,
  Trash2, Edit, Play, Pause, Star, RotateCcw,
  Globe, X, Percent, ExternalLink, Lock, Unlock, ShieldCheck, AlertTriangle, Activity
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, SearchPopup, TableHeader } from '@repo/ui';
import { Restaurant } from '@repo/types';
import FilterRestaurantModal from './FilterRestaurantModal';
import RestaurantDetailsModal from './RestaurantDetailsModal';
import { getRestaurantsColumns } from './RestaurantsColumns';
import RestaurantsFilterBadges from './RestaurantsFilterBadges';
import { useMemo } from 'react';

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

  const columns = useMemo(() => getRestaurantsColumns(), []);

  const handleApplyFilters = (query: string) => {
    setFilterQuery(query);
    onFilter(query);
    setActiveFiltersCount(query ? query.split(' and ').length : 0);
  };

  const removeFilter = (part: string | RegExp) => {
    const newQuery = filterQuery.replace(part, '')
      .replace(/or\s*$/, '')
      .replace(/, ,/g, ',')
      .replace(/\[,/, '[')
      .replace(/,\]/, ']')
      .replace(/\[\]/, '')
      .replace(/^\s*and\s*|\s*and\s*$/g, '')
      .replace(/\(\s*\)/g, '')
      .trim();
    handleApplyFilters(newQuery);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <TableHeader
        title="Restaurant Partners"
        description="Monitor and manage your restaurant inventory, status and partner accounts."
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={() => { onSearch(''); handleApplyFilters(''); }}
        onResetFilters={() => handleApplyFilters('')}
      />

      <div className="px-8 pt-0 pb-4 relative">
        <RestaurantsFilterBadges
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
          onRowClick={handleRowClick}
          emptyTitle="No Restaurants Found"
          emptyMessage="Không tìm thấy cửa hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
          emptyIcon={<Building2 size={48} />}
          onResetFilters={() => { onSearch(''); handleApplyFilters(''); onRefresh(); }}
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
      </div>

      <SearchPopup<{ term: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ term: searchTerm }}
        onSearch={(vals) => onSearch(vals.term)}
        onClear={() => onSearch('')}
        title="Restaurant Search"
        fields={[
          { key: 'term', label: 'Universal Search', placeholder: 'Search by ID, Name, Phone or Slug...', icon: Search },
        ]}
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
