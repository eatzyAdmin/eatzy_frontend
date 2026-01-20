'use client';

import { motion } from '@repo/ui/motion';
import { Clock, MapPin, Package, User } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import type { Order } from '@repo/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const datetime = order.createdAt
    ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
    : '--/--/---- --:--';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-[28px] p-5 transition-all duration-300 cursor-pointer shadow-md border-4 border-gray-100 hover:border-[var(--primary)]/40 hover:bg-gray-50/30"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</h4>
          <div className="text-lg font-anton font-bold text-[#1A1A1A] mt-0.5">
            {order.code}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-lime-500 text-white px-2.5 py-1 rounded-lg">
            {totalItems} items
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customer</h4>
          <div className="font-bold text-[#1A1A1A] text-sm truncate">
            {order.customer?.name || 'Khách hàng'}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 w-full mb-4" />

      {/* Address */}
      <div className="mb-4">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" strokeWidth={2.4} />
          <div className="font-bold text-gray-700 text-base line-clamp-2">
            {order.deliveryLocation.address || 'Địa chỉ giao hàng'}
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="bg-gray-50/70 rounded-2xl p-3 mb-4">
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 text-[#1A1A1A] font-anton text-sm flex items-center justify-center shadow-sm">
                {item.quantity}x
              </div>
              <span className="font-bold text-gray-600 text-sm line-clamp-1 flex-1">{item.name}</span>
            </div>
          ))}
          {order.items.length > 2 && (
            <div className="text-xs text-gray-400 font-medium pl-10">
              +{order.items.length - 2} more items...
            </div>
          )}
        </div>
      </div>

      {/* Time & Price Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium" suppressHydrationWarning>
          <Clock className="w-3.5 h-3.5" />
          <span>{datetime}</span>
        </div>
        <span className="font-anton text-xl font-semibold text-[var(--primary)]">
          {formatVnd(order.total)}
        </span>
      </div>
    </motion.div>
  );
}
