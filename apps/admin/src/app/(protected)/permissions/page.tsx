"use client";

import { useState } from "react";
import { PermissionsHeader } from "./components/permissions-header";
import { PermissionsFilters } from "./components/permissions-filters";
import { PermissionsList } from "./components/permissions-list";
import { PermissionModal } from "./components/permission-modal";
import { MOCK_PERMISSIONS } from "@/data/mock-data";

interface Permission {
  id: string;
  name: string;
  apiEndpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  category: string;
  description: string;
}

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([...MOCK_PERMISSIONS]);

  const handleCreatePermission = (data: {
    name: string;
    apiEndpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    category: string;
    description: string;
  }) => {
    const newPermission: Permission = {
      id: `p${Date.now()}`,
      ...data,
    };
    setPermissions([newPermission, ...permissions]);
    setIsModalOpen(false);
  };

  const handleDeletePermission = (id: string) => {
    setPermissions(permissions.filter((p) => p.id !== id));
  };

  let filteredPermissions = permissions.filter(
    (perm) =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.apiEndpoint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCategory) {
    filteredPermissions = filteredPermissions.filter(
      (p) => p.category === selectedCategory
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PermissionsHeader onCreateClick={() => setIsModalOpen(true)} />

      <div className="px-8 py-8">
        <PermissionsFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />
        <PermissionsList
          permissions={filteredPermissions}
          onDelete={handleDeletePermission}
        />
      </div>

      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePermission}
      />
    </div>
  );
}
