"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Users } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { MOCK_RESTAURANT_AREAS } from "@/data/mock-data";

interface Area {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  capacity: number;
  tablesCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function RestaurantAreasPage() {
  const [areas, setAreas] = useState<Area[]>(MOCK_RESTAURANT_AREAS);
  const [newArea, setNewArea] = useState({
    restaurantId: "r1",
    name: "",
    description: "",
    capacity: 0,
    tablesCount: 0,
  });

  const restaurantIds = ["r1", "r2", "r3", "r4", "r5"];

  const handleAddArea = () => {
    if (newArea.name.trim() && newArea.capacity > 0) {
      setAreas([
        ...areas,
        {
          id: `area${Date.now()}`,
          ...newArea,
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewArea({
        restaurantId: "r1",
        name: "",
        description: "",
        capacity: 0,
        tablesCount: 0,
      });
    }
  };

  const handleDelete = (id: string) => {
    setAreas(areas.filter((a) => a.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setAreas(areas.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
  };

  // Group by restaurant
  const areasByRestaurant = restaurantIds.reduce((acc, rid) => {
    acc[rid] = areas.filter((a) => a.restaurantId === rid);
    return acc;
  }, {} as Record<string, Area[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Khu vực Nhà hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý các khu vực, bàn trong nhà hàng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Add New Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm khu vực mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={newArea.restaurantId}
              onChange={(e) => setNewArea({ ...newArea, restaurantId: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {restaurantIds.map((rid) => (
                <option key={rid} value={rid}>
                  Nhà hàng {rid}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tên khu vực"
              value={newArea.name}
              onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="text"
              placeholder="Mô tả"
              value={newArea.description}
              onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <button
              onClick={handleAddArea}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Thêm
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Sức chứa: {newArea.capacity} người
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={newArea.capacity}
                onChange={(e) => setNewArea({ ...newArea, capacity: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Số bàn: {newArea.tablesCount}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={newArea.tablesCount}
                onChange={(e) => setNewArea({ ...newArea, tablesCount: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </motion.div>

        {/* Areas by Restaurant */}
        {restaurantIds.map((restaurantId) => (
          <motion.div
            key={restaurantId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nhà hàng {restaurantId}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areasByRestaurant[restaurantId].map((area) => (
                <div
                  key={area.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-gray-900">{area.name}</h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        area.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {area.isActive ? "Hoạt động" : "Tắt"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{area.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">👥 Sức chứa</span>
                      <span className="font-bold text-gray-900">{area.capacity} người</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">🪑 Số bàn</span>
                      <span className="font-bold text-gray-900">{area.tablesCount} bàn</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(area.id)}
                      className="flex-1 text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-200 rounded-lg text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="flex-1 text-red-600 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
              {areasByRestaurant[restaurantId].length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Chưa có khu vực nào</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
