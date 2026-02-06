'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  User, Search, Filter, Play, Pause, AlertCircle, X,
  RotateCcw, Bike, Star, ShieldCheck, Mail, Navigation, Info, Edit, Trash2,
  Lock, Unlock, Activity
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, SearchPopup, TableHeader } from '@repo/ui';
import { DriverProfile } from '@repo/types';
import FilterDriverModal from './FilterDriverModal';
import DriverDetailsModal from './DriverDetailsModal';
import EditDriverModal from './EditDriverModal';
import { getDriversColumns } from './DriversColumns';
import DriversFilterBadges from './DriversFilterBadges';
import { useMemo } from 'react';

interface DriversTableProps {
  data: DriverProfile[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onEdit: (driver: DriverProfile) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, userId: number, isActive: boolean) => void;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
  onSort: (field: string) => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export default function DriversTable({
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
  onSort,
  sortField,
  sortDirection
}: DriversTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverProfile | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleStatusRequest = (driver: DriverProfile) => {
    const isActive = driver.user.isActive ?? true;

    confirm({
      title: isActive ? 'Khóa tài khoản tài xế?' : 'Mở khóa tài khoản tài xế?',
      type: isActive ? 'danger' : 'info',
      description: isActive
        ? `Tài xế ${driver.user.name} sẽ không thể truy cập ứng dụng Mobile App để nhận đơn sau khi bị khóa.`
        : `Tài xế ${driver.user.name} sẽ có thể đăng nhập lại và bắt đầu làm việc ngay lập tức.`,
      confirmText: isActive ? "Slide to Lock" : "Slide to Unlock",
      onConfirm: async () => {
        await onToggleStatus(driver.id, driver.user.id, isActive);
      }
    });
  };

  const handleDeleteRequest = (driver: DriverProfile) => {
    confirm({
      title: 'Xóa hồ sơ tài xế?',
      type: 'danger',
      description: "Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến tài xế này sẽ bị đóng băng hoặc xóa khỏi hệ thống hiển thị.",
      confirmText: "Slide to Delete",
      onConfirm: async () => {
        await onDelete(driver.id);
      }
    });
  };

  const columns = useMemo(() => getDriversColumns(), []);

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
        title="Partner Drivers"
        description="Monitor and manage your delivery network and partner performance."
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={() => { onSearch(''); handleApplyFilters(''); }}
        onResetFilters={() => handleApplyFilters('')}
      />

      <div className="px-8 pt-0 pb-4 relative">
        <DriversFilterBadges
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
          emptyTitle="No Drivers Found"
          emptyMessage="Không tìm thấy tài xế nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
          emptyIcon={<Bike size={48} />}
          onResetFilters={() => { onSearch(''); handleApplyFilters(''); onRefresh(); }}
          onRowClick={(driver) => {
            setSelectedDriver(driver);
            setIsDetailsOpen(true);
          }}
          renderActions={(driver) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleStatusRequest(driver); }}
                className={`p-2 rounded-xl transition-all duration-300 shadow-sm ${(driver.user.isActive ?? true)
                  ? 'text-amber-500 bg-amber-100 hover:bg-amber-200'
                  : 'text-lime-600 bg-lime-100 hover:bg-lime-200'
                  }`}
                title={(driver.user.isActive ?? true) ? 'Khóa tài xế (Lock)' : 'Mở khóa (Unlock)'}
              >
                {(driver.user.isActive ?? true) ? <Lock size={18} /> : <ShieldCheck size={18} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingDriver(driver); }}
                className="p-2 rounded-xl text-lime-600 bg-lime-100 hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Audit dossier"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteRequest(driver); }}
                className="p-2 rounded-xl text-red-500 bg-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Delete profile"
              >
                <Trash2 size={18} />
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
        title="Driver Search"
        fields={[
          { key: 'term', label: 'Universal Search', placeholder: 'Search by ID, Name, Phone or Vehicle...', icon: Search },
        ]}
      />

      <FilterDriverModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        activeQuery={filterQuery}
      />

      <DriverDetailsModal
        isOpen={isDetailsOpen}
        driver={selectedDriver}
        onClose={() => setIsDetailsOpen(false)}
      />

      <EditDriverModal
        isOpen={!!editingDriver}
        driver={editingDriver}
        onClose={() => setEditingDriver(null)}
        onSave={async (data) => {
          await onEdit({ ...editingDriver!, ...data });
          setEditingDriver(null);
        }}
      />
    </motion.div>
  );
}
