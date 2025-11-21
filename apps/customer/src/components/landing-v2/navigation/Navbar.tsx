"use client";

import { useState } from "react";
import { Menu, X, User } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import NavItem from "./NavItem";
import MobileMenu from "./MobileMenu";

interface NavbarProps {
  animationComplete: boolean;
  activeSection: string;
  onHome: () => void;
  onFeatures: () => void;
  onCategories: () => void;
  onBenefits: () => void;
  onLogin: () => void;
}

export default function Navbar({
  animationComplete,
  activeSection,
  onHome,
  onFeatures,
  onCategories,
  onBenefits,
  onLogin,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav
        className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-[90%] md:w-[70%] lg:w-[55%] z-20 flex justify-between items-center px-3 py-2 bg-white/20 backdrop-blur-lg rounded-full shadow-xl border border-white/20 transition-all duration-1000 delay-500 ${
          animationComplete ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center p-2 border border-[var(--primary)] rounded-full gap-2">
          <div className="relative w-7 h-7 transform rotate-45 rounded-md flex items-center justify-center hover:rotate-90 transition-all duration-300">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]"></div>
            <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-emerald-200 to-lime-200 shadow-lg"></div>
            <div className="absolute inset-[6px] rounded-md bg-white"></div>
            <svg
              className="absolute inset-0 m-auto w-5 h-5 transform -rotate-45 hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="text-xl font-light text-[var(--primary)]">Eatzy</div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden absolute left-1/2 transform -translate-x-1/2 md:flex items-center space-x-6">
          <NavItem text="Trang Chủ" active={activeSection === "home"} onClick={onHome} />
          <NavItem text="Tính Năng" active={activeSection === "features"} onClick={onFeatures} />
          <NavItem text="Danh Mục" active={activeSection === "categories"} onClick={onCategories} />
          <NavItem text="Ưu Điểm" active={activeSection === "benefits"} onClick={onBenefits} />
        </div>

        {/* Login Button */}
        <div className="hidden md:flex items-center">
          <Button
            variant="primary"
            size="md"
            className="rounded-full gap-2"
            onClick={onLogin}
          >
            <User size={16} />
            <span>Đăng Nhập</span>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-white/60 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        onHome={onHome}
        onFeatures={onFeatures}
        onCategories={onCategories}
        onBenefits={onBenefits}
        onLogin={onLogin}
      />
    </>
  );
}

