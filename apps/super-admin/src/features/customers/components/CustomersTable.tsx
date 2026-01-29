'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  Search, Filter, Trash2, MapPin, Phone, RotateCcw, X, Eye, Play, Pause, Lock, Unlock, ShieldCheck, Edit
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, ImageWithFallback } from '@repo/ui';
import { ResCustomerProfileDTO } from '@repo/types';
import CustomerSearchPopup from './CustomerSearchPopup';
import FilterCustomerModal from './FilterCustomerModal';
import CustomerDetailsModal from './CustomerDetailsModal';
import EditCustomerModal from './EditCustomerModal';

interface CustomersTableProps {
  data: ResCustomerProfileDTO[];
  isLoading: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onRefresh: () => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, userId: number, isActive: boolean) => void;
  onUpdate: (id: number, userId: number, data: { name: string; hometown: string; dateOfBirth: string }) => Promise<void>;
  onSearch: (term: string) => void;
  onFilter: (query: string) => void;
  searchTerm: string;
  filterQuery: string;
}

export default function CustomersTable({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  onDelete,
  onToggleStatus,
  onUpdate,
  onSearch,
  onFilter,
  searchTerm,
  filterQuery
}: CustomersTableProps) {
  const { confirm } = useSwipeConfirmation();
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<ResCustomerProfileDTO | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<ResCustomerProfileDTO | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDeleteRequest = (customer: ResCustomerProfileDTO) => {
    confirm({
      title: 'Xóa hồ sơ khách hàng?',
      type: 'danger',
      description: `Hành động này sẽ xóa vĩnh viễn hồ sơ của ${customer.user.name}. Tài khoản đăng nhập của người dùng sẽ vẫn tồn tại nhưng hồ sơ khách hàng sẽ bị gỡ bỏ.`,
      confirmText: "Slide to Delete",
      onConfirm: async () => {
        await onDelete(customer.id);
      }
    });
  };

  const handleToggleStatusRequest = (customer: ResCustomerProfileDTO) => {
    const isActive = customer.user.isActive;
    confirm({
      title: isActive ? 'Tạm khóa người dùng?' : 'Mở khóa tài khoản?',
      type: isActive ? 'danger' : 'info',
      description: isActive
        ? `Người dùng ${customer.user.name} sẽ không thể đăng nhập vào hệ thống sau khi bị khóa.`
        : `Người dùng ${customer.user.name} sẽ có thể đăng nhập vào hệ thống ngay lập tức sau khi được mở khóa.`,
      confirmText: isActive ? "Slide to Lock" : "Slide to Unlock",
      onConfirm: async () => {
        await onToggleStatus(customer.id, customer.user.id, isActive);
      }
    });
  };

  const columns = [
    {
      label: 'CUSTOMER IDENTITY',
      key: 'user.name',
      formatter: (_: any, customer: ResCustomerProfileDTO) => (
        <div className="flex items-center gap-4 py-3 group/info pl-4">
          <div className="relative shrink-0 transition-transform duration-300 group-hover/info:scale-105">
            <div className="w-12 h-12 rounded-[20px] overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-100 relative bg-gray-50">
              <ImageWithFallback
                src={customer.user.avatar || ''}
                alt={customer.user.name}
                fill
                className="object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-2 border-white flex items-center justify-center shadow-sm
              ${customer.user.isActive ? 'bg-lime-500' : 'bg-gray-400'}`}>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="font-anton text-[15px] text-[#1A1A1A] uppercase tracking-tight leading-none mb-1.5 flex items-center gap-2">
              {customer.user.name}
              <span className="text-[9px] font-mono text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                #{customer.user.id}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 px-2 py-0.5 rounded-md border border-gray-100/30">
                <Phone size={10} className="text-primary" />
                {customer.user.phoneNumber}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'LOCATION & BIO',
      key: 'hometown',
      formatter: (value: string) => (
        <div className="py-2">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <MapPin size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-tight line-clamp-1">
              {value || 'Not specified'}
            </span>
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] leading-none opacity-60">
            Hometown Region
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'user.isActive',
      formatter: (isActive: boolean) => (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive
          ? 'bg-lime-100 text-lime-600 border border-lime-100'
          : 'bg-red-100 text-red-600 border border-red-100'
          }`}>
          {isActive ? (
            <>
              <ShieldCheck size={12} strokeWidth={3.2} />
              Active
            </>
          ) : (
            <>
              <Lock size={12} strokeWidth={3.2} />
              Disabled
            </>
          )}
        </span>
      )
    }
  ];

  const handleApplyFilters = (query: string) => {
    onFilter(query);
    setActiveFiltersCount(query ? 1 : 0);
  };

  useEffect(() => {
    setActiveFiltersCount(filterQuery ? 1 : 0);
  }, [filterQuery]);

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden"
    >
      <div className="p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_12px_rgba(132,204,22,0.4)]" />
            <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">User Directory</h3>
          </div>
          <p className="text-sm font-medium text-gray-400 pl-3.5">
            Browse and manage your growing customer base across the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group
                    ${searchTerm
                ? 'bg-primary text-white shadow-lg shadow-primary/30 border-transparent'
                : 'bg-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5 border-transparent'}`}
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
              >
                <X size={16} className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-12 h-12 rounded-full bg-gray-100 border transition-all shadow-sm flex items-center justify-center group border-gray-100 text-gray-600 hover:bg-white hover:shadow-xl hover:-translate-y-0.5"
            >
              <Filter className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={() => { onSearch(''); handleApplyFilters(''); }}
              className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center border border-transparent"
              title="Reset All"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="px-8 pt-0 relative">
        {filterQuery && (
          <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-1">Active Filters:</span>

            {filterQuery.includes('user.isActive:true') && (
              <button
                onClick={() => handleApplyFilters(filterQuery.replace('user.isActive:true', '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">Active</span></span>
                <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}

            {filterQuery.includes('user.isActive:false') && (
              <button
                onClick={() => handleApplyFilters(filterQuery.replace('user.isActive:false', '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim())}
                className="group flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border bg-white border-gray-200 text-gray-600 shadow-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <span>Status: <span className="text-primary uppercase group-hover:text-red-500 transition-colors">Disabled</span></span>
                <X size={12} className="w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-4 pt-0">
        <DataTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={onLoadMore}
          onRowClick={(customer) => setSelectedCustomer(customer)}
          emptyMessage="No customers found matching your criteria."
          handleSort={() => { }}
          renderActions={(customer: ResCustomerProfileDTO) => (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleStatusRequest(customer); }}
                className={`p-2 rounded-xl transition-all duration-300 shadow-sm ${!customer.user.isActive
                  ? 'text-lime-600 bg-lime-100 hover:bg-lime-200'
                  : 'text-amber-500 bg-amber-100 hover:bg-amber-200'
                  }`}
                title={customer.user.isActive ? 'Khóa khách hàng (Lock)' : 'Mở khóa (Unlock)'}
              >
                {customer.user.isActive ? <Lock size={18} /> : <ShieldCheck size={18} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setEditingCustomer(customer); }}
                className="p-2 rounded-xl text-lime-600 bg-lime-100 hover:bg-lime-200 transition-all duration-300 shadow-sm"
                title="Edit details"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteRequest(customer); }}
                className="p-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-all shadow-sm group/btn"
                title="Delete Record"
              >
                <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          )}
          headerClassName="bg-gray-100 text-gray-500 border-none rounded-xl py-4 mb-2"
        />
      </div>

      <CustomerSearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearch={onSearch}
      />

      <FilterCustomerModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        activeQuery={filterQuery}
      />

      <CustomerDetailsModal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customer={selectedCustomer}
      />

      <EditCustomerModal
        isOpen={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSuccess={onRefresh}
        onSave={onUpdate}
        customer={editingCustomer}
      />
    </motion.div>
  );
}
