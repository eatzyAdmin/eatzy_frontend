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
import { useMobileExitGuard } from "@/hooks/useMobileExitGuard";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Layout({ children }: { children: React.ReactNode }) {
  useMobileExitGuard();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isSearching, performSearch, isSearchMode, searchQuery, filters } = useSearch();
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

    // Custom event to open orders drawer from anywhere (e.g. from toast)
    const handleOpenOrders = () => setOrdersOpen(true);
    window.addEventListener('openOrdersDrawer', handleOpenOrders);

    // Custom event to open cart overlay from anywhere (SearchOverlay bottom buttons)
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener('openCart', handleOpenCart);

    return () => {
      window.removeEventListener('searchHeaderVisibility', handleHeaderVisibility);
      window.removeEventListener('recommendedModeChange', handleRecommendedMode);
      window.removeEventListener('openOrdersDrawer', handleOpenOrders);
      window.removeEventListener('openCart', handleOpenCart);
    };
  }, []);

  useEffect(() => {
    if (!shouldSlideHeader && !isProfile) {
      setIsHeaderVisible(true);
    }
  }, [shouldSlideHeader, isProfile]);

  useEffect(() => {
    // Reset recommended mode if we move away from home
    if (pathname !== "/home" && isRecommendedMode) {
      setIsRecommendedMode(false);
    }
  }, [pathname, isRecommendedMode]);

  const handleSearch = (query: string, filters?: { minPrice?: number; maxPrice?: number; sort?: string; category?: string | null }) => {
    performSearch(query, filters);
  };

  useEffect(() => {
    if (isSearchMode) setSearchOpen(false);
  }, [isSearchMode]);

  // Handle body scroll locking when any overlay is open
  useEffect(() => {
    const isAnyOverlayOpen = cartOpen || menuOpen || searchOpen || ordersOpen;
    if (isAnyOverlayOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.touchAction = 'none';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.touchAction = '';
      document.body.classList.remove('modal-open');
    };
  }, [cartOpen, menuOpen, searchOpen, ordersOpen]);

  const isMobile = useIsMobile();

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
              className={`pointer-events-none fixed inset-x-0 top-0 h-16 md:h-20 z-[20] max-md:[mask-image:linear-gradient(to_bottom,black_70%,transparent)] ${(isOrderHistory || isFavorites) ? "bg-[#F7F7F7]/95 backdrop-blur-md" : "backdrop-blur-xl"
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
                showHomeIcon={isMobile}
                onLogoClick={() => {
                  if (pathname === '/home' && !isSearchMode && !isRecommendedMode) return;

                  const next = new URLSearchParams(searchParams.toString());
                  next.delete('q');
                  router.replace(`/home`, { scroll: false });

                  // Reset modes
                  if (isRecommendedMode) {
                    window.dispatchEvent(new CustomEvent('recommendedModeChange', {
                      detail: { active: false }
                    }));
                  }
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
          searchQuery={searchQuery}
          activeFilters={filters}
        />
        {children}
        {!isRestaurantDetail && !effectiveSearchMode && <BottomNav onCurrentOrdersClick={() => setOrdersOpen(true)} isOrdersOpen={ordersOpen} />}
      </div>
    </BottomNavProvider>
  );
}
