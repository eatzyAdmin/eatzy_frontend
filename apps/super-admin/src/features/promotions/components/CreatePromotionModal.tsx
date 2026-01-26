'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { X, Tag, FileText, Percent, Info, Calendar, Building2, CheckCircle, Globe, Ticket, DollarSign, Truck } from 'lucide-react';
import { useNotification, useSwipeConfirmation, DotsLoader } from '@repo/ui';
import { DiscountType, Voucher } from '@repo/types';
import { format } from 'date-fns';
import DateTimePicker from './DateTimePicker';
import RestaurantSelector from './RestaurantSelector';

interface CreatePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Partial<Voucher>;
}

export default function CreatePromotionModal({ isOpen, onClose, onSuccess, onSave, initialData }: CreatePromotionModalProps) {
  const { confirm } = useSwipeConfirmation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form State
  const [formData, setFormData] = useState<any>({
    code: '',
    description: '',
    discountType: DiscountType.PERCENTAGE,
    discountValue: 0,
    maxDiscountAmount: 0,
    minOrderValue: 0,
    startDate: '',
    endDate: '',
    usageLimitPerUser: 1,
    totalQuantity: 100,
    remainingQuantity: 100,
    active: true,
    restaurantIds: [],
    applyToAll: true
  });

  const [baseFormData, setBaseFormData] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const initialForm = {
          ...initialData,
          applyToAll: !initialData.restaurants || initialData.restaurants.length === 0,
          restaurantIds: initialData.restaurants?.map(r => r.id) || [],
          startDate: initialData.startDate || '',
          endDate: initialData.endDate || ''
        };
        setFormData(initialForm);
        setBaseFormData(JSON.stringify(initialForm));
      } else {
        setFormData({
          code: '',
          description: '',
          discountType: DiscountType.PERCENTAGE,
          discountValue: 0,
          maxDiscountAmount: 0,
          minOrderValue: 0,
          startDate: '',
          endDate: '',
          usageLimitPerUser: 1,
          totalQuantity: 100,
          remainingQuantity: 100,
          active: true,
          restaurantIds: [],
          applyToAll: true
        });
      }
    }
  }, [isOpen, initialData]);

  // Logic: Sync End Date with Start Date
  useEffect(() => {
    if (formData.startDate) {
      const start = new Date(formData.startDate);
      const end = formData.endDate ? new Date(formData.endDate) : null;

      // If end date is missing or before start date + 1 min
      if (!end || end.getTime() <= start.getTime()) {
        const newEnd = new Date(start.getTime() + 60000); // +1 minute
        setFormData((prev: any) => ({ ...prev, endDate: newEnd.toISOString() }));
      }
    }
  }, [formData.startDate]);

  const hasChanges = initialData ? baseFormData !== JSON.stringify(formData) : true;

  const isValid =
    hasChanges &&
    formData.code.trim().length > 0 &&
    formData.startDate.length > 0 &&
    formData.endDate.length > 0 &&
    (formData.discountType === DiscountType.FREESHIP || formData.discountValue > 0);

  const handleSubmit = () => {
    const isEdit = !!initialData;
    confirm({
      title: isEdit ? "Cập nhật chiến dịch?" : "Tạo chiến dịch mới?",
      type: 'info',
      description: isEdit
        ? "Bạn có chắc chắn muốn cập nhật thông tin cho chiến dịch này không?"
        : "Chiến dịch sẽ được kích hoạt ngay lập tức sau khi tạo thành công.",
      confirmText: isEdit ? "Slide to Update" : "Slide to Launch",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          const submitData = {
            ...formData,
            restaurants: formData.applyToAll ? [] : formData.restaurantIds.map((id: number) => ({ id }))
          };
          delete submitData.restaurantIds;
          delete submitData.applyToAll;
          await onSave(submitData);
          onSuccess();
          onClose();
        } catch (error) {
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[50]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#F8F9FA] w-full max-w-6xl h-[90vh] rounded-[48px] overflow-hidden shadow-2xl pointer-events-auto flex border border-white/20"
            >
              {/* LEFT: Form */}
              <div className="w-full md:w-[65%] bg-white border-r border-gray-100 flex flex-col relative z-20">
                <div className="p-10 pb-6 border-b border-gray-50 flex justify-between items-start shrink-0">
                  <div>
                    <h3 className="text-3xl font-anton font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
                      {initialData ? 'EDIT CAMPAIGN' : 'NEW CAMPAIGN'}
                    </h3>
                    <p className="text-gray-400 font-medium text-sm">Thiết lập chiến dịch khuyến mãi cho hệ thống Eatzy.</p>
                  </div>
                  <button onClick={onClose} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 pt-0 custom-scrollbar space-y-10 pb-40">
                  {/* 1. Identity */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-0">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <div className="flex items-center gap-2 text-[12px] font-bold text-primary uppercase bg-primary/5 px-3 py-1.5 rounded-full">
                        Campaign Identity
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="text-[11px] uppercase font-bold text-gray-400 block mb-2 px-1 tracking-wider">Campaign Code</label>
                        <input
                          type="text"
                          placeholder="e.g. EATZYFLASH24"
                          value={formData.code}
                          onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                          className="w-full bg-[#F8F9FA] border-2 border-transparent rounded-2xl px-6 py-4 text-xl font-anton text-primary outline-none focus:ring-2 focus:ring-primary/[0.03] focus:bg-white transition-all uppercase placeholder:text-gray-300"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[11px] uppercase font-bold text-gray-400 block mb-2 px-1 tracking-wider">Description</label>
                        <textarea
                          placeholder="Mô tả về chương trình khuyến mãi và điều khoản áp dụng..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-[#F8F9FA] border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-primary/[0.03] focus:bg-white transition-all min-h-[100px] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Value */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-0">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <div className="flex items-center gap-2 text-[12px] font-bold text-primary uppercase bg-primary/5 px-3 py-1.5 rounded-full">
                        Value & Constraints
                      </div>
                    </div>
                    <div className="p-8 bg-[#F8F9FA] rounded-[32px] border border-gray-100 space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-1">
                          <label className="text-[11px] uppercase font-bold text-gray-400 block mb-3 px-1 tracking-widest">
                            Discount Type
                            {initialData && <span className="ml-2 text-[9px] text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 italic">Locked in Edit Mode</span>}
                          </label>
                          <div className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm relative overflow-hidden">
                            {[
                              { type: DiscountType.PERCENTAGE, icon: Percent, label: 'Percentage' },
                              { type: DiscountType.FIXED, icon: DollarSign, label: 'Fixed Amount' },
                              { type: DiscountType.FREESHIP, icon: Truck, label: 'Free Ship' }
                            ].map((item) => {
                              const isSelected = formData.discountType === item.type;
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.type}
                                  disabled={!!initialData}
                                  onClick={() => setFormData({
                                    ...formData,
                                    discountType: item.type,
                                    discountValue: item.type === DiscountType.FREESHIP ? 0 : formData.discountValue
                                  })}
                                  className={`flex-1 py-4 px-3 rounded-[20px] text-[10px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-2 transition-all duration-300
                                    ${isSelected
                                      ? 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10'
                                      : 'text-gray-400 hover:bg-gray-50 bg-transparent'}
                                    ${!!initialData && !isSelected ? 'opacity-30' : ''}
                                    ${!!initialData ? 'cursor-not-allowed' : 'cursor-pointer'}
                                  `}
                                >
                                  <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-white/10' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                                    <Icon size={16} />
                                  </div>
                                  <span>{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="text-[11px] uppercase font-bold text-gray-400 block mb-3 px-1 tracking-widest">Discount Value</label>
                          <div className="relative group">
                            <input
                              type="text"
                              disabled={formData.discountType === DiscountType.FREESHIP}
                              value={formData.discountType === DiscountType.PERCENTAGE ? formData.discountValue : new Intl.NumberFormat('vi-VN').format(formData.discountValue)}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, discountValue: Math.max(0, Number(val)) });
                              }}
                              className={`w-full bg-white rounded-[24px] px-8 py-5 text-3xl font-anton outline-none border-2 transition-all pr-16 
                                ${formData.discountType === DiscountType.FREESHIP
                                  ? 'text-gray-200 border-gray-50 bg-gray-50/50'
                                  : 'text-[#1A1A1A] border-gray-100 focus:ring-2 focus:ring-primary/[0.03] shadow-sm'}`}
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-anton text-2xl text-gray-300">
                              {formData.discountType === DiscountType.PERCENTAGE ? '%' : formData.discountType === DiscountType.FIXED ? 'đ' : '-'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="text-[11px] uppercase font-bold text-gray-400 block mb-3 px-1 tracking-widest">Min Order Value</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={new Intl.NumberFormat('vi-VN').format(formData.minOrderValue)}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                setFormData({ ...formData, minOrderValue: Math.max(0, Number(val)) });
                              }}
                              className="w-full bg-white rounded-[24px] px-8 py-4 text-xl font-anton text-gray-700 outline-none border-2 border-gray-100 focus:ring-2 focus:ring-primary/[0.03] transition-all pr-12 shadow-sm"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-anton text-lg text-gray-300">đ</div>
                          </div>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          {formData.discountType === DiscountType.FREESHIP ? (
                            <></>
                          ) : formData.discountType === DiscountType.PERCENTAGE ? (
                            <>
                              <label className="text-[11px] uppercase font-bold text-gray-400 block mb-3 px-1 tracking-widest">Max Discount Amount</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={new Intl.NumberFormat('vi-VN').format(formData.maxDiscountAmount)}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    setFormData({ ...formData, maxDiscountAmount: Math.max(0, Number(val)) });
                                  }}
                                  className="w-full bg-white rounded-[24px] px-8 py-4 text-xl font-anton text-gray-700 outline-none border-2 border-gray-100 focus:ring-2 focus:ring-primary/[0.03] transition-all pr-12 shadow-sm"
                                />
                                <div className="absolute right-8 top-1/2 -translate-y-1/2 font-anton text-lg text-gray-300">đ</div>
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Scope */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-0">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <div className="flex items-center gap-2 text-[12px] font-bold text-primary uppercase bg-primary/5 px-3 py-1.5 rounded-full">
                        Application Scope
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <button
                        onClick={() => setFormData({ ...formData, applyToAll: true })}
                        className={`flex-1 p-6 rounded-[32px] border-2 text-left transition-all group relative overflow-hidden
                                        ${formData.applyToAll
                            ? 'border-primary bg-lime-50/40'
                            : 'border-gray-100 bg-[#F8F9FA] hover:border-gray-200'}`}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all ${formData.applyToAll ? 'bg-primary text-white' : 'bg-white text-gray-400'}`}>
                          <Globe size={20} />
                        </div>
                        <div className={`font-anton text-lg uppercase tracking-tight ${formData.applyToAll ? 'text-primary' : 'text-gray-900'}`}>Global Scope</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">Áp dụng cho mọi cửa hàng trên hệ thống</div>
                        {formData.applyToAll && <CheckCircle size={20} className="absolute top-6 right-6 text-primary" />}
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, applyToAll: false })}
                        className={`flex-1 p-6 rounded-[32px] border-2 text-left transition-all group relative overflow-hidden
                                        ${!formData.applyToAll
                            ? 'border-primary bg-lime-50/40'
                            : 'border-gray-100 bg-[#F8F9FA] hover:border-gray-200'}`}
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-all ${!formData.applyToAll ? 'bg-primary text-white' : 'bg-white text-gray-400'}`}>
                          <Building2 size={20} />
                        </div>
                        <div className={`font-anton text-lg uppercase tracking-tight ${!formData.applyToAll ? 'text-primary' : 'text-gray-900'}`}>Select Restaurants</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">Chỉ áp dụng cho các cửa hàng được chọn</div>
                        {!formData.applyToAll && <CheckCircle size={20} className="absolute top-6 right-6 text-primary" />}
                      </button>
                    </div>

                    {!formData.applyToAll && (
                      <RestaurantSelector
                        selectedIds={formData.restaurantIds}
                        onChange={(ids) => setFormData({ ...formData, restaurantIds: ids })}
                        onClear={() => setFormData({ ...formData, restaurantIds: [] })}
                      />
                    )}
                  </div>

                  {/* 4. Timeline */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-0">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      <div className="flex items-center gap-2 text-[12px] font-bold text-primary uppercase bg-primary/5 px-3 py-1.5 rounded-full">
                        Timeline & Limits
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <DateTimePicker
                          label="Start Date"
                          value={formData.startDate}
                          onChange={(val) => setFormData({ ...formData, startDate: val })}
                          minDate={new Date()}
                        />
                      </div>
                      <div>
                        <DateTimePicker
                          label="End Date"
                          value={formData.endDate}
                          onChange={(val) => setFormData({ ...formData, endDate: val })}
                          minDate={formData.startDate ? new Date(new Date(formData.startDate).getTime() + 60000) : new Date()}
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[11px] uppercase font-bold text-gray-400 block mb-2 px-1 tracking-wider">
                          {initialData ? 'Adjust Quantity (+/-)' : 'Total Quantity'}
                        </label>
                        <input
                          type="number"
                          value={initialData ? (formData.adjustment || 0) : formData.totalQuantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (initialData) {
                              // Prevent decreasing quantity more than available (remaining)
                              const minAdjustment = -(initialData.remainingQuantity || 0);
                              const safeVal = Math.max(minAdjustment, val);

                              setFormData({
                                ...formData,
                                adjustment: safeVal,
                                totalQuantity: (initialData.totalQuantity || 0) + safeVal
                              });
                            } else {
                              const posVal = Math.max(1, val);
                              setFormData({ ...formData, totalQuantity: posVal, remainingQuantity: posVal });
                            }
                          }}
                          className="w-full bg-[#F8F9FA] rounded-2xl px-6 py-4 text-xl font-anton text-gray-900 outline-none border-2 border-transparent focus:ring-2 focus:ring-primary/[0.03] transition-all"
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="text-[11px] uppercase font-bold text-gray-400 block mb-2 px-1 tracking-wider">Usage Limit Per User</label>
                        <input
                          type="number"
                          value={formData.usageLimitPerUser}
                          onChange={(e) => setFormData({ ...formData, usageLimitPerUser: Math.max(1, Number(e.target.value)) })}
                          className="w-full bg-[#F8F9FA] rounded-2xl px-6 py-4 text-xl font-anton text-gray-900 outline-none border-2 border-transparent focus:ring-2 focus:ring-primary/[0.03] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Preview (35%) */}
              <div className="w-[38%] bg-[#1A1A1A] flex flex-col p-0 relative overflow-hidden hidden md:flex border-l border-white/5">
                {/* Abstract decorative backgrounds */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

                <div className="flex-1 w-full custom-scrollbar flex flex-col items-center pt-10 pb-40 px-8">
                  <div className="relative z-10 w-full max-w-[340px]">

                    {/* Ticket Card - Premium Eatzy Style */}
                    <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl relative">
                      {/* Top Part */}
                      <div className="p-8 pb-4 text-center relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-[24px] flex items-center justify-center mb-6 border border-primary/20">
                            <Ticket size={32} className="text-primary" />
                          </div>
                          <h3 className="text-3xl font-anton uppercase tracking-tight text-[#1A1A1A] mb-3 leading-none break-all">
                            {formData.code || 'CODE'}
                          </h3>
                          <div className="text-primary font-bold text-xs bg-primary/5 inline-block px-4 py-1.5 rounded-full border border-primary/10 uppercase tracking-widest">
                            {formData.discountType === DiscountType.PERCENTAGE
                              ? `Giảm ${formData.discountValue}%`
                              : formData.discountType === DiscountType.FIXED
                                ? `Giảm ${new Intl.NumberFormat('vi-VN').format(formData.discountValue)}đ`
                                : 'Miễn phí vận chuyển'}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50">
                          <p className="text-xs font-medium text-gray-400 italic line-clamp-3">
                            {formData.description || 'Chưa có mô tả cho chiến dịch này...'}
                          </p>
                        </div>
                      </div>

                      {/* Tear Line Section */}
                      <div className="relative flex items-center justify-between px-0 bg-white">
                        <div className="w-6 h-12 bg-[#1A1A1A] rounded-r-full -ml-[1px]"></div>
                        <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-4 h-px"></div>
                        <div className="w-6 h-12 bg-[#1A1A1A] rounded-l-full -mr-[1px]"></div>
                      </div>

                      {/* Bottom Part */}
                      <div className="p-8 pt-4 space-y-6 bg-gray-50/50">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none mb-1.5">Quantity</span>
                            <span className="font-anton text-xl text-[#1A1A1A] leading-none">{formData.totalQuantity}</span>
                          </div>
                          <div className="h-8 w-px bg-gray-100" />
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest leading-none mb-1.5">Usage Limit / User</span>
                            <span className="font-anton text-xl text-[#1A1A1A] leading-none">{formData.usageLimitPerUser}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 pb-2">
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                            <span className="text-gray-400">Thời hạn chiến dịch</span>
                            <span className="text-primary">
                              {formData.endDate ? format(new Date(formData.endDate), 'dd/MM/yyyy') : 'KHÔNG GIỚI HẠN'}
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-200/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer Action */}
                <div className="w-full px-10 py-8 absolute bottom-0 left-0">
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                    className={`group w-full py-6 bg-primary text-white rounded-[28px] font-anton text-2xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-primary/40 active:scale-[0.98] 
                      ${(!isValid || isSubmitting)
                        ? 'opacity-30 shadow-none cursor-not-allowed'
                        : 'hover:bg-white hover:text-primary'}`}
                  >
                    {isSubmitting ? (
                      <DotsLoader color="currentColor" size={8} />
                    ) : (
                      <>
                        <span>{initialData ? 'SAVE CHANGES' : 'LAUNCH CAMPAIGN'}</span>
                        <CheckCircle size={26} className={`${(!isValid || isSubmitting) ? '' : 'group-hover:translate-x-1'} transition-transform`} />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
