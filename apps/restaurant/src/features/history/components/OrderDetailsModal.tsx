import { motion, AnimatePresence } from '@repo/ui/motion';
import { ImageWithFallback } from '@repo/ui';
import { X, User, MapPin, Clock, ShieldCheck, Package, Store, CheckCircle, AlertCircle, RotateCcw, Banknote } from '@repo/ui/icons';
import { OrderHistoryItem } from '../data/mockHistory';

interface OrderDetailsModalProps {
  order: OrderHistoryItem | null;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[80]"
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-[#F8F9FA] w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shadow-sm/50">
                <div>
                  <h3 className="text-2xl font-anton font-bold text-[#1A1A1A]">ORDER DETAILS</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-gray-400">ID:</span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-mono">{order.id}</span>
                    <span className="text-gray-300 mx-1">|</span>
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {(() => {
                    const config = {
                      completed: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', icon: CheckCircle, label: 'Completed' },
                      cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle, label: 'Cancelled' },
                      refunded: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', icon: RotateCcw, label: 'Refunded' },
                    }[order.status] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: Clock, label: order.status };

                    const Icon = config.icon;

                    return (
                      <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2 ${config.bg} ${config.text} ${config.border}`}>
                        <Icon className="w-3.5 h-3.5" />
                        {config.label}
                      </div>
                    );
                  })()}
                  <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar pb-10">

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Customer Card */}
                  <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        {order.customerAvatar ? (
                          <ImageWithFallback src={order.customerAvatar} alt={order.customerName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</h4>
                        <div className="font-bold text-[#1A1A1A] line-clamp-1">{order.customerName}</div>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full mb-3" />

                    <div className="mt-auto">
                      <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Phone</div>
                      <div className="text-xs font-bold text-[#1A1A1A]">{order.customerPhone || 'No phone provided'}</div>
                    </div>
                  </div>

                  {/* Driver/Delivery Card */}
                  <div className="bg-white rounded-[28px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    {order.driver ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                            <ImageWithFallback src={order.driver.avatar} alt={order.driver.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Driver</h4>
                            <div className="font-bold text-[#1A1A1A] line-clamp-1">{order.driver.name}</div>
                          </div>
                        </div>

                        <div className="h-px bg-gray-200 w-full mb-3" />

                        <div className="flex items-center mt-auto">
                          <div className="flex-1 pr-4">
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Vehicle</div>
                            <div className="text-xs font-bold text-[#1A1A1A] truncate">{order.driver.vehicleType}</div>
                            <div className="text-[10px] text-gray-500 font-medium">{order.driver.licensePlate}</div>
                          </div>

                          <div className="w-px h-8 bg-gray-100" />

                          <div className="flex-1 pl-4">
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Phone</div>
                            <div className="text-xs font-bold text-[#1A1A1A]">{order.driver.phone}</div>
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
                    {/* Left Timeline Column */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                        <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary)]" />
                      </div>
                      <div className="w-0.5 flex-grow border-l-2 border-dotted border-gray-300 my-1" />
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shadow-sm flex-shrink-0 z-10">
                        <MapPin className="w-4 h-4 text-[var(--danger)]" />
                      </div>
                    </div>

                    {/* Right Content Column */}
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="pb-6">
                        <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wide mb-1">Pick up</div>
                        <div className="font-bold text-[#1A1A1A] text-base mb-0.5 line-clamp-1">{order.restaurantName || 'Eatzy Restaurant'}</div>
                        <div className="text-xs text-gray-500 font-medium line-clamp-1">{order.pickupAddress}</div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[var(--danger)] uppercase tracking-wide mb-1">Drop off</div>
                        <div className="font-bold text-[#1A1A1A] text-base mb-0.5 line-clamp-2">{order.deliveryAddress || 'Customer Address'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety Banner */}
                <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <p className="text-xs text-[var(--primary)] leading-relaxed font-medium">
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
                    <span className="text-xs font-bold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-lg">{order.items.length} items</span>
                  </div>

                  <div className="p-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-[20px] transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[14px] bg-gray-100 text-[#1A1A1A] font-anton text-lg flex items-center justify-center shadow-sm group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                            {item.quantity}x
                          </div>
                          <div>
                            <div className="font-bold text-[#1A1A1A] text-sm group-hover:text-[var(--primary)] transition-colors">{item.name}</div>
                            <div className="text-xs text-gray-400 font-medium">Standard option</div>
                          </div>
                        </div>
                        <span className="font-bold text-[#1A1A1A] text-sm">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {/* Bill Summary */}
                  <div className="bg-gray-50/50 p-6 space-y-3 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Subtotal</span>
                      <span className="font-bold text-gray-900">{formatCurrency(order.items.reduce((acc, i) => acc + i.price * i.quantity, 0))}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Delivery Fee</span>
                      <span className="font-bold text-gray-900">{formatCurrency(order.deliveryFee || 0)}</span>
                    </div>

                    {(order.discount > 0) && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 font-medium">Discount</span>
                          {order.voucherCode && (
                            <span className="text-[10px] font-bold bg-lime-100 text-[var(--primary)] px-1.5 py-0.5 rounded uppercase tracking-wide border border-lime-200">
                              {order.voucherCode}
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-[var(--primary)]">-{formatCurrency(order.discount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium">Payment Method</span>
                        {order.paymentMethod === 'vnpay' && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">VNPay</span>}
                        {order.paymentMethod === 'cash' && <span className="text-[10px] font-bold bg-lime-100 text-[var(--primary)] px-1.5 py-0.5 rounded uppercase">CASH</span>}
                        {order.paymentMethod === 'wallet' && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">WALLET</span>}
                        {!['vnpay', 'cash', 'wallet'].includes(order.paymentMethod) && <span className="text-[10px] font-bold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded uppercase">{order.paymentMethod}</span>}
                      </div>
                      <span className="font-bold text-gray-900 capitalize">{order.paymentMethod}</span>
                    </div>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 opacity-50" />

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1A1A1A] text-base">Total Amount</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                      <span className="font-anton text-3xl text-[var(--primary)] drop-shadow-sm">{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Profit Info */}
                <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <h4 className="font-bold text-[#1A1A1A]">Profit Information</h4>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Order Subtotal</span>
                      <span className="font-bold text-gray-900">{formatCurrency(order.netIncome + order.platformFee)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Platform Commission (15%)</span>
                      <span className="font-bold text-[var(--danger)]">-{formatCurrency(order.platformFee)}</span>
                    </div>

                    <div className="h-px bg-gray-100 my-2" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#1A1A1A] text-base">Net Income</span>
                      <span className="font-anton text-2xl text-[var(--primary)]">{formatCurrency(order.netIncome)}</span>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
