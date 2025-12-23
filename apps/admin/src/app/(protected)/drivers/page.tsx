"use client";

import { useState } from "react";
import { DriversFilters } from "./components/drivers-filters";
import { DriversTable } from "./components/drivers-table";
import { MOCK_DRIVERS } from "@/data/mock-data";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended" | "offline" | "online" | "delivering";
  vehicleType: "bike" | "car" | "truck";
  totalDeliveries: number;
  rating: number;
  joinedDate: string;
}

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([...MOCK_DRIVERS]);

  const handleSuspendDriver = (id: string) => {
    setDrivers(
      drivers.map((d) =>
        d.id === id ? { ...d, status: "suspended" as const } : d
      )
    );
  };

  const handleActivateDriver = (id: string) => {
    setDrivers(
      drivers.map((d) =>
        d.id === id ? { ...d, status: "active" as const } : d
      )
    );
  };

  let filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStatus) {
    filteredDrivers = filteredDrivers.filter(
      (d) => d.status === selectedStatus
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Tài xế</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và trạng thái tài xế giao hàng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <DriversFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <DriversTable
          drivers={filteredDrivers}
          onSuspend={handleSuspendDriver}
          onActivate={handleActivateDriver}
        />
      </div>
    </div>
  );
}
