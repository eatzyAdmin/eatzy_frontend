"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Search, Copy } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { MOCK_PROMOTIONS } from "@/data/mock-data";

interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount: number;
  minOrderValue: number;
  usageCount: number;
  maxUsage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS as Promotion[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  const [newPromo, setNewPromo] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "percentage" as const,
    discountValue: 10,
    maxDiscount: 50000,
    minOrderValue: 0,
    maxUsage: 100,
  });

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive =
      filterActive === "all" || (filterActive === "active" ? promo.isActive : !promo.isActive);
    return matchesSearch && matchesActive;
  });

  const handleAddPromo = () => {
    if (newPromo.code.trim() && newPromo.name.trim()) {
      setPromotions([
        ...promotions,
        {
          id: `promo${Date.now()}`,
          ...newPromo,
          usageCount: 0,
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewPromo({
        code: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: 10,
        maxDiscount: 50000,
        minOrderValue: 0,
        maxUsage: 100,
      });
    }
  };

  const handleDelete = (id: string) => {
    setPromotions(promotions.filter((promo) => promo.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setPromotions(
      promotions.map((promo) =>
        promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
      )
    );
  };

  const stats = [
    { label: "Tổng khuyến mãi", value: promotions.length },
    { label: "Đang hoạt động", value: promotions.filter((p) => p.isActive).length },
    { label: "Tổng lượt sử dụng", value: promotions.reduce((sum, p) => sum + p.usageCount, 0) },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khuyến mãi</h1>
          <p className="text-gray-600 mt-1">Quản lý các chương trình khuyến mãi và mã giảm giá</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Add New Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm khuyến mãi mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Mã khuyến mãi (VD: EATZY2024)"
              value={newPromo.code}
              onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="text"
              placeholder="Tên khuyến mãi"
              value={newPromo.name}
              onChange={(e) => setNewPromo({ ...newPromo, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newPromo.description}
              onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={newPromo.discountType}
              onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value as any })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="percentage">Phần trăm (%)</option>
              <option value="fixed">Số tiền cố định (đ)</option>
            </select>
            <input
              type="number"
              placeholder="Giá trị giảm"
              value={newPromo.discountValue}
              onChange={(e) => setNewPromo({ ...newPromo, discountValue: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="number"
              placeholder="Max giảm (đ)"
              value={newPromo.maxDiscount}
              onChange={(e) => setNewPromo({ ...newPromo, maxDiscount: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="number"
              placeholder="Min order (đ)"
              value={newPromo.minOrderValue}
              onChange={(e) => setNewPromo({ ...newPromo, minOrderValue: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              onClick={handleAddPromo}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Thêm
            </button>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm khuyến mãi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Đã tắt</option>
          </select>
        </div>

        {/* Promotions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Mã</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tên</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Giảm</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Min Order</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Lượt sử dụng</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPromotions.map((promo) => (
                  <motion.tr
                    key={promo.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-bold text-[var(--primary)] bg-blue-50 px-2 py-1 rounded">
                          {promo.code}
                        </code>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{promo.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {promo.discountType === "percentage"
                          ? `${promo.discountValue}%`
                          : `₫${promo.discountValue.toLocaleString()}`}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">₫{promo.minOrderValue.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {promo.usageCount} / {promo.maxUsage}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          promo.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {promo.isActive ? "Hoạt động" : "Tắt"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(promo.id)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(promo.id)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
