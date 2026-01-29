'use client';

import { useState, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useRestaurants } from '@/features/restaurants/hooks/useRestaurants';
import RestaurantsTable from '@/features/restaurants/components/RestaurantsTable';
import CreateRestaurantModal from '@/features/restaurants/components/CreateRestaurantModal';
import { Restaurant, RestaurantStatus } from '@repo/types';

export default function RestaurantsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    restaurants,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    toggleStatus
  } = useRestaurants(searchTerm, filterQuery);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setSelectedRestaurant(null);
  };

  const handleSave = async (data: any) => {
    if (selectedRestaurant) {
      await updateRestaurant({ ...data, id: selectedRestaurant.id });
    } else {
      await createRestaurant(data);
    }
    refetch();
  };


  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <div className="px-8 pt-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={12} />
                Network Management
              </span>
            </div>
            <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
              RESTAURANT PARTNERS
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý danh sách, trạng thái hoạt động và tỉ lệ chiết khấu của các cửa hàng đối tác.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-14 px-8 rounded-3xl bg-[#1A1A1A] text-white hover:bg-primary transition-all duration-500 flex items-center gap-3 shadow-xl shadow-black/5 active:scale-95 group"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-anton font-medium uppercase tracking-widest mt-0.5">Add Partner</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px] m-6">
        <RestaurantsTable
          data={restaurants}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          onRefresh={refetch}
          onEdit={handleEdit}
          onDelete={(id) => deleteRestaurant(id)}
          onToggleStatus={(id, userId, isActive) => toggleStatus({ id, userId, isActive })}
          onSearch={setSearchTerm}
          onFilter={setFilterQuery}
          searchTerm={searchTerm}
        />
      </div>

      {/* Modals */}
      <CreateRestaurantModal
        isOpen={createModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={selectedRestaurant || undefined}
      />
    </div>
  );
}
