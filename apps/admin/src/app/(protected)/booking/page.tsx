"use client";

import { useState } from "react";
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
} from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { StatusBadge } from "@repo/ui";

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  location: string;
  note: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "bk1",
      customerName: "Trần Thị Hương",
      phone: "0901234567",
      date: "2024-12-25",
      time: "18:00",
      partySize: 4,
      location: "Bàn góc tầng 1",
      note: "Có khách VIP, chuẩn bị lịch phục vụ tốt",
      status: "confirmed",
      createdAt: "2024-12-18T10:30:00Z",
    },
    {
      id: "bk2",
      customerName: "Nguyễn Minh Tuấn",
      phone: "0912345678",
      date: "2024-12-26",
      time: "19:30",
      partySize: 6,
      location: "Phòng riêng tầng 2",
      note: "Sinh nhật, cần trang trí với bóng bay",
      status: "confirmed",
      createdAt: "2024-12-18T14:15:00Z",
    },
    {
      id: "bk3",
      customerName: "Lê Văn Hùng",
      phone: "0923456789",
      date: "2024-12-27",
      time: "12:00",
      partySize: 2,
      location: "Bàn cạnh cửa sổ",
      note: "Đặt trước với bạn gái",
      status: "pending",
      createdAt: "2024-12-18T16:45:00Z",
    },
    {
      id: "bk4",
      customerName: "Phạm Hoa Liên",
      phone: "0934567890",
      date: "2024-12-20",
      time: "17:00",
      partySize: 8,
      location: "Phòng họp",
      note: "Họp công ty, cần đồ ăn nhanh",
      status: "cancelled",
      createdAt: "2024-12-17T09:20:00Z",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Booking>>({
    customerName: "",
    phone: "",
    date: "",
    time: "",
    partySize: 1,
    location: "",
    note: "",
    status: "pending",
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddBooking = () => {
    setEditingId(null);
    setFormData({
      customerName: "",
      phone: "",
      date: "",
      time: "",
      partySize: 1,
      location: "",
      note: "",
      status: "pending",
    });
    setShowModal(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingId(booking.id);
    setFormData(booking);
    setShowModal(true);
  };

  const handleSaveBooking = () => {
    if (editingId) {
      setBookings(bookings.map(b => b.id === editingId ? { ...b, ...formData } : b));
    } else {
      const newBooking: Booking = {
        ...formData as Booking,
        id: `bk${bookings.length + 1}`,
        createdAt: new Date().toISOString(),
      };
      setBookings([...bookings, newBooking]);
    }
    setShowModal(false);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  const handleStatusChange = (id: string, status: Booking["status"]) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Quản lý đặt bàn</h1>
            <p className="text-gray-600 mt-2">Quản lý và xác nhận đơn đặt bàn từ khách hàng</p>
          </div>
          <button
            onClick={handleAddBooking}
            className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm đặt bàn
          </button>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã huỷ</option>
          </select>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Điện thoại</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Ngày giờ</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Số người</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Vị trí</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Ghi chú</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{booking.customerName}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {booking.date} {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {booking.partySize} người
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {booking.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-xs">{booking.note}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={booking.status === "confirmed" ? "active" : booking.status === "pending" ? "inTerm" : "disabled"} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Xác nhận"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Huỷ"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
        >
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Tổng đặt bàn</p>
            <h3 className="text-3xl font-bold text-gray-900">{bookings.length}</h3>
            <p className="text-sm text-gray-500 mt-2">Tất cả các đơn</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Chờ xác nhận</p>
            <h3 className="text-3xl font-bold text-blue-600">{bookings.filter(b => b.status === "pending").length}</h3>
            <p className="text-sm text-blue-600 mt-2">Cần xử lý</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-green-200">
            <p className="text-sm text-gray-600 mb-2">Đã xác nhận</p>
            <h3 className="text-3xl font-bold text-green-600">{bookings.filter(b => b.status === "confirmed").length}</h3>
            <p className="text-sm text-green-600 mt-2">Đã phê duyệt</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-red-200">
            <p className="text-sm text-gray-600 mb-2">Đã huỷ</p>
            <h3 className="text-3xl font-bold text-red-600">{bookings.filter(b => b.status === "cancelled").length}</h3>
            <p className="text-sm text-red-600 mt-2">Không sử dụng</p>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Chỉnh sửa đặt bàn" : "Thêm đặt bàn mới"}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên khách hàng"
                  value={formData.customerName || ""}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <input
                  type="tel"
                  placeholder="Số điện thoại"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <input
                  type="time"
                  value={formData.time || ""}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  min="1"
                  placeholder="Số người"
                  value={formData.partySize || 1}
                  onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <input
                  type="text"
                  placeholder="Vị trí bàn"
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <textarea
                placeholder="Ghi chú thêm"
                value={formData.note || ""}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] h-24"
              />

              <select
                value={formData.status || "pending"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã huỷ</option>
              </select>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveBooking}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Lưu
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}