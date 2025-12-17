"use client";

import { motion } from "@repo/ui/motion";
import { useState } from "react";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export function RoleModal({ isOpen, onClose, onSubmit }: RoleModalProps) {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: "", description: "" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tạo vai trò mới</h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên vai trò
            </label>
            <input
              type="text"
              placeholder="VD: Manager"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả vai trò..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            Tạo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
