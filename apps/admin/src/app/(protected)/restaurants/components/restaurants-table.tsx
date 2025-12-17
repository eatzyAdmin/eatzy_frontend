"use client";

import { motion } from "@repo/ui/motion";
import { Store, Eye, Ban, Check } from "@repo/ui/icons";

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

interface RestaurantsTableProps {
  restaurants: Restaurant[];
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onApprove?: (id: string) => void;
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

const statusLabels: Record<string, string> = {
  active: "Hoạt động",
  inactive: "Không hoạt động",
  suspended: "Bị khóa",
  pending: "Chờ duyệt",
};

export function RestaurantsTable({
  restaurants,
  onSuspend,
  onActivate,
  onApprove,
}: RestaurantsTableProps) {
  if (restaurants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white rounded-2xl border border-gray-100"
      >
        <Store className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">Chưa có nhà hàng nào</p>
        <p className="text-gray-400 text-sm mt-1">Nhà hàng sẽ xuất hiện khi đăng ký</p>
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
                Tên nhà hàng
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Địa chỉ
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh giá
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doanh thu
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
            {restaurants.map((restaurant, index) => (
              <motion.tr
                key={restaurant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="font-medium text-gray-900">{restaurant.name}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600">{restaurant.email}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm text-gray-600">{restaurant.city}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-1 flex-wrap">
                    {restaurant.foodCategories.slice(0, 2).map((cat) => (
                      <span
                        key={cat}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                      >
                        {cat}
                      </span>
                    ))}
                    {restaurant.foodCategories.length > 2 && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        +{restaurant.foodCategories.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-900">
                      {restaurant.rating > 0 ? restaurant.rating : "-"}
                    </span>
                    {restaurant.rating > 0 && (
                      <span className="text-yellow-400">★</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(restaurant.revenue)}
                  </p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[restaurant.status]}`}>
                    {statusLabels[restaurant.status]}
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
                    {restaurant.status === "pending" && onApprove ? (
                      <button
                        onClick={() => onApprove(restaurant.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Duyệt"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    ) : null}
                    {restaurant.status !== "suspended" && restaurant.status !== "pending" ? (
                      <button
                        onClick={() => onSuspend(restaurant.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Khóa"
                      >
                        <Ban className="w-4 h-4 text-red-600" />
                      </button>
                    ) : null}
                    {restaurant.status === "suspended" ? (
                      <button
                        onClick={() => onActivate(restaurant.id)}
                        className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                        title="Mở khóa"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </button>
                    ) : null}
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
