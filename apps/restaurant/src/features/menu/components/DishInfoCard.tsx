'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ImageWithFallback, useSwipeConfirmation, useNotification } from '@repo/ui';
import { Dish, MenuCategory } from '@repo/types';
import { Camera, Save, ChevronDown } from '@repo/ui/icons';

interface DishInfoCardProps {
  dish: Dish;
  onUpdate: (updatedDish: Dish) => void;
  onClose: () => void;
  mode?: 'edit' | 'create';
  categories?: MenuCategory[];
  layoutId?: string;
}

export default function DishInfoCard({ dish, onUpdate, onClose, mode = 'edit', categories, layoutId }: DishInfoCardProps) {
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  const [name, setName] = useState(dish.name);
  const [description, setDescription] = useState(dish.description);
  const [imageUrl, setImageUrl] = useState(dish.imageUrl);
  const [price, setPrice] = useState(dish.price || 0);
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [currentStock, setCurrentStock] = useState(dish.availableQuantity || 0);
  const [menuCategoryId, setMenuCategoryId] = useState(dish.menuCategoryId);
  const [isCatOpen, setIsCatOpen] = useState(false);

  // Reset local state when dish changes
  useEffect(() => {
    setName(dish.name);
    setDescription(dish.description);
    setImageUrl(dish.imageUrl);
    setPrice(dish.price || 0);
    setCurrentStock(dish.availableQuantity || 0);
    setStockAdjustment(0);
    setMenuCategoryId(dish.menuCategoryId);
    setIsCatOpen(false);
  }, [dish.id, dish.name, dish.description, dish.imageUrl, dish.price, dish.availableQuantity, dish.menuCategoryId]);

  const handleStockChange = (delta: number) => {
    if (mode === 'create') {
      setCurrentStock(prev => Math.max(0, prev + delta));
    } else {
      setStockAdjustment(prev => prev + delta);
    }
  };

  const handleApplyStock = () => {
    if (stockAdjustment === 0) return;
    const newStock = Math.max(0, currentStock + stockAdjustment);
    setCurrentStock(newStock);
    setStockAdjustment(0);
    onUpdate({ ...dish, availableQuantity: newStock });
  };

  const validate = () => {
    if (!name || !name.trim()) return 'Vui lòng nhập tên món ăn';
    if (!description || !description.trim()) return 'Vui lòng nhập mô tả món ăn';
    if (!menuCategoryId) return 'Vui lòng chọn danh mục';
    if (price < 0) return 'Giá món ăn không hợp lệ';
    return null;
  };

  const hasChanges = () => {
    if (mode === 'create') return true;
    if (name !== dish.name) return true;
    if ((description || '') !== (dish.description || '')) return true;
    if (imageUrl !== dish.imageUrl) return true;
    if (price !== (dish.price || 0)) return true;
    if (menuCategoryId !== dish.menuCategoryId) return true;
    if (stockAdjustment !== 0) return true;
    if (mode === 'edit' && currentStock !== dish.availableQuantity && stockAdjustment === 0) {
      return false;
    }
    return false;
  };

  const executeSave = () => {
    let finalStock = currentStock;
    if (mode === 'edit') {
      finalStock = currentStock + stockAdjustment;
    }

    onUpdate({
      ...dish,
      name,
      description,
      imageUrl,
      price,
      availableQuantity: finalStock,
      menuCategoryId,
      optionGroups: dish.optionGroups
    });

    if (mode === 'edit' && stockAdjustment !== 0) {
      handleApplyStock();
    }

    showNotification({
      message: mode === 'create' ? 'Đã thêm món mới thành công!' : 'Đã cập nhật món ăn thành công!',
      type: 'success'
    });
    onClose();
  };

  const handleSaveDetails = () => {
    const error = validate();
    if (error) {
      showNotification({ message: error, type: 'error' });
      return;
    }

    if (!hasChanges()) {
      showNotification({ message: 'Không có thay đổi nào để lưu', type: 'error', format: "Kiểm tra lại thông tin và thử lại!" });
      return;
    }

    if (mode === 'edit') {
      confirm({
        title: 'Lưu thay đổi?',
        description: 'Bạn có chắc chắn muốn lưu các thay đổi cho món ăn này không?',
        confirmText: 'Lưu thay đổi',
        type: 'info',
        processingDuration: 1500,
        onConfirm: executeSave
      });
    } else {
      confirm({
        title: 'Thêm món mới?',
        description: 'Bạn có chắc chắn muốn thêm món ăn này vào thực đơn?',
        confirmText: 'Thêm món',
        type: 'info',
        processingDuration: 1500,
        onConfirm: executeSave
      });
    }
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-[#F7F7F7] rounded-[32px] p-8 h-full flex flex-col shadow-2xl border border-white/50 overflow-hidden"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-6 pb-4 px-1">
        {mode === 'create' && categories && (
          <div className="relative z-20">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Danh mục món</label>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-[#1A1A1A] flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              <span>{categories.find(c => c.id === menuCategoryId)?.name || 'Chọn danh mục...'}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isCatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-2"
                >
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setMenuCategoryId(c.id); setIsCatOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center justify-between group ${menuCategoryId === c.id ? 'bg-[var(--primary)]/5 text-[var(--primary)]' : 'text-gray-600'}`}
                    >
                      <span>{c.name}</span>
                      {menuCategoryId === c.id && <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]"></div>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Name Edit */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tên món</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[var(--primary)] text-[32px] font-anton font-bold text-[#1A1A1A] px-0 py-2 focus:outline-none transition-colors placeholder:text-gray-300"
            style={{ fontFamily: 'var(--font-anton), sans-serif' }}
            placeholder="NHẬP TÊN MÓN..."
          />
        </div>

        {/* Description Edit */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mô tả</label>
          <textarea
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-white/50 rounded-xl border border-gray-200 p-4 text-sm text-[#555] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 resize-none transition-all"
            placeholder="Mô tả món ăn..."
          />
        </div>

        {/* Price Edit */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Giá gốc (VNĐ)</label>
          <input
            type="text"
            value={price === 0 ? '' : price.toLocaleString('vi-VN')}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\./g, '');
              if (/^\d*$/.test(rawValue)) {
                setPrice(Number(rawValue));
              }
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-[#1A1A1A] focus:outline-none focus:border-[var(--primary)]"
            placeholder="0"
          />
        </div>

        {/* Stock Management */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {mode === 'create' ? 'Số lượng ban đầu' : 'Tồn kho hiện tại'}
            </label>
            <span className="text-xl font-bold text-[#1A1A1A]">{currentStock}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => handleStockChange(-10)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-xs">-10</button>
              <button onClick={() => handleStockChange(-1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-xs">-1</button>
            </div>

            {mode === 'edit' && (
              <div className={`text-lg font-bold ${stockAdjustment > 0 ? 'text-green-600' : stockAdjustment < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {stockAdjustment > 0 ? '+' : ''}{stockAdjustment}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button onClick={() => handleStockChange(1)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-xs">+1</button>
              <button onClick={() => handleStockChange(10)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-colors text-xs">+10</button>
            </div>
          </div>

          {mode === 'edit' && stockAdjustment !== 0 && (
            <motion.button
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onClick={handleApplyStock}
              className="w-full mt-3 bg-[#1A1A1A] text-white rounded-xl py-2 text-xs font-bold uppercase tracking-wide hover:bg-black transition-colors"
            >
              Cập nhật tồn kho
            </motion.button>
          )}
        </div>

        {/* Image Edit */}
        <div className="relative aspect-[16/10] bg-gray-100 rounded-[24px] overflow-hidden group border border-gray-200 shrink-0">
          {imageUrl ? (
            <ImageWithFallback src={imageUrl} alt={name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <Camera className="w-8 h-8 opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-white/90 text-[#1A1A1A] px-4 py-2 rounded-full text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
              {imageUrl ? 'Đổi ảnh' : 'Thêm ảnh'}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Button */}
      <div className="mt-4 pt-4 border-t border-gray-200/50">
        <button
          onClick={handleSaveDetails}
          className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold shadow-lg shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>{mode === 'create' ? 'TẠO MÓN' : 'LƯU THAY ĐỔI'}</span>
        </button>
      </div>
    </motion.div>
  );
}
