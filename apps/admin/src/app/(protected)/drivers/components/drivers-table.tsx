"use client";

import { motion } from "@repo/ui/motion";
import { Truck, Eye, Ban, Check } from "@repo/ui/icons";

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

interface DriversTableProps {
  drivers: Driver[];
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  online: "bg-green-100 text-green-700",
  offline: "bg-gray-100 text-gray-700",
  delivering: "bg-blue-100 text-blue-700",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-red-100 text-red-700",
};

const statusLabels: Record<string, string> = {
  active: "Hoạt động",
  online: "Đang online",
  offline: "Offline",
  delivering: "Đang giao hàng",
  inactive: "Không hoạt động",
  suspended: "Bị khóa",
};

const vehicleLabels: Record<string, string> = {
  bike: "Xe máy",
  car: "Ô tô",
  truck: "Xe tải",
};

export function DriversTable({
  drivers,
  onSuspend,
  onActivate,
}: DriversTableProps) {
  if (drivers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl border border-gray-100"
      >
        <Truck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Chưa có tài xế nào</p>
        <p className="text-gray-400 text-sm mt-1">Tài xế sẽ xuất hiện khi đăng ký</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên tài xế
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điện thoại
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại xe
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng chuyến
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {drivers.map((driver, index) => (
              <motion.tr
                key={driver.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{driver.name}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600">{driver.email}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600">{driver.phone}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-700">
                    {vehicleLabels[driver.vehicleType]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {driver.totalDeliveries}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {driver.rating}
                    </span>
                    <span className="text-yellow-400">★</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[driver.status]}`}>
                    {statusLabels[driver.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    {driver.status !== "suspended" ? (
                      <button
                        onClick={() => onSuspend(driver.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Khóa tài khoản"
                      >
                        <Ban className="w-4 h-4 text-red-600" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(driver.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mở khóa"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
