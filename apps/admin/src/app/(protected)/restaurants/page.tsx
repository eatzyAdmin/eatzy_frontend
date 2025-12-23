"use client";

import { useState } from "react";
import { RestaurantsFilters } from "./components/restaurants-filters";
import { RestaurantsTable } from "./components/restaurants-table";
import { MOCK_RESTAURANTS } from "@/data/mock-data";

interface Restaurant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: "active" | "inactive" | "suspended" | "pending";
  foodCategories: string[];
  rating: number;
  totalOrders: number;
  revenue: number;
  joinedDate: string;
}

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([...MOCK_RESTAURANTS]);

  const handleSuspendRestaurant = (id: string) => {
    setRestaurants(
      restaurants.map((r) =>
        r.id === id ? { ...r, status: "suspended" as const } : r
      )
    );
  };

  const handleActivateRestaurant = (id: string) => {
    setRestaurants(
      restaurants.map((r) =>
        r.id === id ? { ...r, status: "active" as const } : r
      )
    );
  };

  const handleApproveRestaurant = (id: string) => {
    setRestaurants(
      restaurants.map((r) =>
        r.id === id ? { ...r, status: "active" as const } : r
      )
    );
  };

  let filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStatus) {
    filteredRestaurants = filteredRestaurants.filter(
      (r) => r.status === selectedStatus
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Nhà hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin nhà hàng và phê duyệt đơn đăng ký</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <RestaurantsFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <RestaurantsTable
          restaurants={filteredRestaurants}
          onSuspend={handleSuspendRestaurant}
          onActivate={handleActivateRestaurant}
          onApprove={handleApproveRestaurant}
        />
      </div>
    </div>
  );
}
