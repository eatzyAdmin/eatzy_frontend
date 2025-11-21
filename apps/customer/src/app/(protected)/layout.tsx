"use client";
import { useState } from "react";
import HomeHeader from "@/features/home/components/HomeHeader";
import CartOverlay from "@/features/cart/components/CartOverlay";
import ProtectedMenuOverlay from "@/features/navigation/components/ProtectedMenuOverlay";
import SearchOverlay from "@/features/search/components/SearchOverlay";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <HomeHeader
        onMenuClick={() => setMenuOpen(true)}
        onFavoritesClick={() => {}}
        onSearchClick={() => setSearchOpen(true)}
        onCartClick={() => setCartOpen(true)}
      />
      <CartOverlay open={cartOpen} onClose={() => setCartOpen(false)} />
      <ProtectedMenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      {children}
    </div>
  );
}