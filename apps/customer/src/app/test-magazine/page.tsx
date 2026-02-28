'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import type { Restaurant, Dish, MenuCategory } from '@repo/types';
import MagazineLayout1 from '@/features/search/components/layouts/MagazineLayout1';
import MagazineLayout2 from '@/features/search/components/layouts/MagazineLayout2';
import MagazineLayout3 from '@/features/search/components/layouts/MagazineLayout3';
import MagazineLayout4 from '@/features/search/components/layouts/MagazineLayout4';
import MagazineLayout5 from '@/features/search/components/layouts/MagazineLayout5';
import MagazineLayout6 from '@/features/search/components/layouts/MagazineLayout6';
import MagazineLayout7 from '@/features/search/components/layouts/MagazineLayout7';
import MagazineLayout8 from '@/features/search/components/layouts/MagazineLayout8';
import MagazineLayout9 from '@/features/search/components/layouts/MagazineLayout9';
import MagazineLayout10 from '@/features/search/components/layouts/MagazineLayout10';
import MagazineLayout11 from '@/features/search/components/layouts/MagazineLayout11';
import MagazineLayout12 from '@/features/search/components/layouts/MagazineLayout12';
import MagazineLayout13 from '@/features/search/components/layouts/MagazineLayout13';
import MagazineLayout14 from '@/features/search/components/layouts/MagazineLayout14';
import { ChefHat, Star, MapPin, Search, LayoutGrid, Layers } from '@repo/ui/icons';

// ======== MOCK DATA ========
const MOCK_RESTAURANT: Restaurant = {
  id: 1001,
  name: "THE VELVET ATELIER",
  slug: "velvet-atelier",
  description: "A sanctuary of modern culinary arts where traditional flavors meet avant-garde techniques. Experience the ultimate symphony of taste and aesthetic.",
  address: "128 Art Avenue, Metropolitan District",
  rating: 4.9,
  averageRating: 4.9,
  status: 'OPEN',
  reviewCount: 1240,
  imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80",
  avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
  coverImageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1600&q=80",
};

const MOCK_CATEGORIES: MenuCategory[] = [
  { id: 'cat-1', name: 'Signature Starters', restaurantId: '1001', displayOrder: 1 },
  { id: 'cat-2', name: 'Masterpiece Mains', restaurantId: '1001', displayOrder: 2 },
];

const MOCK_DISHES: Dish[] = [
  {
    id: 'd1',
    name: "TRUFFLE DIM SUM",
    description: "Hand-crafted crystal skin dumplings filled with wild seasonal mushrooms and pure black truffle essence.",
    price: 245000,
    imageUrl: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-1',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd2',
    name: "MISO GLAZED COD",
    description: "Black cod marinated for 48 hours in luxury white miso, served with hajikami ginger and pickled plum.",
    price: 580000,
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd3',
    name: "SAFFRON RISOTTO",
    description: "Acquerello aged rice infused with Iranian saffron threads and topped with 24K edible gold flakes.",
    price: 420000,
    imageUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd4',
    name: "SMOKED SCALLOPS",
    description: "Hokkaido scallops smoked with applewood, served on a bed of cauliflower silk and caviar.",
    price: 385000,
    imageUrl: "https://images.unsplash.com/photo-1533777419517-3e4017e2e15a?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-1',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd5',
    name: "WAGYU TATAKI",
    description: "A5 Wagyu beef lightly seared and served with truffle ponzu and crispy garlic chips.",
    price: 750000,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd6',
    name: "MATCHA ZEN DOME",
    description: "Kyoto matcha mousse with a heart of raspberry coulis, encased in a dark chocolate shell.",
    price: 185000,
    imageUrl: "https://images.unsplash.com/photo-1517093157656-b99917c73e17?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd7',
    name: "LOBSTER TORTELLINI",
    description: "Artisanal pasta stuffed with butter-poached lobster and topped with citrus foam.",
    price: 495000,
    imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  },
  {
    id: 'd8',
    name: "IBERICO SECRETO",
    description: "Grilled Iberico pork secreton served with a slow-cooked egg and romesco sauce.",
    price: 365000,
    imageUrl: "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&q=80",
    restaurantId: '1001',
    menuCategoryId: 'cat-2',
    availableQuantity: 100,
    isAvailable: true
  }
];

