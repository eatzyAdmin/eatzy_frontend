'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Wallet, Receipt, Calendar, User, ArrowUpRight, ArrowDownLeft,
  CheckCircle2, Clock, XCircle, Info, ChevronRight, Hash, Database,
  CreditCard, ExternalLink, Printer, Share2, Copy, Package, Store, MapPin,
  ShieldCheck, Banknote, AlertCircle
} from 'lucide-react';
import { WalletTransactionResponse, OrderResponse } from '@repo/types';
import { orderApi } from '@repo/api';
import { ImageWithFallback } from '@repo/ui';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface TransactionDetailsModalProps {
  transaction: WalletTransactionResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function TransactionDetailsModal({
  transaction,
  isOpen,
  onClose
}: TransactionDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [orderDetail, setOrderDetail] = useState<OrderResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && transaction?.order?.id) {
      fetchOrderDetails(transaction.order.id);
    } else {
      setOrderDetail(null);
    }
  }, [isOpen, transaction]);

  const fetchOrderDetails = async (orderId: number) => {
    try {
      setLoadingOrder(true);
      const res = await orderApi.getOrderById(orderId);
      if (res.data) {
        setOrderDetail(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  if (!mounted) return null;

  const tx = transaction;
  if (!tx) return null;

  const isCredit = ['DEPOSIT', 'REFUND', 'DELIVERY_EARNING', 'RESTAURANT_EARNING', 'EARNING', 'TOP_UP'].includes(tx.transactionType as string);
  const date = new Date(tx.createdAt);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[300]"
          />

          <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col max-h-[92vh] relative border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50 shrink-0">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase tracking-tight">TRANSACTION AUDIT</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-widest text-[10px]">Reference ID:</span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-mono">TX-{tx.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-sm border flex items-center gap-2
                                        ${tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'bg-lime-100 text-lime-700 border-lime-200' :
                      tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? <CheckCircle2 size={14} /> : tx.status === 'PENDING' ? <Clock size={14} /> : <XCircle size={14} />}
                    {tx.status}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-12">

                {/* Impact Section */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 text-center">
                  <div className={`mx-auto w-20 h-20 rounded-[28px] flex items-center justify-center mb-4 shadow-xl shadow-black/5 border-4 border-white
                                        ${isCredit ? 'bg-lime-50 text-lime-600' : 'bg-orange-50 text-orange-600'}`}>
                    {isCredit ? <ArrowDownLeft size={36} strokeWidth={2.5} /> : <ArrowUpRight size={36} strokeWidth={2.5} />}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{tx.transactionType.replace('_', ' ')}</p>
                  <h2 className={`text-5xl font-anton tracking-tighter ${isCredit ? 'text-lime-600' : 'text-orange-600'}`}>
                    {isCredit ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(tx.amount)}đ
                  </h2>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Running Balance</span>
                      <span className="font-anton text-lg text-gray-900">{new Intl.NumberFormat('vi-VN').format(tx.balanceAfter)}đ</span>
                    </div>
                  </div>
                </div>

                {/* Participants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <User size={24} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 block">Account Owner</span>
                      <span className="font-anton text-[#1A1A1A] uppercase tracking-tight text-base">{tx.wallet.user.name}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 block">Transaction Date</span>
                      <span className="font-anton text-[#1A1A1A] text-base">{format(date, 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-[28px] p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Receipt size={16} className="text-gray-400" />
                    <h4 className="font-anton text-sm tracking-tight text-[#1A1A1A] uppercase">Log Description</h4>
                  </div>
                  <p className="text-sm font-medium text-gray-600 italic bg-gray-50 p-4 rounded-2xl leading-relaxed border border-gray-100/50">
                    "{tx.description || 'System generated automated entry.'}"
                  </p>
                </div>

                {/* Linkage Section (Order Details) */}
                {tx.order?.id && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package size={16} className="text-primary" />
                      </div>
                      <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Full Order Specifications</h4>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {loadingOrder ? (
                      <div className="bg-white p-12 rounded-[32px] flex items-center justify-center border border-gray-100 border-dashed animate-pulse">
                        <div className="flex flex-col items-center gap-3">
                          <Clock className="animate-spin text-gray-300" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Linkage...</span>
                        </div>
                      </div>
                    ) : orderDetail ? (
                      <div className="space-y-5">
                        {/* Info Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Customer Card */}
                          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                {orderDetail.customer.avatar ? (
                                  <ImageWithFallback src={orderDetail.customer.avatar} alt={orderDetail.customer.name} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</h4>
                                <div className="font-bold text-[#1A1A1A] line-clamp-1">{orderDetail.customer.name}</div>
                              </div>
                            </div>

                            <div className="h-px bg-gray-200 w-full mb-3" />

                            <div className="mt-auto">
                              <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Phone</div>
                              <div className="text-xs font-bold text-[#1A1A1A]">{orderDetail.customer.phoneNumber || 'No phone provided'}</div>
                            </div>
                          </div>

                          {/* Driver/Delivery Card */}
                          <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                            {orderDetail.driver ? (
                              <div className="h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                                    {orderDetail.driver.avatar ? (
                                      <ImageWithFallback src={orderDetail.driver.avatar} alt={orderDetail.driver.name} fill className="object-cover" />
                                    ) : (
                                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Driver</h4>
                                    <div className="font-bold text-[#1A1A1A] line-clamp-1">{orderDetail.driver.name}</div>
                                  </div>
                                </div>

                                <div className="h-px bg-gray-200 w-full mb-3" />

                                <div className="flex items-center mt-auto">
                                  <div className="flex-1 pr-4">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Vehicle</div>
                                    <div className="text-xs font-bold text-[#1A1A1A] truncate">{orderDetail.driver.vehicleType || 'Motorbike'}</div>
                                    <div className="text-[10px] text-gray-500 font-medium">{orderDetail.driver.vehicleLicensePlate}</div>
                                  </div>

                                  <div className="w-px h-8 bg-gray-100" />

                                  <div className="flex-1 pl-4">
                                    <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Phone</div>
                                    <div className="text-xs font-bold text-[#1A1A1A]">{orderDetail.driver.phoneNumber}</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center mb-2">
                                  <Store className="w-5 h-5 text-gray-500" />
                                </div>
                                <h4 className="font-bold text-gray-400 text-sm">No Driver Assigned</h4>
                                <p className="text-xs text-gray-400">Order might be self-pickup or cancelled</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delivery Route */}
                        <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                          <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <h4 className="font-bold text-[#1A1A1A]">Delivery Route</h4>
                          </div>
                          <div className="p-5 flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                              </div>
                              <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-300 my-1" />
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                                <MapPin className="w-4 h-4 text-red-500" />
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between py-0.5">
                              <div className="pb-6">
                                <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1">Pick up</div>
                                <div className="font-bold text-[#1A1A1A] text-base mb-0.5 line-clamp-1">{orderDetail.restaurant.name}</div>
                                <div className="text-xs text-gray-500 font-medium line-clamp-1">{orderDetail.restaurant.address}</div>
                              </div>

                              <div>
                                <div className="text-xs font-bold text-red-500 uppercase tracking-wide mb-1">Drop off</div>
                                <div className="font-bold text-[#1A1A1A] text-base mb-0.5 line-clamp-2">{orderDetail.deliveryAddress}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Safety Banner */}
                        <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                          </div>
                          <p className="text-xs text-primary leading-relaxed font-medium">
                            This order is protected by Eatzy Guarantee. <span className="font-bold cursor-pointer hover:underline">Learn more</span>
                          </p>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-gray-400" />
                              <h4 className="font-bold text-[#1A1A1A]">Order Items</h4>
                            </div>
                            <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">{orderDetail.orderItems.length} items</span>
                          </div>

                          <div className="p-2">
                            {orderDetail.orderItems.map((item, idx) => (
                              <div key={idx} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-[20px] transition-colors duration-200">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton text-lg flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    {item.quantity}x
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#1A1A1A] text-sm group-hover:text-primary transition-colors">{item.dish.name}</div>
                                    <div className="text-xs text-gray-400 font-medium">Standard option</div>
                                  </div>
                                </div>
                                <span className="font-bold text-[#1A1A1A] text-sm">{formatCurrency(item.priceAtPurchase * item.quantity)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Bill Summary */}
                          <div className="bg-gray-50/50 p-6 space-y-3 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 font-medium">Subtotal</span>
                              <span className="font-bold text-gray-900">{formatCurrency(orderDetail.subtotal)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 font-medium">Delivery Fee</span>
                              <span className="font-bold text-gray-900">{formatCurrency(orderDetail.deliveryFee)}</span>
                            </div>

                            {orderDetail.discountAmount > 0 && (
                              <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500 font-medium">Discount</span>
                                  {orderDetail.vouchers?.[0] && (
                                    <span className="text-[10px] font-bold bg-lime-100 text-primary px-1.5 py-0.5 rounded uppercase tracking-wide border border-lime-200">
                                      {orderDetail.vouchers[0].code}
                                    </span>
                                  )}
                                </div>
                                <span className="font-bold text-primary">-{formatCurrency(orderDetail.discountAmount)}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500 font-medium">Payment Method</span>
                                {orderDetail.paymentMethod.toLowerCase() === 'vnpay' && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">VNPay</span>}
                                {orderDetail.paymentMethod.toLowerCase() === 'cash' && <span className="text-[10px] font-bold bg-lime-100 text-primary px-1.5 py-0.5 rounded uppercase">CASH</span>}
                                {orderDetail.paymentMethod.toLowerCase() === 'wallet' && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">WALLET</span>}
                              </div>
                              <span className="font-bold text-gray-900 capitalize">{orderDetail.paymentMethod.toLowerCase()}</span>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 opacity-50" />

                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#1A1A1A] text-base">Total Amount</span>
                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                  <Clock className="w-3 h-3" />
                                  <span>{format(new Date(orderDetail.createdAt), 'MMM d, yyyy')}</span>
                                </div>
                              </div>
                              <span className="font-anton text-3xl text-primary drop-shadow-sm">{formatCurrency(orderDetail.totalAmount)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Profit Information */}
                        <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                            <Banknote className="w-5 h-5 text-gray-400" />
                            <h4 className="font-bold text-[#1A1A1A]">Profit Information</h4>
                          </div>

                          <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 font-medium">Order Subtotal</span>
                              <span className="font-bold text-gray-900">{formatCurrency((orderDetail.restaurantNetEarning || 0) + (orderDetail.restaurantCommissionAmount || 0))}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-gray-500 font-medium">Platform Commission (15%)</span>
                              <span className="font-bold text-red-500">-{formatCurrency(orderDetail.restaurantCommissionAmount || 0)}</span>
                            </div>

                            <div className="h-px bg-gray-100 my-2" />

                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#1A1A1A] text-base">Net Income</span>
                              <span className="font-anton text-2xl text-primary">{formatCurrency(orderDetail.restaurantNetEarning || 0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100 flex items-center gap-4">
                        <AlertCircle className="text-amber-500 flex-shrink-0" />
                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                          Order linkage exists but details could not be retrieved. The record might have been archived or restricted.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
