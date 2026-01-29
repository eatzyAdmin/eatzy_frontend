'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import CustomersTable from '@/features/customers/components/CustomersTable';

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    customers,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    deleteCustomer,
    toggleStatus,
    updateCustomer
  } = useCustomers(searchTerm, filterQuery);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <div className="px-8 pt-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Users size={12} />
                CRM Intelligence
              </span>
            </div>
            <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
              CUSTOMER BASE
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý toàn bộ hồ sơ khách hàng, tra cứu thông tin cá nhân và giám sát hoạt động tài khoản trên hệ thống.
            </p>
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px] m-6">
        <CustomersTable
          data={customers}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          onRefresh={refetch}
          onDelete={(id) => deleteCustomer(id)}
          onToggleStatus={(id, userId, isActive) => toggleStatus({ id, userId, isActive })}
          onUpdate={async (id, userId, data) => { await updateCustomer({ id, userId, data }); }}
          onSearch={setSearchTerm}
          onFilter={setFilterQuery}
          searchTerm={searchTerm}
          filterQuery={filterQuery}
        />
      </div>
    </div>
  );
}
