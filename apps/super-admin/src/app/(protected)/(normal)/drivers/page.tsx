'use client';

import { useState } from 'react';
import { useDrivers } from '@/features/drivers/hooks/useDrivers';
import DriversTable from '@/features/drivers/components/DriversTable';
import CreateDriverModal from '@/features/drivers/components/CreateDriverModal';
import { Bike, Plus, RefreshCw } from 'lucide-react';

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStr, setFilterStr] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' } | undefined>();

  const {
    drivers,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    deleteDriver,
    updateDriver,
    createDriver
  } = useDrivers(searchTerm, filterStr, sortConfig?.field, sortConfig?.direction);

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
        <div>
          <h1 className="text-5xl font-anton uppercase tracking-tighter text-gray-900 mb-2">
            Logistic <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-md">
            Manage your network of specialized motorcycle delivery partners.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => refetch()}
            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:shadow-xl transition-all group"
          >
            <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-10 py-5 bg-[#1A1A1A] text-white rounded-[24px] font-anton text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-black/10 flex items-center gap-4 group"
          >
            Onboard Partner
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
              <Plus size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Main Table Feature */}
      <DriversTable
        data={drivers}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={fetchNextPage}
        onRefresh={() => refetch()}
        onEdit={(driver) => updateDriver(driver)}
        onDelete={(id) => deleteDriver(id)}
        onSearch={(term) => setSearchTerm(term)}
        onFilter={(query) => setFilterStr(query)}
        searchTerm={searchTerm}
        sortField={sortConfig?.field}
        sortDirection={sortConfig?.direction}
        onSort={(field) => {
          setSortConfig(prev => ({
            field,
            direction: prev?.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
          }));
        }}
      />

      <CreateDriverModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={async (data) => {
          await createDriver(data);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
