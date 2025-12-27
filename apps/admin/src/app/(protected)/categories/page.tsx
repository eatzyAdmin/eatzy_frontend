"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Search } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { MOCK_CATEGORIES } from "@/data/mock-data";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon: "🍜" });

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: `cat${Date.now()}`,
          ...newCategory,
          itemCount: 0,
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewCategory({ name: "", description: "", icon: "🍜" });
    }
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh mục</h1>
            <p className="text-gray-600 mt-1">Quản lý danh mục món ăn</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-[var(--primary)]">{categories.length}</p>
            <p className="text-sm text-gray-600">Tổng danh mục</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        {/* Add New Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm danh mục mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Tên danh mục"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="text"
              placeholder="Icon (emoji)"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              maxLength={2}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-center text-2xl"
            />
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Thêm
            </button>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      category.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {category.isActive ? "Hoạt động" : "Vô hiệu"}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{category.itemCount} món ăn</span>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-700 p-2">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
