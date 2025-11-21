"use client";

import { X } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import MobileNavItem from "./MobileNavItem";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onHome: () => void;
  onFeatures: () => void;
  onCategories: () => void;
  onBenefits: () => void;
  onLogin: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  activeSection,
  onHome,
  onFeatures,
  onCategories,
  onBenefits,
  onLogin,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-md transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white">
          <X size={24} />
        </button>
      </div>
      <div className="flex flex-col items-center space-y-6 p-8 text-white">
        <MobileNavItem
          text="Trang Chủ"
          active={activeSection === "home"}
          onClick={() => {
            onClose();
            onHome();
          }}
        />
        <MobileNavItem
          text="Tính Năng"
          active={activeSection === "features"}
          onClick={() => {
            onClose();
            onFeatures();
          }}
        />
        <MobileNavItem
          text="Danh Mục"
          active={activeSection === "categories"}
          onClick={() => {
            onClose();
            onCategories();
          }}
        />
        <MobileNavItem
          text="Ưu Điểm"
          active={activeSection === "benefits"}
          onClick={() => {
            onClose();
            onBenefits();
          }}
        />
        <Button
          variant="primary"
          size="lg"
          className="mt-6 w-full rounded-full"
          onClick={() => {
            onClose();
            onLogin();
          }}
        >
          Đăng Nhập
        </Button>
      </div>
    </div>
  );
}

