import { motion } from "@repo/ui/motion";
import { Package, Navigation, FileText, Store, Star, ChevronRight, Phone, ShieldCheck, CreditCard, Clock, Banknote } from "@repo/ui/icons";

export default function OrderDetailDrawerShimmer() {
  const shimmerVariants = {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 2,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  };

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f3f4f6 25%, rgba(255,255,255,0.8) 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
  };

  const darkShimmerStyle = {
    background: 'linear-gradient(90deg, #374151 25%, rgba(107,114,128,0.4) 50%, #374151 75%)',
    backgroundSize: '200% 100%',
  };

  const RestaurantCardShimmer = () => (
    <div className="bg-white rounded-[40px] shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100/50 overflow-hidden flex flex-col min-h-[160px] h-full relative">
      <div className="absolute inset-0 bg-gray-900 overflow-hidden">
        <motion.div className="w-full h-full" variants={shimmerVariants} initial="initial" animate="animate" style={darkShimmerStyle} />
      </div>
      <div className="relative z-10 flex flex-col h-full p-6 justify-between flex-1">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
            <Store className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm border border-white/20">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <motion.div className="h-4 w-6 bg-amber-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5">Cửa hàng</span>
          <motion.div className="h-8 w-3/4 bg-white/30 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 75%)', backgroundSize: '200% 100%' }} />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[10px] font-black text-white/80 uppercase tracking-widest border-b border-white/30 pb-0.5">Xem cửa hàng</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
              <ChevronRight className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DriverCardShimmer = () => (
    <div className="bg-white rounded-[40px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col justify-center min-h-[160px] h-full">
      <div className="flex items-stretch gap-0">
        <div className="w-[78%] flex flex-col items-center justify-center text-center">
          <div className="relative">
            <motion.div className="w-20 h-20 rounded-full bg-gray-100" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-pink-600 border-2 border-white flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-3 flex flex-col items-center">
            <motion.div className="h-4 w-12 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <div className="mt-2 w-9 h-9 rounded-full bg-lime-50 border border-lime-100 flex items-center justify-center text-lime-600">
              <Phone className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="w-[38%] flex flex-col justify-between py-1 pl-4 border-l border-gray-100/50">
          <div className="flex flex-col">
            <motion.div className="h-6 w-8 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Đánh giá</span>
          </div>
          <div className="h-px w-full bg-gray-50 my-1.5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <motion.div className="h-6 w-8 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
              <Star className="w-3 h-3 fill-gray-300 text-gray-300" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Xếp hạng</span>
          </div>
          <div className="h-px w-full bg-gray-50 my-1.5" />
          <div className="flex flex-col">
            <motion.div className="h-5 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
            <span className="text-[9px] text-gray-400 font-bold uppercase truncate">Phương tiện</span>
          </div>
        </div>
      </div>
    </div>
  );

  const OrderItemsListShimmer = () => (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-gray-400" />
          <h4 className="text-xl md:text-lg text-[#1A1A1A] font-bold">Chi tiết món ăn</h4>
        </div>
        <div className="px-3 py-1 bg-[#1A1A1A] text-white rounded-lg text-xs font-bold">
          <motion.div className="h-3 w-8 bg-white/20 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%)', backgroundSize: '200% 100%' }} />
        </div>
      </div>

      <div className="p-3">
        {[1, 2].map(i => (
          <div key={i} className="flex items-center justify-between p-3.5 md:p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-[14px] bg-gray-100 flex items-center justify-center font-anton text-gray-300 italic">
                <motion.div className="h-4 w-4 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              </div>
              <div className="space-y-1.5">
                <motion.div className="h-4 w-40 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
                <motion.div className="h-2.5 w-24 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              </div>
            </div>
            <motion.div className="h-4 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={{ background: 'linear-gradient(90deg, #e5e7eb 25%, rgba(255,255,255,0.8) 50%, #e5e7eb 75%)', backgroundSize: '200% 100%' }} />
          </div>
        ))}
      </div>

      <div className="bg-gray-50/50 p-6 md:p-8 space-y-4 border-t border-gray-100">
        <div className="space-y-3 font-medium text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Tạm tính</span>
            <motion.div className="h-4 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phí giao hàng</span>
            <motion.div className="h-4 w-16 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
          </div>
        </div>
        <div className="h-px bg-gray-200/50 my-2" />
        <div className="flex justify-between items-center pt-2">
          <span className="font-bold text-[#1A1A1A] text-base">Tổng thanh toán</span>
          <div className="flex flex-col items-end gap-2">
            <motion.div className="h-10 w-32 bg-[var(--primary)]/10 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            <div className="flex items-center gap-1 text-[10px] text-lime-600 font-bold uppercase tracking-widest bg-lime-50 px-2 py-0.5 rounded-md border border-lime-100 opacity-60">
              Đã thanh toán
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LogisticsInfoShimmer = () => (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 pt-6 pb-2 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
        <div className="flex items-center gap-2.5">
          <Navigation className="w-5 h-5 text-gray-400" />
          <h4 className="font-bold text-[#1A1A1A]">Lộ trình giao hàng</h4>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <div className="relative flex flex-col gap-1">
          <div className="flex items-start gap-5 pb-10 relative">
            <div className="absolute left-[15px] top-[32px] w-[2px] h-[calc(100%-12px)] border-l-2 border-dashed border-gray-200" />
            <div className="w-8 h-8 rounded-full bg-lime-50 border-2 border-white ring-1 ring-lime-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-lime-400" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-[10px] font-black text-lime-600 uppercase tracking-widest leading-none">Lấy hàng tại</span>
              <motion.div className="h-4 w-1/3 bg-gray-200 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
              <motion.div className="h-3 w-1/2 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-8 h-8 rounded-full bg-red-50 border-2 border-white ring-1 ring-red-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-red-400" />
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none">Giao hàng đến</span>
              <div className="font-bold text-[#1A1A1A] text-sm uppercase tracking-tight">Vị trí của bạn</div>
              <motion.div className="h-3 w-3/4 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PaymentSummaryShimmer = () => (
    <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 pt-6 pb-2 border-b border-gray-50 flex items-center gap-2.5 bg-gray-50/30">
        <FileText className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Thông tin thanh toán</h4>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 font-medium">Phương thức</span>
          </div>
          <motion.div className="h-6 w-16 bg-gray-50 rounded-lg border border-gray-100" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-300" />
            <span className="text-gray-500 font-medium">Đặt lúc</span>
          </div>
          <motion.div className="h-4 w-24 bg-gray-100 rounded" variants={shimmerVariants} initial="initial" animate="animate" style={shimmerStyle} />
        </div>
        <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Banknote className="w-4 h-4 text-gray-300" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
            Trạng thái
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[#F8F9FA]">
      <div className="hidden md:grid md:grid-cols-[62%_38%] h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-16 md:pr-5 min-h-0">
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <RestaurantCardShimmer />
            <DriverCardShimmer />
          </div>
          <OrderItemsListShimmer />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 p-5 md:py-6 md:pl-6 md:pr-16 bg-[#F8F9FA] min-h-0">
          <LogisticsInfoShimmer />
          <PaymentSummaryShimmer />
        </div>
      </div>

      <div className="md:hidden flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-3 bg-[#F8F9FA]">
        <div className="snap-center shrink-0 w-full flex items-center justify-center py-4">
          <div className="w-full">
            <RestaurantCardShimmer />
          </div>
        </div>
        <OrderItemsListShimmer />
        <LogisticsInfoShimmer />
        <PaymentSummaryShimmer />
      </div>
    </div>
  );
}
