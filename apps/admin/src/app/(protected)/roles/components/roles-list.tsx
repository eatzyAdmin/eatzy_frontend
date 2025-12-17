"use client";

import { motion } from "@repo/ui/motion";
import { Shield, Lock, Edit2, Trash2 } from "@repo/ui/icons";
import Link from "next/link";

interface Role {
  id: string;
  name: string;
  description: string;
  permissionCount: number;
  userCount: number;
  createdAt: string;
  isActive: boolean;
}

interface RolesListProps {
  roles: Role[];
  onDelete: (id: string) => void;
}

export function RolesList({ roles, onDelete }: RolesListProps) {
  if (roles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl border border-gray-100"
      >
        <Shield className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Chưa có vai trò nào</p>
        <p className="text-gray-400 text-sm mt-1">Hãy tạo vai trò đầu tiên</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <motion.div
          key={role.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {role.name}
                </h3>
                {role.isActive && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Hoạt động
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{role.description}</p>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Quyền hạn
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {role.permissionCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {role.userCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(role.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/dashboard/roles/${role.id}/permissions`}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quản lý quyền"
              >
                <Lock className="w-5 h-5 text-gray-600" />
              </Link>
              <button
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(role.id)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Xóa"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
