'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  User, Search, Filter, Play, Pause, AlertCircle, X,
  RotateCcw, Bike, Star, ShieldCheck, Mail, Navigation, Info, Edit, Trash2
} from 'lucide-react';
import { DataTable, useSwipeConfirmation } from '@repo/ui';
import { DriverProfile, DriverStatus, VerificationStatus } from '@repo/types';
import FilterDriverModal from './FilterDriverModal';
import DriverDetailsModal from './DriverDetailsModal';
import EditDriverModal from './EditDriverModal';
import DriverSearchPopup from './DriverSearchPopup';

interface DriversTableProps {
  data: DriverProfile[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onEdit: (driver: DriverProfile) => void;
  onDelete: (id: number) => void;
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

  const handleActionRequest = (driver: DriverProfile, type: 'delete') => {
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

  const getVerificationBadge = (status?: VerificationStatus) => {
    switch (status) {
      case 'APPROVED':
        return <ShieldCheck size={14} className="text-lime-500" />;
      case 'PENDING':
        return <AlertCircle size={14} className="text-amber-500 animate-pulse" />;
      case 'REJECTED':
        return <X size={14} className="text-red-500" />;
      default:
        return <Info size={14} className="text-gray-300" />;
    }
  };

  const columns = [
    {
      label: 'DRIVER IDENTITY',
      key: 'user.name',
      formatter: (_: any, driver: DriverProfile) => {
        const isAvailable = driver.status === 'AVAILABLE';
        return (
          <div className="flex items-center gap-4 py-2 group/info">
            <div className={`w-12 h-12 rounded-2xl ${isAvailable ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-lg shadow-black/5`}>
              <User size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                {driver.user.name}
                {getVerificationBadge(driver.profile_photo_status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Mail size={10} /> {driver.user.email}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'FLEET & COD',
      key: 'vehicle_license_plate',
      formatter: (_: any, driver: DriverProfile) => (
        <div className="py-2">
          <div className="flex items-center gap-2 mb-1">
            <Bike size={14} className="text-primary" />
            <span className="font-anton text-sm text-gray-900 uppercase">
              {driver.vehicle_license_plate || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {driver.vehicle_brand} {driver.vehicle_model}
            </span>
            <div className="text-[9px] font-bold text-primary uppercase tracking-tight flex items-center gap-1 mt-1 bg-lime-50 px-2 py-0.5 rounded-md w-fit border border-lime-100">
              COD Limit: {new Intl.NumberFormat('vi-VN').format(driver.codLimit || 0)}đ
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'PERFORMANCE',
      key: 'averageRating',
      formatter: (_: any, driver: DriverProfile) => (
        <div className="py-2 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-anton text-sm text-gray-900">
                {driver.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100" />

          <div className="flex flex-col">
            <span className="font-anton text-sm text-gray-900 mb-0.5">
              {driver.completedTrips || 0}
            </span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Trips</span>
          </div>
        </div>
      )
    },
    {
      label: 'OPERATIONAL STATUS',
      key: 'status',
      formatter: (val: string) => {
        const isOnline = val === 'AVAILABLE' || val === 'BUSY';
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isOnline ? 'bg-lime-100 text-lime-600 border border-lime-100 shadow-sm' : 'bg-gray-100 text-gray-400 border border-gray-100'}`}>
            {val === 'AVAILABLE' ? (
              <>
                <Play size={10} fill="currentColor" />
                Available
              </>
            ) : val === 'BUSY' ? (
              <>
                <Navigation size={10} fill="currentColor" />
                In Delivery
              </>
            ) : (
              <>
                <Pause size={10} fill="currentColor" />
                Offline
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
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Partner Drivers</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5" style={{ wordSpacing: "1px" }}>
            Monitor and manage your delivery network and partner performance.
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
          emptyMessage="No drivers found matching your search criteria."
          onRowClick={(driver) => {
            setSelectedDriver(driver);
            setIsDetailsOpen(true);
          }}
          renderActions={(driver) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingDriver(driver);
                }}
                className="p-2 rounded-xl text-primary bg-lime-50 hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Audit dossier"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleActionRequest(driver, 'delete');
                }}
                className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                title="Delete profile"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      <DriverSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearch={onSearch}
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
