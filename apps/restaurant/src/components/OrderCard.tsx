'use client';

import { motion } from '@repo/ui/motion';
import { Clock, MapPin } from '@repo/ui/icons';
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary/20"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-lg font-anton font-bold text-[#1A1A1A]">
            {order.code}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1" suppressHydrationWarning>
            <Clock className="w-3 h-3" />
            <span>{datetime}</span>
          </div>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          {totalItems} món
        </div>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-gray-700 line-clamp-2">
          {order.deliveryLocation.address || 'Địa chỉ giao hàng'}
        </div>
      </div>

      {/* Items Preview */}
      <div className="mb-3 space-y-1">
        {order.items.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
            <span className="font-semibold text-primary">{item.quantity}x</span>
            <span className="line-clamp-1">{item.name}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <div className="text-xs text-gray-400">
            +{order.items.length - 2} món khác...
          </div>
        )}
      </div>

      {/* Price */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Tổng tiền</span>
          <span className="text-lg font-anton font-bold text-primary">
            {formatVnd(order.total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
