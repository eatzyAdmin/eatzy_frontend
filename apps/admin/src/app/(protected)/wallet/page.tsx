"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Search, Eye, EyeOff } from "@repo/ui/icons";
import { motion } from "@repo/ui/motion";
import { MOCK_WALLETS } from "@/data/mock-data";

interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalSpent: number;
  totalEarned: number;
  status: "active" | "suspended";
  createdAt: string;
}

export default function WalletPage() {
  const [wallets, setWallets] = useState<Wallet[]>(MOCK_WALLETS as Wallet[]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "suspended">("all");
  const [showAddAmount, setShowAddAmount] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");

  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch = wallet.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || wallet.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalSpent = wallets.reduce((sum, w) => sum + w.totalSpent, 0);
  const totalEarned = wallets.reduce((sum, w) => sum + w.totalEarned, 0);

  const handleAddBalance = (walletId: string) => {
    const amount = parseInt(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setWallets(
        wallets.map((w) =>
          w.id === walletId ? { ...w, balance: w.balance + amount, totalEarned: w.totalEarned + amount } : w
        )
      );
      setAddAmount("");
      setShowAddAmount(null);
    }
  };

  const handleWithdraw = (walletId: string, amount: number) => {
    setWallets(
      wallets.map((w) =>
        w.id === walletId && w.balance >= amount
          ? { ...w, balance: w.balance - amount, totalSpent: w.totalSpent + amount }
          : w
      )
    );
  };

  const handleToggleStatus = (walletId: string) => {
    setWallets(
      wallets.map((w) =>
        w.id === walletId
          ? { ...w, status: w.status === "active" ? "suspended" : "active" }
          : w
      )
    );
  };

  const stats = [
    { label: "Tổng số ví", value: wallets.length },
    { label: "Tổng balance", value: `₫${(totalBalance / 1000000).toFixed(1)}M` },
    { label: "Tổng chi tiêu", value: `₫${(totalSpent / 1000000).toFixed(1)}M` },
    { label: "Tổng nạp", value: `₫${(totalEarned / 1000000).toFixed(1)}M` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-30 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Ví Tiền</h1>
          <p className="text-gray-600 mt-1">Quản lý ví tiền của người dùng</p>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm ví..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="suspended">Bị khóa</option>
          </select>
        </div>

        {/* Wallets Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">ID Người dùng</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tổng chi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Tổng nạp</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredWallets.map((wallet) => (
                  <motion.tr
                    key={wallet.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{wallet.userId}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-green-600">₫{wallet.balance.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">₫{wallet.totalSpent.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">₫{wallet.totalEarned.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          wallet.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {wallet.status === "active" ? "Hoạt động" : "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="relative">
                          {showAddAmount === wallet.id ? (
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-10 w-48">
                              <input
                                type="number"
                                placeholder="Số tiền nạp"
                                value={addAmount}
                                onChange={(e) => setAddAmount(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded text-sm mb-2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddBalance(wallet.id)}
                                  className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
                                >
                                  Nạp
                                </button>
                                <button
                                  onClick={() => setShowAddAmount(null)}
                                  className="flex-1 px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-300"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          ) : null}
                          <button
                            onClick={() => setShowAddAmount(showAddAmount === wallet.id ? null : wallet.id)}
                            className="text-blue-600 hover:text-blue-700 p-2 text-xs font-semibold"
                          >
                            + Nạp
                          </button>
                        </div>
                        <button
                          onClick={() => handleToggleStatus(wallet.id)}
                          className="text-yellow-600 hover:text-yellow-700 p-2"
                        >
                          {wallet.status === "active" ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
