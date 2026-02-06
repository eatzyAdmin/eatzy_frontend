'use client';

import { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import {
  User, Search, Filter, Trash2, MapPin, Phone, RotateCcw, X, Eye, Play, Pause, Lock, Unlock, ShieldCheck, Edit
} from 'lucide-react';
import { DataTable, useSwipeConfirmation, SearchPopup, TableHeader } from '@repo/ui';
import { ResCustomerProfileDTO } from '@repo/types';
import FilterCustomerModal from './FilterCustomerModal';
import CustomerDetailsModal from './CustomerDetailsModal';
import EditCustomerModal from './EditCustomerModal';
import { getCustomersColumns } from './CustomersColumns';
import CustomersFilterBadges from './CustomersFilterBadges';
import { useMemo } from 'react';

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

  const columns = useMemo(() => getCustomersColumns(), []);

  const handleApplyFilters = (query: string) => {
    onFilter(query);
    setActiveFiltersCount(query ? 1 : 0);
  };

  const removeFilter = (part: string) => {
    const newQuery = filterQuery.replace(part, '').replace(/^\s*and\s*|\s*and\s*$/g, '').trim();
    handleApplyFilters(newQuery);
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
      <TableHeader
        title="Customer Directory"
        description="View and manage customer profiles, account status and activity."
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        onSearchClick={() => setIsSearchOpen(true)}
        onFilterClick={() => setIsFilterOpen(true)}
        onClearAll={() => { onSearch(''); handleApplyFilters(''); }}
        onResetFilters={() => handleApplyFilters('')}
      />

      <div className="px-8 pt-0 pb-4 relative">
        <CustomersFilterBadges
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
          onRowClick={(customer) => setSelectedCustomer(customer)}
          emptyTitle="No Customers Found"
          emptyMessage="Không tìm thấy khách hàng nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi bộ lọc."
          emptyIcon={<User size={48} />}
          onResetFilters={() => { onSearch(''); handleApplyFilters(''); onRefresh(); }}
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

      <SearchPopup<{ term: string }>
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        value={{ term: searchTerm }}
        onSearch={(vals) => onSearch(vals.term)}
        onClear={() => onSearch('')}
        title="Customer Search"
        fields={[
          { key: 'term', label: 'Universal Search', placeholder: 'Search by ID, Name or Phone Number...', icon: Search },
        ]}
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
