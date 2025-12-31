import { DataTable, ColumnDef, StatusBadge } from '@repo/ui';
import { motion } from '@repo/ui/motion';
import { mockWallet, Transaction } from '../data/mockWallet';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, Download } from '@repo/ui/icons';
import { useState } from 'react';

const columns: ColumnDef<Transaction>[] = [
  {
    label: 'Transaction ID',
    key: 'id',
    formatter: (value, item) => <span className="font-mono text-sm text-gray-500">#{item.id}</span>
  },
  {
    label: 'Description',
    key: 'description',
    formatter: (value, item) => (
      <div className="flex flex-col">
        <span className="font-bold text-[#1A1A1A] text-sm">{item.description}</span>
        <span className="text-xs text-gray-400">{item.category}</span>
      </div>
    )
  },
  {
    label: 'Date',
    key: 'date',
    formatter: (value, item) => {
      const date = new Date(item.date);
      return (
        <div className="text-sm text-gray-600">
          {date.toLocaleDateString('vi-VN')} <span className="text-gray-400 text-xs ml-1">{date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    }
  },
  {
    label: 'Amount',
    key: 'amount',
    formatter: (value, item) => {
      const isPositive = item.amount > 0;
      return (
        <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
          <span>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.abs(item.amount))}
          </span>
        </div>
      );
    }
  },
  {
    label: 'Status',
    key: 'status',
    formatter: (value, item) => (
      <StatusBadge status={item.status as any} />
    )
  }
];

export default function WalletTransactionTable() {
  const [data] = useState(mockWallet.transactions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A]">Transaction History</h3>
          <p className="text-sm text-gray-500">Detailed records of your income and withdrawals</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors tooltip" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Filter</span>
          </button>
          <button className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-black transition-colors flex items-center gap-2 shadow-md">
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-bold">Export</span>
          </button>
        </div>
      </div>

      <div className="p-2">
        <DataTable<Transaction>
          data={data}
          columns={columns}
          handleSort={() => { }}
        />
      </div>
    </motion.div>
  );
}
