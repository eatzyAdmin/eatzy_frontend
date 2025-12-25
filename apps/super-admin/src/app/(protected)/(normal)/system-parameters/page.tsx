'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { Edit2, Save, Percent, Truck, Store, MapPin, DollarSign } from 'lucide-react';
import { useSwipeConfirmation, useNotification } from '@repo/ui';
import { mockSystemParameters } from '../../../../data/mockSystemParameters';

export default function SystemParametersPage() {
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  // Load initial data from mock
  const initialDriverCommission = mockSystemParameters.find(p => p.id === 'driver_commission')?.value || 0;
  const initialRestaurantCommission = mockSystemParameters.find(p => p.id === 'restaurant_commission')?.value || 0;
  const initialDeliveryFee = mockSystemParameters.find(p => p.id === 'delivery_fee_per_km')?.value || 0;

  // State
  const [driverCommission, setDriverCommission] = useState(initialDriverCommission);
  const [restaurantCommission, setRestaurantCommission] = useState(initialRestaurantCommission);
  const [deliveryFeePerKm, setDeliveryFeePerKm] = useState(initialDeliveryFee);

  // Editable State
  const [editedDriverCommission, setEditedDriverCommission] = useState(initialDriverCommission);
  const [editedRestaurantCommission, setEditedRestaurantCommission] = useState(initialRestaurantCommission);
  const [editedDeliveryFeePerKm, setEditedDeliveryFeePerKm] = useState(initialDeliveryFee);

  const [isEditing, setIsEditing] = useState(false);
  const editFormRef = useRef<HTMLDivElement>(null);

  // Check changes
  const hasChanges = () => {
    return (
      editedDriverCommission !== driverCommission ||
      editedRestaurantCommission !== restaurantCommission ||
      editedDeliveryFeePerKm !== deliveryFeePerKm
    );
  };

  // Helper format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const handleSave = () => {
    if (!hasChanges()) {
      showNotification({
        message: 'Không có thay đổi nào để lưu!',
        format: 'Vui lòng thay đổi ít nhất một thông số',
        type: 'error',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Xác nhận cập nhật thông số',
      description: 'Bạn có chắc chắn muốn thay đổi các thông số hệ thống này?',
      confirmText: 'Vuốt để xác nhận',
      type: 'warning',
      onConfirm: async () => {
        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));

        setDriverCommission(editedDriverCommission);
        setRestaurantCommission(editedRestaurantCommission);
        setDeliveryFeePerKm(editedDeliveryFeePerKm);
        setIsEditing(false);

        showNotification({
          message: 'Cập nhật thông số thành công!',
          format: 'Các thông số hệ thống đã được lưu',
          type: 'success',
          autoHideDuration: 4000
        });
      },
    });
  };

  const handleCancel = () => {
    setEditedDriverCommission(driverCommission);
    setEditedRestaurantCommission(restaurantCommission);
    setEditedDeliveryFeePerKm(deliveryFeePerKm);
    setIsEditing(false);
  };

  const cardMotion = {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2 uppercase tracking-tight">
          Tham số hệ thống
        </h2>
        <p className="text-gray-500 mb-8">
          Quản lý các thông số vận hành của hệ thống Eatzy.
        </p>

        {/* Overview Cards */}
        <motion.div {...cardMotion} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Driver Commission */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(16, 185, 129, 0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="opacity-[0.05] text-[var(--primary)] transform scale-[2.5] translate-x-12 translate-y-4">
                  <Truck size={60} strokeWidth={3} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2, ease: 'easeInOut' }}
                className="mr-5 flex-shrink-0 z-10 p-3 bg-emerald-50 rounded-xl"
              >
                <Truck size={32} className="text-emerald-600" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Hoa hồng tài xế</p>
                <p className="text-3xl font-bold text-gray-800">
                  {driverCommission}%
                </p>
              </div>
            </motion.div>

            {/* Restaurant Commission */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(245, 158, 11, 0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="opacity-[0.05] text-amber-500 transform scale-[2.5] translate-x-12 translate-y-4">
                  <Store size={60} strokeWidth={3} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.2, ease: 'easeInOut' }}
                className="mr-5 flex-shrink-0 z-10 p-3 bg-amber-50 rounded-xl"
              >
                <Store size={32} className="text-amber-600" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Hoa hồng quán ăn</p>
                <p className="text-3xl font-bold text-gray-800">
                  {restaurantCommission}%
                </p>
              </div>
            </motion.div>

            {/* Delivery Fee - Full width */}
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(59, 130, 246, 0.10)' }}
              className="relative bg-white rounded-2xl p-6 flex items-center shadow-lg border border-gray-100 md:col-span-2 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="opacity-[0.05] text-blue-500 transform scale-[2.5] translate-x-20 translate-y-6">
                  <MapPin size={60} strokeWidth={3} />
                </div>
              </div>
              <motion.span
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ repeat: Infinity, repeatType: 'reverse', duration: 2.4, ease: 'easeInOut' }}
                className="mr-5 flex-shrink-0 z-10 p-3 bg-blue-50 rounded-xl"
              >
                <MapPin size={32} className="text-blue-600" strokeWidth={2} />
              </motion.span>
              <div className="z-10">
                <p className="text-sm font-medium text-gray-500 mb-1">Giá giao hàng / 1km</p>
                <p className="text-3xl font-bold text-gray-800">
                  {formatCurrency(deliveryFeePerKm)} đ
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <AnimatePresence mode="wait">
          {isEditing && (
            <motion.div
              ref={editFormRef}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1],
                scale: { duration: 0.3 }
              }}
              className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 ring-1 ring-gray-200/50"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Edit2 size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Chỉnh sửa tham số</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Driver Commission Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Truck size={16} className="text-emerald-500" />
                    Hoa hồng tài xế (%)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editedDriverCommission}
                      onChange={e => setEditedDriverCommission(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-800 bg-gray-50 focus:bg-white transition-all duration-200 font-semibold text-lg"
                      placeholder="Nhập phần trăm..."
                    />
                    <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Phí khấu trừ trên mỗi chuyến xe hoàn thành.</p>
                </div>

                {/* Restaurant Commission Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Store size={16} className="text-amber-500" />
                    Hoa hồng quán ăn (%)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={editedRestaurantCommission}
                      onChange={e => setEditedRestaurantCommission(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-gray-800 bg-gray-50 focus:bg-white transition-all duration-200 font-semibold text-lg"
                      placeholder="Nhập phần trăm..."
                    />
                    <Percent size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Phí khấu trừ trên mỗi đơn hàng thành công.</p>
                </div>

                {/* Delivery Fee Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-500" />
                    Giá giao hàng / 1km (VNĐ)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={editedDeliveryFeePerKm}
                      onChange={e => setEditedDeliveryFeePerKm(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 bg-gray-50 focus:bg-white transition-all duration-200 font-semibold text-lg"
                      placeholder="Nhập số tiền..."
                    />
                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">VNĐ</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 ml-1">Đơn giá tính cước vận chuyển cơ bản cho mỗi km.</p>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8 border-t border-gray-100 pt-6">
                <button
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/30 flex items-center font-semibold gap-2 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Save size={18} />
                  Lưu thay đổi
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Button Float */}
        {!isEditing && (
          <div className="flex justify-end sticky bottom-8">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => {
                  editFormRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                  });
                }, 100);
              }}
              className="px-6 py-3 rounded-full bg-primary text-white flex items-center font-bold tracking-wide gap-2 shadow-xl hover:shadow-2xl transition-all"
            >
              <Edit2 size={18} />
              Chỉnh sửa thông số
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
