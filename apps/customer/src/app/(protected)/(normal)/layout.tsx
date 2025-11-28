"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import HomeHeader from "@/features/home/components/HomeHeader";
import CartOverlay from "@/features/cart/components/CartOverlay";
import ProtectedMenuOverlay from "@/features/navigation/components/ProtectedMenuOverlay";
import dynamic from "next/dynamic";
const CurrentOrdersDrawer = dynamic(() => import("@/features/orders/components/CurrentOrdersDrawer"), { ssr: false });
import SearchOverlay from "@/features/search/components/SearchOverlay";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useSearch } from "@/features/search/hooks/useSearch";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isSearching, performSearch } = useSearch();
  const isSearchMode = searchParams.has("q");
  const isRestaurantDetail = pathname?.startsWith("/restaurants/") ?? false;
  const isSearchBarCompact = !isHeaderVisible && isSearchMode;

  useEffect(() => {
    const handleHeaderVisibility = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsHeaderVisible(customEvent.detail.visible);
    };
    window.addEventListener('searchHeaderVisibility', handleHeaderVisibility);
    return () => window.removeEventListener('searchHeaderVisibility', handleHeaderVisibility);
  }, []);

  useEffect(() => {
    if (!isSearchMode) {
      setIsHeaderVisible(true);
    }
  }, [isSearchMode]);

  const handleSearch = (query: string) => {
    performSearch(query);
  };

  useEffect(() => {
    if (isSearchMode) setSearchOpen(false);
  }, [isSearchMode]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <AnimatePresence>
        {((isSearchMode || isRestaurantDetail) && isHeaderVisible) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-x-0 top-0 h-20 z-[20] backdrop-blur-xl"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(!isSearchMode || isHeaderVisible) && (
          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={{ 
              y: isSearchMode && !isHeaderVisible ? -100 : 0,
              opacity: isSearchMode && !isHeaderVisible ? 0 : 1,
            }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          >
            <HomeHeader
              onMenuClick={() => setMenuOpen(true)}
              onFavoritesClick={() => setOrdersOpen(true)}
              onSearchClick={() => setSearchOpen(true)}
              onCartClick={() => setCartOpen(true)}
              hideSearchIcon={isSearchMode || isRestaurantDetail}
              onLogoClick={() => {
                const next = new URLSearchParams(searchParams.toString());
                next.delete('q');
                router.replace(`/home`, { scroll: false });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProtectedMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <CurrentOrdersDrawer open={ordersOpen} onClose={() => setOrdersOpen(false)} />
      <SearchOverlay 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onSearch={handleSearch}
        isSearchMode={isSearchMode}
        isSearchBarCompact={isSearchBarCompact}
        isSearching={isSearching}
      />
      {children}
    </div>
  );
}
