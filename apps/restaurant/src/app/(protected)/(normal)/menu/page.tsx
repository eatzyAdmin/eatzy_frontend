'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ImageWithFallback, useLoading, useHoverHighlight, HoverHighlightOverlay, useSwipeConfirmation, useNotification, RestaurantMenuShimmer } from '@repo/ui';
import { Dish, MenuCategory } from '@repo/types';
import { Edit2, Search, Plus, Settings, Trash2 } from '@repo/ui/icons';
import { mockCategories, mockDishes as initialMockDishes } from '@/features/menu/data/mockMenuData';
import DishInfoCard from '@/features/menu/components/DishInfoCard';
import DishEditModal from '@/features/menu/components/DishEditModal';
import CategoryManagerModal from '@/features/menu/components/CategoryManagerModal';
import { formatVnd } from '@repo/lib';

export default function MenuPage() {
  const { hide } = useLoading();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();

  const [categories, setCategories] = useState<MenuCategory[]>(mockCategories);
  const [dishes, setDishes] = useState<Dish[]>(initialMockDishes);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [editingDish, setEditingDish] = useState<Dish | null>(null); // Draft state
  const [dishMode, setDishMode] = useState<'edit' | 'create'>('edit');
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Sync editingDish when selectedDish changes (deep copy)
  useEffect(() => {
    if (selectedDish) {
      setEditingDish(JSON.parse(JSON.stringify(selectedDish)));
    } else {
      setEditingDish(null);
    }
  }, [selectedDish]);

  const handleDraftChange = (updates: Partial<Dish>) => {
    setEditingDish(prev => prev ? { ...prev, ...updates } : null);
  };

  // Scroll references
  const tabsRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const {
    containerRef: tabContainerRef,
    rect: tabRect,
    style: tabStyle,
    moveHighlight: tabMove,
    clearHover: tabClear
  } = useHoverHighlight<HTMLDivElement>();

  useEffect(() => {
    // Match OrdersPage loading pattern
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  // Observer for active category
  useEffect(() => {
    const mainEl = mainScrollRef.current;
    if (!mainEl) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        // Find the one closest to top
        const topMost = visible.reduce((prev, curr) =>
          Math.abs(curr.boundingClientRect.top) < Math.abs(prev.boundingClientRect.top) ? curr : prev
        );
        const id = topMost.target.getAttribute('data-id');
        if (id) setActiveCategoryId(id);
      }
    }, { root: mainEl, rootMargin: '-10% 0px -60% 0px', threshold: 0 });

    categories.forEach(c => {
      const el = sectionRefs.current[c.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);
    const el = sectionRefs.current[id];
    if (el && mainScrollRef.current) {
      // Scroll to align element top to container top
      const containerTop = mainScrollRef.current.getBoundingClientRect().top;
      const elTop = el.getBoundingClientRect().top;
      const offset = elTop - containerTop + mainScrollRef.current.scrollTop;

      mainScrollRef.current.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const filteredDishes = useMemo(() => {
    if (!searchQuery) return dishes;
    return dishes.filter(d =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dishes, searchQuery]);

  // Dish Handlers
  const handleDishUpdate = (updatedDish: Dish) => {
    if (dishMode === 'create') {
      setDishes(prev => [...prev, updatedDish]);
      setDishMode('edit'); // Switch to edit after creation
      setSelectedDish(updatedDish); // This will trigger useEffect to update editingDish, keeping UI in sync
    } else {
      setDishes(prev => prev.map(d => d.id === updatedDish.id ? updatedDish : d));
      setSelectedDish(updatedDish); // Update source of truth
    }
  };

  const handleDeleteDish = (e: React.MouseEvent, dishId: string) => {
    e.stopPropagation();
    confirm({
      title: 'Xóa món ăn?',
      description: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?',
      confirmText: 'Xóa món',
      type: 'danger',
      onConfirm: () => {
        setDishes(prev => prev.filter(d => d.id !== dishId));
        showNotification({ message: 'Đã xóa món ăn', type: 'success' });
      }
    });
  };

  const handleCreateDish = () => {
    const newDish: Dish = {
      id: `dish-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      restaurantId: 'rest-1',
      menuCategoryId: categories[0]?.id || '',
      availableQuantity: 0,
      isAvailable: true,
      optionGroups: []
    };
    setDishMode('create');
    setSelectedDish(newDish);
  };

  const handleEditDish = (dish: Dish) => {
    setDishMode('edit');
    setSelectedDish(dish);
  };

  const handleCloseEdit = () => {
    setSelectedDish(null);
    setEditingDish(null);
    setDishMode('edit');
  };

  // Category Handlers
  const handleUpdateCategories = (newCategories: MenuCategory[]) => {
    setCategories(newCategories);
  };

  if (isLoading) {
    return <RestaurantMenuShimmer />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      {/* Top Header */}
      <div className="px-8 pt-8 pb-4 bg-white/50 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 shadow-sm shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl mb-2 font-anton font-bold text-[#1A1A1A]">MENU MANAGEMENT</h1>
            <p className="text-gray-500 text-sm font-medium">Quản lý món ăn, phân loại và tùy chọn</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 w-64 shadow-sm"
              />
            </div>

            <button
              onClick={() => setShowCategoryManager(true)}
              className="bg-white text-[#1A1A1A] px-4 py-2.5 rounded-xl font-bold text-sm shadow border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={handleCreateDish}
              className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[var(--primary)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>THÊM MÓN MỚI</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="relative">
          <div ref={tabContainerRef} className="relative overflow-hidden">
            <HoverHighlightOverlay rect={tabRect} style={tabStyle} />
            <div ref={tabsRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1 pl-1">
              {categories.map(cat => {
                const active = activeCategoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => scrollToCategory(cat.id)}
                    onMouseEnter={(e) => tabMove(e, { borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', scale: 1 })}
                    onMouseLeave={tabClear}
                    className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-colors relative z-10 ${active ? 'text-[var(--primary)] bg-white shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div ref={mainScrollRef} className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth bg-[#F7F7F7] scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        {categories.map(cat => {
          const catDishes = filteredDishes.filter(d => d.menuCategoryId === cat.id);
          if (searchQuery && catDishes.length === 0) return null;

          return (
            <section
              key={cat.id}
              ref={el => { sectionRefs.current[cat.id] = el; }}
              data-id={cat.id}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] tracking-tight">{cat.name.toUpperCase()}</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
                <span className="text-xs font-bold text-gray-400 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">{catDishes.length} items</span>
              </div>

              <div className="grid grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {catDishes.map(dish => {
                    const isSelected = selectedDish?.id === dish.id;
                    return (
                      <motion.div
                        layout
                        layoutId={`dish-card-${dish.id}`}
                        key={dish.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 16, stiffness: 100 }}
                        onClick={() => handleEditDish(dish)}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className={`group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer ${isSelected ? 'opacity-0 pointer-events-none' : ''}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <ImageWithFallback
                            src={dish.imageUrl}
                            alt={dish.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Edit & Trash Overlay with Larger Buttons */}
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <span className="bg-white/95 text-[#1A1A1A] px-5 py-3 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 transform translate-y-3 group-hover:translate-y-0 transition-transform hover:bg-[#1A1A1A] hover:text-white">
                              <Edit2 className="w-4 h-4" />
                              <span className="hidden sm:inline">Chỉnh sửa</span>
                            </span>
                            <button
                              onClick={(e) => handleDeleteDish(e, dish.id)}
                              className="bg-white/95 text-red-500 px-4 py-3 rounded-full shadow-lg flex items-center justify-center transform translate-y-3 group-hover:translate-y-0 transition-transform delay-75 hover:bg-red-500 hover:text-white"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm text-gray-700">
                            Qty: {dish.availableQuantity}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="mb-2">
                            <h3 className="font-bold text-[#1A1A1A] text-lg leading-tight line-clamp-1">{dish.name || 'Món mới'}</h3>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed font-medium">{dish.description || 'Chưa có mô tả'}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[var(--primary)] font-bold text-lg">{formatVnd(Number(dish.price))}</span>

                            {(dish.optionGroups?.length ?? 0) > 0 && (
                              <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md font-medium">
                                {dish.optionGroups?.length} options
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          );
        })}
        <div className="h-40"></div>
      </div>

      {/* DISH EDIT OVERLAY */}
      <AnimatePresence>
        {selectedDish && editingDish && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseEdit}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
            >
              {/* Modal Container: Centered, Max Height 92% */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-[1400px] h-full max-h-[92vh] grid grid-cols-[35%_65%] gap-6"
              >
                {/* Left: Info Card */}
                <motion.div
                  // Removed init/exit animations for shared element transition
                  className="h-full overflow-hidden"
                >
                  <DishInfoCard
                    dish={editingDish}
                    originalDish={selectedDish}
                    onUpdate={handleDishUpdate}
                    onDraftChange={handleDraftChange}
                    onClose={handleCloseEdit}
                    mode={dishMode}
                    categories={categories}
                    layoutId={dishMode === 'edit' ? `dish-card-${selectedDish.id}` : undefined}
                  />
                </motion.div>

                {/* Right: Options Editor */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.05 }}
                  className="h-full relative overflow-hidden"
                >
                  <DishEditModal
                    dish={editingDish}
                    onDraftChange={handleDraftChange}
                    onClose={handleCloseEdit}
                  />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* CATEGORY MANAGER OVERLAY */}
      <AnimatePresence>
        {showCategoryManager && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowCategoryManager(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CategoryManagerModal
                categories={categories}
                onUpdate={handleUpdateCategories}
                onClose={() => setShowCategoryManager(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
