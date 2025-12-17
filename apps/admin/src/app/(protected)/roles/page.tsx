"use client";

import { useState } from "react";
import { RolesHeader } from "./components/roles-header";
import { RolesSearch } from "./components/roles-search";
import { RolesList } from "./components/roles-list";
import { RoleModal } from "./components/role-modal";
import { MOCK_ROLES } from "@/data/mock-data";

interface Role {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  isActive: boolean;
}

export default function RolesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);

  const handleCreateRole = (data: { name: string; description: string }) => {
    const newRole: Role = {
      id: `r${Date.now()}`,
      name: data.name,
      description: data.description,
      permissionCount: 0,
      userCount: 0,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setRoles([newRole, ...roles]);
    setIsModalOpen(false);
  };

  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter((r) => r.id !== id));
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <RolesHeader onCreateClick={() => setIsModalOpen(true)} />

      <div className="px-8 py-8">
        <RolesSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <RolesList roles={filteredRoles} onDelete={handleDeleteRole} />
      </div>

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRole}
      />
    </div>
  );
}
