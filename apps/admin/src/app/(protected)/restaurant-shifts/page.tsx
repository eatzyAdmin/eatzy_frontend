"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Clock, AlertCircle } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { MOCK_RESTAURANT_SHIFTS } from "@/data/mock-data";

interface Shift {
  id: string;
  restaurantId: string;
  name: string;
  startTime: string;
  endTime: string;
  maxOrders: number;
  isActive: boolean;
  daysOfWeek: string[];
  createdAt: string;
}

export default function RestaurantShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>(MOCK_RESTAURANT_SHIFTS);
  const [newShift, setNewShift] = useState({
    restaurantId: "r1",
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    maxOrders: 50,
    daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  });

  const daysOfWeekOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const restaurantIds = ["r1", "r2", "r3", "r4", "r5"];

  const handleAddShift = () => {
    if (newShift.name.trim()) {
      setShifts([
        ...shifts,
        {
          id: `shift${Date.now()}`,
          ...newShift,
          isActive: true,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewShift({
        restaurantId: "r1",
        name: "",
        startTime: "09:00",
        endTime: "17:00",
        maxOrders: 50,
        daysOfWeek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      });
    }
  };

  const handleDelete = (id: string) => {
    setShifts(shifts.filter((s) => s.id !== id));
  };

  const handleToggleDay = (day: string) => {
    setNewShift({
      ...newShift,
      daysOfWeek: newShift.daysOfWeek.includes(day)
        ? newShift.daysOfWeek.filter((d) => d !== day)
        : [...newShift.daysOfWeek, day],
    });
  };

  const handleToggleActive = (id: string) => {
    setShifts(shifts.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  // Group by restaurant
  const shiftsByRestaurant = restaurantIds.reduce((acc, rid) => {
    acc[rid] = shifts.filter((s) => s.restaurantId === rid);
    return acc;
  }, {} as Record<string, Shift[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ca làm việc Nhà hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý ca làm việc cho các nhà hàng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Add New Shift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm ca làm việc mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <select
              value={newShift.restaurantId}
              onChange={(e) => setNewShift({ ...newShift, restaurantId: e.target.value })}
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
              placeholder="Tên ca (VD: Ca sáng)"
              value={newShift.name}
              onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="time"
              value={newShift.startTime}
              onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <input
              type="time"
              value={newShift.endTime}
              onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Max đơn hàng/ca: {newShift.maxOrders}
            </label>
            <input
              type="range"
              min="10"
              max="200"
              value={newShift.maxOrders}
              onChange={(e) => setNewShift({ ...newShift, maxOrders: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Ngày trong tuần</label>
            <div className="flex gap-2 flex-wrap">
              {daysOfWeekOptions.map((day) => (
                <button
                  key={day}
                  onClick={() => handleToggleDay(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    newShift.daysOfWeek.includes(day)
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleAddShift}
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm ca
          </button>
        </motion.div>

        {/* Shifts by Restaurant */}
        {restaurantIds.map((restaurantId) => (
          <motion.div
            key={restaurantId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nhà hàng {restaurantId}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shiftsByRestaurant[restaurantId].map((shift) => (
                <div key={shift.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      <h4 className="font-bold text-gray-900">{shift.name}</h4>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        shift.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {shift.isActive ? "Hoạt động" : "Tắt"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      ⏰ {shift.startTime} - {shift.endTime}
                    </p>
                    <p className="text-sm text-gray-600">📊 Max: {shift.maxOrders} đơn</p>
                    <p className="text-sm text-gray-600">
                      📅 {shift.daysOfWeek.join(", ")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(shift.id)}
                      className="flex-1 text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-200 rounded-lg text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDelete(shift.id)}
                      className="flex-1 text-red-600 hover:text-red-700 px-3 py-2 border border-red-200 rounded-lg text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
