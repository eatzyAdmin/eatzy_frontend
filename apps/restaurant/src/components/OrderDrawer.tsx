'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, CheckCircle, XCircle, Clock, MapPin, User, ChevronRight } from '@repo/ui/icons';
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
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 18, stiffness: 100 }}
            className="fixed z-[70] left-4 right-4 bottom-4 top-20 rounded-[40px] bg-[#F8F9FA] overflow-hidden shadow-2xl flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-gray-100 shrink-0">
              <div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ORDER DETAILS</div>
                <div className="text-3xl font-anton font-bold text-[#1A1A1A]">
                  #{order.code}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Layout */}
            <div className="flex-1 overflow-hidden grid grid-cols-12 gap-0 relative">
              {/* Left Column: Order Information (Scrollable) */}
              <div className="col-span-8 overflow-y-auto custom-scrollbar bg-white">
                <div className="p-8 space-y-8">

                  {/* Customer & Time Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-gray-400">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">CUSTOMER</div>
                          <div className="font-bold text-[#1A1A1A] text-lg">
                            {order.customer?.name || 'Guest User'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-gray-400">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">ORDER TIME</div>
                          <div className="font-bold text-[#1A1A1A] text-lg pb-1" suppressHydrationWarning>
                            {datetime || '--:--'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="bg-gray-50 rounded-[24px] p-5 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-[#1A1A1A]">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1 mt-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">DELIVERY ADDRESS</div>
                        <div className="font-bold text-[#1A1A1A] text-lg leading-snug">
                          {order.deliveryLocation.address || 'Address not provided'}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Order Items */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-[2px] bg-gray-200 rounded-full"></span>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ORDER ITEMS ({order.items.length})</span>
                      <span className="flex-1 h-[2px] bg-gray-200 rounded-full"></span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {order.items.map((item: OrderItem) => (
                        <div key={item.id} className="bg-white rounded-[24px] p-4 border-2 border-gray-50 hover:border-lime-100 hover:shadow-lg hover:shadow-lime-500/5 transition-all duration-300 flex items-start gap-4 group">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 text-[#1A1A1A] font-anton text-xl flex items-center justify-center flex-shrink-0 group-hover:bg-lime-400 group-hover:text-white transition-colors duration-300 shadow-inner">
                            {item.quantity}x
                          </div>
                          <div className="flex-1 py-1">
                            <div className="font-bold text-[#1A1A1A] text-lg">{item.name}</div>

                            {/* Variants & Addons */}
                            {(item.options?.variant || (item.options?.addons && item.options.addons.length > 0)) && (
                              <div className="mt-2 text-sm text-gray-500 space-y-1">
                                {item.options?.variant && (
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    <span className='font-semibold text-gray-400'>{item.options.variant.name} {item.options.variant.price > 0 && `(+${formatVnd(item.options.variant.price)})`}</span>
                                  </div>
                                )}
                                {item.options?.addons?.map((a) => (
                                  <div key={a.id} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                    <span className='font-semibold text-gray-400'>{a.name} (+{formatVnd(a.price)})</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="py-1 text-right">
                            <div className="font-anton text-xl text-primary font-bold">
                              {formatVnd(item.price * item.quantity)}
                            </div>
                            <div className="text-xs font-medium text-gray-400 mt-1">
                              {formatVnd(item.price)} / item
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment & Actions (Sticky/Fixed) */}
              <div className="col-span-4 bg-[#FAFAFA] border-l border-gray-100 flex flex-col h-full">
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">

                  {/* Payment Summary Box */}
                  <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mb-6">
                    <h3 className="text-center font-anton text-xl font-semibold text-[#1A1A1A] mb-6 uppercase">Payment Summary</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-base">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="font-bold text-[#1A1A1A]">{formatVnd(order.subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-base">
                        <span className="text-gray-500 font-medium">Delivery Fee</span>
                        <span className="font-bold text-[#1A1A1A]">{formatVnd(order.fee)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex items-center justify-between text-base">
                          <span className="text-gray-500 font-medium">Discount</span>
                          <span className="font-bold text-red-500">-{formatVnd(order.discount)}</span>
                        </div>
                      )}

                      <div className="border-t-2 border-dashed border-gray-100 my-4"></div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800 text-lg">Total</span>
                        <span className="font-anton text-3xl text-primary">{formatVnd(order.total)}</span>
                      </div>
                    </div>

                    {/* Compact Earnings Info */}
                    <div className="mt-6 bg-lime-50 rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-lime-700 uppercase">Restaurant Net Earning</span>
                      <span className="text-sm font-anton font-bold text-lime-700">{formatVnd(order.subtotal - order.discount)}</span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {!showRejectReasons ? (
                        <motion.div
                          key="action-buttons"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          {isPending && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirmOrder}
                                className="w-full py-4 rounded-2xl bg-[#1A1A1A] text-white font-bold text-lg shadow-xl shadow-black/10 hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group"
                              >
                                <span>Confirm Order</span>
                                <div className="w-8 h-8 rounded-full bg-lime-400 text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <CheckCircle className="w-5 h-5" strokeWidth={3} />
                                </div>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleRejectOrder}
                                className="w-full py-4 rounded-2xl bg-white border-2 border-gray-200 text-gray-500 font-bold hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all flex items-center justify-center gap-2"
                              >
                                <XCircle className="w-5 h-5" />
                                <span>Reject Order</span>
                              </motion.button>
                            </>
                          )}

                          {isPrepared && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={handleCompleteOrder}
                              className="w-full py-4 rounded-2xl bg-lime-500 text-white font-bold text-lg shadow-xl shadow-lime-500/30 hover:bg-lime-600 transition-all flex items-center justify-center gap-3"
                            >
                              <span>Mark as Ready</span>
                              <CheckCircle className="w-6 h-6" />
                            </motion.button>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="reasons-list"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="bg-white rounded-[24px] p-5 shadow-lg border border-gray-100"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-gray-800">Select Reason</span>
                            <button onClick={handleCancelReject} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                            {REJECTION_REASONS.map((reason) => (
                              <button
                                key={reason}
                                onClick={() => handleSelectReason(reason)}
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-50 hover:text-red-600 text-sm font-medium transition-colors flex items-center justify-between group"
                              >
                                {reason}
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
