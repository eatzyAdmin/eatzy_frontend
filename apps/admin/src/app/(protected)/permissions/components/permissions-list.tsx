"use client";

import { motion } from "@repo/ui/motion";
import { Code, Copy, Edit2, Trash2 } from "@repo/ui/icons";

interface Permission {
  id: string;
  name: string;
  apiEndpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  category: string;
  description: string;
}

interface PermissionsListProps {
  permissions: Permission[];
  onDelete: (id: string) => void;
}

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-700",
  POST: "bg-green-100 text-green-700",
  PUT: "bg-yellow-100 text-yellow-700",
  DELETE: "bg-red-100 text-red-700",
  PATCH: "bg-purple-100 text-purple-700",
};

export function PermissionsList({ permissions, onDelete }: PermissionsListProps) {
  if (permissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl border border-gray-100"
      >
        <Code className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Chưa có quyền hạn nào</p>
        <p className="text-gray-400 text-sm mt-1">Hãy tạo quyền hạn đầu tiên</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {permissions.map((permission, index) => (
        <motion.div
          key={permission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {permission.name}
                </h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${methodColors[permission.method]}`}>
                  {permission.method}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                  {permission.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{permission.description}</p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg w-fit">
                <Code className="w-4 h-4 text-gray-600" />
                <code className="text-xs font-mono text-gray-700">
                  {permission.apiEndpoint}
                </code>
                <button
                  className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Sao chép"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-5 h-5 text-blue-600" />
              </button>
              <button
                onClick={() => onDelete(permission.id)}
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
