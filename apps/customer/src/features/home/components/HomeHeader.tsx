'use client';

import { motion } from '@repo/ui/motion';
import { Menu, BookHeart, Search, ShoppingCart } from '@repo/ui/icons';
import { useCartStore } from '@repo/store';
// import { useState } from 'react';

interface HomeHeaderProps {
  onMenuClick?: () => void;
  onFavoritesClick?: () => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
}

export default function HomeHeader({
  onMenuClick,
  onFavoritesClick,
  onSearchClick,
  onCartClick,
}: HomeHeaderProps) {
  // const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');

  return (
    <header className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-start justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-4">
          {/* Logo and Menu */}
          <div className="flex items-center gap-4">
            <motion.button
              layoutId="menu-overlay"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                layout: {
                  type: "spring",
                  damping: 16,
                  stiffness: 100,
                },
              }}
              onClick={onMenuClick}
              className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Menu className="w-5 h-5 text-white" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold text-white tracking-tight">
                my.<span className="text-white/90">Eatzy</span>
              </h1>
            </motion.div>
          </div>

          {/* Layout Toggle */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 ml-14"
          ></motion.div>
        </div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          {/* My Cookbook/Favorites */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFavoritesClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-colors"
          >
            <BookHeart className="w-5 h-5 text-white" />
            <span className="text-white text-sm font-medium">
              Đơn hàng hiện tại
            </span>
          </motion.button>

          {/* Search */}
          <motion.button
            layoutId="search"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              duration: 0.25,
              layout: {
                type: "spring",
                damping: 16,
                stiffness: 100,
              },
            }}
            onClick={onSearchClick}
            className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5 text-white" />
          </motion.button>

          <motion.button
            layoutId="cart"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{
              layout: {
                type: "spring",
                damping: 16,
                stiffness: 100,
              },
            }}
            onClick={onCartClick}
            className="relative w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
            {/** Cart count badge */}
            <CartCountBadge />
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
}

function CartCountBadge() {
  const count = useCartStore((s) => s.items.length);
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--primary)] text-[10px] leading-[18px] text-black font-bold border border-white/60 flex items-center justify-center">
      {count}
    </span>
  );
}

