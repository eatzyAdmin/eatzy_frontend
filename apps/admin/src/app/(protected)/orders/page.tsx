"use client";

import { useState } from "react";
import { OrdersFilters } from "./components/orders-filters";
import { OrdersTable } from "./components/orders-table";
import { MOCK_ORDERS } from "@/data/mock-data";

interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  restaurantId: string;
  restaurantName: string;
  driverId?: string;
  driverName?: string;
  amount: number;
  status: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled";
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
  completedAt?: string;
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [orders] = useState<Order[]>([...MOCK_ORDERS]);

  let filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStatus) {
    filteredOrders = filteredOrders.filter((o) => o.status === selectedStatus);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
          <p className="text-gray-600 mt-1">Theo dõi và quản lý trạng thái các đơn hàng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <OrdersFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <OrdersTable orders={filteredOrders} />
      </div>
    </div>
  );
}
