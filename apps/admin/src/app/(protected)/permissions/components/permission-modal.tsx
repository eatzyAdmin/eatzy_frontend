"use client";

import { motion } from "@repo/ui/motion";
import { useState } from "react";

const CATEGORIES = [
  "Dashboard",
  "Người dùng",
  "Vai trò",
  "Quyền",
  "Khách hàng",
  "Tài xế",
  "Nhà hàng",
  "Đơn hàng",
  "Analytics",
];

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    apiEndpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    category: string;
    description: string;
  }) => void;
}

export function PermissionModal({
  isOpen,
  onClose,
  onSubmit,
}: PermissionModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    apiEndpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    category: string;
    description: string;
  }>({
    name: "",
    apiEndpoint: "",
    method: "GET",
    category: "",
    description: "",
  });

  const handleSubmit = () => {
    if (formData.name.trim() && formData.apiEndpoint.trim()) {
      onSubmit(formData);
      setFormData({
        name: "",
        apiEndpoint: "",
        method: "GET",
        category: "",
        description: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Thêm quyền hạn mới
        </h2>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên quyền hạn
            </label>
            <input
              type="text"
              placeholder="VD: Xem danh sách người dùng"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              placeholder="VD: GET /admin/users"
              value={formData.apiEndpoint}
              onChange={(e) =>
                setFormData({ ...formData, apiEndpoint: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phương thức
            </label>
            <select
              value={formData.method}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  method: e.target.value as "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Chọn danh mục</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả quyền hạn..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              rows={2}
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
            Thêm
          </button>
        </div>
      </motion.div>
    </div>
  );
}
