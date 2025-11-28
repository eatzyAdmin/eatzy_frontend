'use client';

import { motion } from '@repo/ui/motion';
import { Menu, BookHeart, Search, ShoppingCart } from '@repo/ui/icons';
import { useCartStore } from '@repo/store';
import { useState, useEffect } from 'react';

interface HomeHeaderProps {
  onMenuClick?: () => void;
  onFavoritesClick?: () => void;
  onSearchClick?: () => void;
  onCartClick?: () => void;
  hideSearchIcon?: boolean;
  onLogoClick?: () => void;
}

export default function HomeHeader({
  onMenuClick,
  onFavoritesClick,
  onSearchClick,
  onCartClick,
  hideSearchIcon = false,
  onLogoClick,
}: HomeHeaderProps) {
  // const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
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
              className={`w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center transition-colors ${
                hideSearchIcon 
                  ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' 
                  : 'bg-white/10 border-white/20 hover:bg-white/20'
              }`}
            >
              <Menu className={`w-5 h-5 ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`} />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button onClick={onLogoClick} className="select-none">
                <h1 className={`text-3xl font-bold tracking-tight ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`}>
                  my.<span className={hideSearchIcon ? 'text-gray-700' : 'text-white/90'}>Eatzy</span>
                </h1>
              </button>
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
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border transition-colors ${
              hideSearchIcon
                ? 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            <BookHeart className={`w-5 h-5 ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`} />
            <span className={`text-sm font-medium ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`}>
              Current Orders
            </span>
          </motion.button>

          {/* Search - hide when in search mode */}
          {!hideSearchIcon && (
            <motion.button
              layoutId="search-bar"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
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
          )}

          <motion.button
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
            id="header-cart-button"
            className={`relative rounded-xl backdrop-blur-md border flex items-center justify-center transition-colors ${
              hideSearchIcon
                ? 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            } ${useCartStore((s) => s.items.length) > 0 ? 'px-3 w-auto h-10 gap-2' : 'w-10 h-10'}`}
          >
            <CartButtonContent hideSearchIcon={hideSearchIcon} />
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
}

function CartButtonContent({ hideSearchIcon }: { hideSearchIcon: boolean }) {
  const count = useCartStore((s) => s.items.length);
  const total = useCartStore((s) => s.total());
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 300);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      <motion.div animate={pulse ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.3 }} className="relative flex items-center">
        <ShoppingCart className={`w-5 h-5 ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`} />
        {count > 0 && (
          <motion.span key={count} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300 }} className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--primary)] text-[10px] leading-[18px] text-black font-bold border border-white/60 flex items-center justify-center">
            {count}
          </motion.span>
        )}
      </motion.div>
      {count > 0 && (
        <div className={`hidden md:flex items-center text-sm font-semibold ${hideSearchIcon ? 'text-gray-900' : 'text-white'}`}>
          {new Intl.NumberFormat('vi-VN').format(total)} đ
        </div>
      )}
    </>
  );
}


