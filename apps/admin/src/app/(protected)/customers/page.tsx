"use client";

import { useState } from "react";
import { CustomersFilters } from "./components/customers-filters";
import { CustomersTable } from "./components/customers-table";
import { MOCK_CUSTOMERS } from "@/data/mock-data";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "suspended";
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([...MOCK_CUSTOMERS]);

  const handleSuspendCustomer = (id: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, status: "suspended" as const } : c
      )
    );
  };

  const handleActivateCustomer = (id: string) => {
    setCustomers(
      customers.map((c) =>
        c.id === id ? { ...c, status: "active" as const } : c
      )
    );
  };

  let filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStatus) {
    filteredCustomers = filteredCustomers.filter(
      (c) => c.status === selectedStatus
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Khách hàng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và hoạt động của khách hàng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        <CustomersFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <CustomersTable
          customers={filteredCustomers}
          onSuspend={handleSuspendCustomer}
          onActivate={handleActivateCustomer}
        />
      </div>
    </div>
  );
}