export default function TestMagazinePage() {
  const [selectedLayout, setSelectedLayout] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [dishCount, setDishCount] = useState<number>(MOCK_DISHES.length);

  const layouts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const currentDishes = MOCK_DISHES.slice(0, dishCount);

  const renderLayout = (id: number) => {
    const props = {
      restaurant: MOCK_RESTAURANT,
      dishes: currentDishes,
      menuCategories: MOCK_CATEGORIES,
      distance: 2.5
    };

    switch (id) {
      case 1: return <MagazineLayout1 {...props} />;
      case 2: return <MagazineLayout2 {...props} />;
      case 3: return <MagazineLayout3 {...props} />;
      case 4: return <MagazineLayout4 {...props} />;
      case 5: return <MagazineLayout5 {...props} />;
      case 6: return <MagazineLayout6 {...props} />;
      case 7: return <MagazineLayout7 {...props} />;
      case 8: return <MagazineLayout8 {...props} />;
      case 9: return <MagazineLayout9 {...props} />;
      case 10: return <MagazineLayout10 {...props} />;
      case 11: return <MagazineLayout11 {...props} />;
      case 12: return <MagazineLayout12 {...props} />;
      case 13: return <MagazineLayout13 {...props} />;
      case 14: return <MagazineLayout14 {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-40">
      {/* Control Panel */}
      <div className="relative z-[100] w-full max-w-4xl mx-auto mb-16">
        <div className="bg-black/90 backdrop-blur-2xl rounded-[32px] p-4 md:p-6 shadow-2xl border border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <ChefHat className="text-black w-6 h-6" />
              </div>
              <div>
                <h1 className="text-white font-anton text-2xl uppercase tracking-tighter">Magazine Lab</h1>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Layout System v2.4</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-col gap-1 items-center md:items-start border-r border-white/10 pr-6 mr-2">
                <span className="text-[8px] uppercase font-bold tracking-[0.3em] text-gray-500">Data Density</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDishCount(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5 active:scale-90"
                  >
                    -
                  </button>
                  <span className="font-anton text-xl text-amber-500 w-6 text-center">{dishCount}</span>
                  <button
                    onClick={() => setDishCount(prev => Math.min(MOCK_DISHES.length, prev + 1))}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all border border-white/5 active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
                {layouts.map(num => (
                  <button
                    key={num}
                    onClick={() => { setSelectedLayout(num); setViewMode('single'); }}
                    className={`
                      w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl font-anton text-lg transition-all
                      ${selectedLayout === num && viewMode === 'single'
                        ? 'bg-white text-black scale-110 shadow-xl'
                        : 'text-gray-500 hover:text-white hover:bg-white/10'}
                    `}
                  >
                    {num}
                  </button>
                ))}
                <div className="w-px h-8 bg-white/10 mx-2" />
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                      w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-xl flex items-center justify-center transition-all
                      ${viewMode === 'grid'
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-500 hover:text-white hover:bg-white/10'}
                    `}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {viewMode === 'single' ? (
            <motion.div
              key={selectedLayout}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            >
              <div className="mb-8 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-anton font-bold text-amber-600 uppercase tracking-[0.4em]">Testing Mode</span>
                  <h2 className="text-2xl font-anton text-black uppercase">Layout {selectedLayout}</h2>
                </div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Reference: Magazine_Variant_{selectedLayout}.tsx
                </div>
              </div>
              {renderLayout(selectedLayout)}
            </motion.div>
          ) : (
            <div className="space-y-40 mt-20">
              {layouts.map(num => (
                <div key={num} className="relative">
                  <div className="mb-10">
                    <div className="inline-block bg-black text-white px-8 py-3 rounded-full font-anton text-2xl shadow-xl">
                      LAYOUT {num}
                    </div>
                  </div>
                  {renderLayout(num)}
                </div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[#fafafa]">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-gray-100 to-transparent opacity-50" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-black/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
