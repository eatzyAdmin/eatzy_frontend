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
import BottomNav from "@/features/navigation/components/BottomNav";
import { BottomNavProvider } from "@/features/navigation/context/BottomNavContext";

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
  const isOrderHistory = pathname?.startsWith("/order-history") ?? false;
  const isFavorites = pathname?.startsWith("/favorites") ?? false;
  const isProfile = pathname?.startsWith("/profile") ?? false;
  const [isRecommendedMode, setIsRecommendedMode] = useState(false);

  // Combine modes for layout and animation purposes
  const effectiveSearchMode = isSearchMode || isRecommendedMode;
  const shouldSlideHeader = effectiveSearchMode || isOrderHistory || isFavorites;
  const isSearchBarCompact = !isHeaderVisible && effectiveSearchMode;

  useEffect(() => {
    const handleHeaderVisibility = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsHeaderVisible(customEvent.detail.visible);
    };

    const handleRecommendedMode = (e: Event) => {
      const customEvent = e as CustomEvent<{ active: boolean }>;
      setIsRecommendedMode(customEvent.detail.active);
    };

    window.addEventListener('searchHeaderVisibility', handleHeaderVisibility);
    window.addEventListener('recommendedModeChange', handleRecommendedMode);
    return () => {
      window.removeEventListener('searchHeaderVisibility', handleHeaderVisibility);
      window.removeEventListener('recommendedModeChange', handleRecommendedMode);
    };
  }, []);

  useEffect(() => {
    if (!shouldSlideHeader && !isProfile) {
      setIsHeaderVisible(true);
    }
  }, [shouldSlideHeader, isProfile]);

  const handleSearch = (query: string, filters?: { minPrice?: number; maxPrice?: number; sort?: string; category?: string | null }) => {
    performSearch(query, filters);
  };

  useEffect(() => {
    if (isSearchMode) setSearchOpen(false);
  }, [isSearchMode]);

  return (
    <BottomNavProvider>
      <div className={`relative w-full overflow-x-hidden ${(isOrderHistory || isFavorites) ? "h-screen overflow-y-hidden" : "min-h-screen"}`}>
        <AnimatePresence>
          {((shouldSlideHeader || isProfile) && isHeaderVisible) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-none fixed inset-x-0 top-0 h-20 z-[20] ${(isOrderHistory || isFavorites) ? "bg-[#F7F7F7]/95 backdrop-blur-md" : "backdrop-blur-xl"
                } ${(isRestaurantDetail || isOrderHistory || isFavorites) ? "hidden md:block" : ""}`}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {(!shouldSlideHeader || isHeaderVisible) && (
            <motion.div
              key="global-header"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
              className={(isRestaurantDetail || isOrderHistory || isFavorites) ? "hidden md:block" : ""}
            >
              <HomeHeader
                onMenuClick={() => setMenuOpen(true)}
                onFavoritesClick={() => setOrdersOpen(true)}
                onSearchClick={() => setSearchOpen(true)}
                onCartClick={() => setCartOpen(true)}
                hideSearchIcon={shouldSlideHeader || isRestaurantDetail || isFavorites || isProfile}
                hideCart={isRestaurantDetail}
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
          isSearchMode={effectiveSearchMode}
          isSearchBarCompact={isSearchBarCompact}
          isSearching={isSearching}
        />
        {!isRestaurantDetail && <BottomNav onCurrentOrdersClick={() => setOrdersOpen(true)} isOrdersOpen={ordersOpen} />}
        {children}
      </div>
    </BottomNavProvider>
  );
}
