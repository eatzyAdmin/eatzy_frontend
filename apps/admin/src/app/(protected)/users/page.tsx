"use client";

import { useState } from "react";
import { UsersHeader } from "./components/users-header";
import { UsersFilters } from "./components/users-filters";
import { UsersTable } from "./components/users-table";
import { UserModal } from "./components/user-modal";
import { MOCK_USERS } from "@/data/mock-data";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([...MOCK_USERS]);

  const handleCreateUser = (data: {
    name: string;
    email: string;
    phone: string;
    role: string;
  }) => {
    const newUser: AdminUser = {
      id: `u${Date.now()}`,
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setUsers([newUser, ...users]);
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  let filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedStatus) {
    filteredUsers = filteredUsers.filter((u) => u.status === selectedStatus);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UsersHeader onCreateClick={() => setIsModalOpen(true)} />

      <div className="px-8 py-8">
        <UsersFilters
          searchTerm={searchTerm}
          selectedStatus={selectedStatus}
          onSearchChange={setSearchTerm}
          onStatusChange={setSelectedStatus}
        />
        <UsersTable users={filteredUsers} onDelete={handleDeleteUser} />
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateUser}
      />
    </div>
  );
}
