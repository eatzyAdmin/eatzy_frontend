'use client';

import { useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import { usePromotions } from '@/features/promotions/hooks/usePromotions';
import PromotionsTable from '@/features/promotions/components/PromotionsTable';
import CreatePromotionModal from '@/features/promotions/components/CreatePromotionModal';
import { Voucher } from '@repo/types';

export default function PromotionsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    promotions,
    isLoading,
    refetch,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion
  } = usePromotions(searchTerm, filterQuery);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Voucher | null>(null);

  const handleEdit = (promo: Voucher) => {
    setSelectedPromo(promo);
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setSelectedPromo(null);
  };

  const handleSave = async (data: any) => {
    if (selectedPromo) {
      await updatePromotion({ ...data, id: selectedPromo.id });
    } else {
      await createPromotion(data);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      {/* Header */}
      <div className="px-8 pt-5 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-lime-200">
                <Tag size={12} />
                Marketing Console
              </span>
            </div>
            <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
              PROMOTIONS & VOUCHERS
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Quản lý các chương trình khuyến mãi, mã giảm giá và chiến dịch marketing trên toàn bộ hệ thống Eatzy.
            </p>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="h-14 px-8 rounded-3xl bg-[#1A1A1A] text-white hover:bg-primary transition-all duration-500 flex items-center gap-3 shadow-xl shadow-black/5 active:scale-95 group"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus size={16} strokeWidth={3} />
            </div>
            <span className="text-sm font-anton font-medium uppercase tracking-widest mt-0.5">New Campaign</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[600px] m-6">
        <PromotionsTable
          data={promotions}
          isLoading={isLoading}
          onRefresh={refetch}
          onEdit={handleEdit}
          onDelete={(id) => deletePromotion(id)}
          onToggleStatus={(id) => togglePromotion(id)}
          onSearch={setSearchTerm}
          onFilter={setFilterQuery}
          searchTerm={searchTerm}
        />
      </div>

      {/* Modals */}
      <CreatePromotionModal
        isOpen={createModalOpen}
        onClose={handleCloseModal}
        onSuccess={refetch}
        onSave={handleSave}
        initialData={selectedPromo || undefined}
      />
    </div>
  );
}
