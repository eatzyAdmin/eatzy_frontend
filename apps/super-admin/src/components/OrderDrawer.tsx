'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, XCircle, Clock, MapPin, User } from '@repo/ui/icons';
import { formatVnd } from '@repo/lib';
import type { Order, OrderItem } from '@repo/types';
import { useSwipeConfirmation } from '@repo/ui';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import '@repo/ui/styles/scrollbar.css';

interface OrderDrawerProps {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: (orderId: string) => void;
  onReject: (orderId: string, reason: string) => void;
  onComplete: (orderId: string) => void;
}

const REJECTION_REASONS = [
  'Hết món',
  'Nhà hàng quá tải',
  'Không liên hệ được khách',
  'Địa chỉ giao hàng quá xa',
  'Món ăn không khả dụng',
  'Lý do khác'
];

export default function OrderDrawer({ open, order, onClose, onConfirm, onReject, onComplete }: OrderDrawerProps) {
  const { confirm } = useSwipeConfirmation();
  const [showRejectReasons, setShowRejectReasons] = useState(false);

  if (!order) return null;

  const handleConfirmOrder = () => {
    onConfirm(order.id);
  };

  const handleRejectOrder = () => {
    setShowRejectReasons(true);
  };

  const handleSelectReason = (reason: string) => {
    confirm({
      title: 'Từ chối đơn hàng',
      description: `Bạn có chắc muốn từ chối đơn hàng này với lý do: "${reason}"?`,
      confirmText: 'Từ chối',
      onConfirm: () => {
        onReject(order.id, reason);
        setShowRejectReasons(false);
      }
    });
  };

  const handleCompleteOrder = () => {
    onComplete(order.id);
  };

  const handleCancelReject = () => {
    setShowRejectReasons(false);
  };

  const isPending = order.status === 'PLACED';
  const isPrepared = order.status === 'PREPARED';

  const datetime = order.createdAt
    ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
    : '';

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 520, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 520, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="fixed z-[70] left-0 right-0 bottom-0 max-h-[90vh] rounded-t-[40px] bg-[#F7F7F7] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white">
              <div className="text-2xl font-anton font-bold text-[#1A1A1A]">
                CHI TIẾT ĐƠN HÀNG
              </div>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* 2 Column Layout: 70% - 30% */}
            <div className="grid grid-cols-[70%_30%] h-[calc(90vh-88px)]">
              {/* Left Column: Order Details */}
              <div className="overflow-y-auto px-6 py-4 custom-scrollbar">
                <div className="m-4 rounded-3xl border-2 border-gray-300">
                  {/* Order Code & Time */}
                  <div className="p-8 border-b-2 border-gray-300">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Mã đơn hàng</div>
                        <div className="text-xl font-anton font-bold text-primary">
                          {order.code}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">Thời gian</div>
                        <div className="flex items-center gap-1 text-sm font-semibold" suppressHydrationWarning>
                          <Clock className="w-4 h-4 text-gray-400" />
                          {datetime || '--/--/---- --:--'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="p-8 border-b-2 border-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Địa chỉ giao hàng</div>
                        <div className="text-sm font-semibold text-[#1A1A1A]">
                          {order.deliveryLocation.address || 'Địa chỉ không xác định'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-8 border-b-2 border-gray-300">
                    <div className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Món ăn ({order.items.length})
                    </div>
                    <div className="space-y-3">
                      {order.items.map((item: OrderItem) => (
                        <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                            <span className="font-anton text-lg font-bold">{item.quantity}x</span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-[#1A1A1A] mb-1">{item.name}</div>

                            {/* Variant */}
                            {item.options?.variant && (
                              <div className="text-xs text-gray-600 mb-1">
                                <span className="font-semibold">Phân loại:</span> {item.options.variant.name}
                                {item.options.variant.price > 0 && ` (+${formatVnd(item.options.variant.price)})`}
                              </div>
                            )}

                            {/* Addons */}
                            {item.options?.addons && item.options.addons.length > 0 && (
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Topping:</span> {item.options.addons.map((a: { id: string; name: string; price: number }) =>
                                  `${a.name} (+${formatVnd(a.price)})`
                                ).join(', ')}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-anton text-lg font-bold text-primary">
                              {formatVnd(item.price * item.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="p-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-semibold">{formatVnd(order.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Phí vận chuyển</span>
                        <span className="font-semibold">{formatVnd(order.fee)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Giảm giá</span>
                          <span className="font-semibold text-green-600">-{formatVnd(order.discount)}</span>
                        </div>
                      )}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-semibold">Tổng cộng</span>
                        <span className="text-2xl font-anton font-bold text-primary">
                          {formatVnd(order.total)}
                        </span>
                      </div>

                      {/* Restaurant earnings */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Nhà hàng nhận</span>
                          <span className="text-lg font-anton font-bold text-green-600">
                            {formatVnd(order.subtotal - order.discount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Buttons */}
              <div className="bg-white p-12 flex flex-col justify-center gap-4 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {!showRejectReasons ? (
                    <motion.div
                      key="action-buttons"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4 w-full"
                    >
                      {isPending && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleConfirmOrder}
                            className="w-full flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-3xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                          >
                            <CheckCircle className="w-8 h-8" />
                            <span>Xác nhận</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleRejectOrder}
                            className="w-full flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-3xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-8 h-8" />
                            <span>Từ chối</span>
                          </motion.button>
                        </>
                      )}
                      {isPrepared && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCompleteOrder}
                          className="w-full flex flex-col items-center justify-center gap-2 px-6 py-6 rounded-3xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                        >
                          <CheckCircle className="w-8 h-8" />
                          <span>Hoàn thành</span>
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="reject-reasons"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3 w-full"
                    >
                      <div className="text-sm font-semibold text-gray-700 text-center mb-4">Chọn lý do từ chối:</div>
                      {REJECTION_REASONS.map((reason, index) => (
                        <motion.button
                          key={reason}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectReason(reason)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors text-center"
                        >
                          {reason}
                        </motion.button>
                      ))}
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: REJECTION_REASONS.length * 0.05, duration: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelReject}
                        className="w-full px-4 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold mt-4"
                      >
                        Hủy
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>


        </>
      )}
    </AnimatePresence>
  );
}
