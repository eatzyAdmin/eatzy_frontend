"use client";

import { sileo } from "@/components/DynamicIslandToast";
import { motion } from "@repo/ui/motion";
import { Heart, Store, Bike, AlertCircle, Trash2, ArrowLeft, Zap, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TestNotificationPage() {
  const router = useRouter();

  const testCases = [
    {
      group: "Yêu thích (Favorites)",
      items: [
        {
          label: "Thêm Yêu thích",
          icon: <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />,
          onClick: () => sileo.success({
            title: "Cơm Mẹ Nấu B3",
            description: "ĐÃ THÊM VÀO YÊU THÍCH",
            actionType: "favorite_add"
          } as any)
        },
        {
          label: "Xóa Yêu thích",
          icon: <Trash2 className="w-4 h-4" />,
          onClick: () => sileo.success({
            title: "Cơm Mẹ Nấu B3",
            description: "ĐÃ XÓA KHỎI YÊU THÍCH",
            actionType: "favorite_remove"
          } as any)
        },
        {
          label: "Lỗi Hệ thống",
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          onClick: () => sileo.error({
            title: "Opps, đã có lỗi xảy ra!",
            description: "Không thể kết nối máy chủ",
            actionType: "favorite_error"
          } as any)
        },
        {
          label: "Lỗi Hệ thống (Dài)",
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          onClick: () => sileo.error({
            title: "Opps, đã có lỗi xảy ra!",
            description: "Hệ thống đang gặp sự cố kỹ thuật nghiêm trọng. Vui lòng thử lại sau giây lát hoặc liên hệ CSKH để được hỗ trợ.",
            actionType: "favorite_error"
          } as any)
        }
      ]
    },
    {
      group: "Đơn hàng (Orders)",
      items: [
        {
          label: "Hủy đơn hàng",
          icon: <Trash2 className="w-4 h-4 text-primary" />,
          onClick: () => sileo.success({
            title: "Đơn hàng tại Cơm Mẹ Nấu đã được hủy",
            description: "Hủy đơn hàng #12345",
            actionType: "order_cancel"
          } as any)
        },
        {
          label: "Đặt đơn hàng (Promise)",
          icon: <Zap className="w-4 h-4 text-primary" />,
          onClick: () => {
            const promise = new Promise((resolve) => setTimeout(() => resolve({ id: "8888" }), 2000));
            sileo.promise(promise, {
              loading: {
                title: "Đang xử lý...",
                description: "Vui lòng đợi trong giây lát",
                actionType: "order_place"
              } as any,
              success: (data: any) => ({
                title: "The Coffee House (Quận 1)",
                description: `Mã đơn hàng: #ORD-${data.id}`,
                actionType: "order_place",
                avatarUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&h=100&fit=crop",
                onViewOrder: () => alert("Mở CurrentOrdersDrawer...")
              } as any),
              error: () => ({
                title: "Lỗi đặt đơn",
                description: "Không thể kết nối máy chủ",
              } as any)
            });
          }
        }
      ]
    },
    {
      group: "Đánh giá (Reviews)",
      items: [
        {
          label: "Đánh giá Quán thành công",
          icon: <Store className="w-4 h-4" />,
          onClick: () => sileo.success({
            title: "Đánh giá nhà hàng thành công",
            description: "Review đã được ghi nhận. Cảm ơn bạn nhé!",
            actionType: "review_restaurant_success"
          } as any)
        },
        {
          label: "Đánh giá Quán (Có Avatar)",
          icon: <Store className="w-4 h-4 text-primary" />,
          onClick: () => sileo.success({
            title: "Đánh giá nhà hàng thành công",
            description: "Review đã được ghi nhận. Cảm ơn bạn nhé!",
            actionType: "review_restaurant_success",
            avatarUrl: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100&h=100&fit=crop"
          } as any)
        },
        {
          label: "Đánh giá Tài xế thành công",
          icon: <Bike className="w-4 h-4" />,
          onClick: () => sileo.success({
            title: "Đánh giá tài xế thành công",
            description: "Review đã được ghi nhận. Cảm ơn bạn nhé!",
            actionType: "review_driver_success"
          } as any)
        },
        {
          label: "Đánh giá Tài xế (Có Avatar)",
          icon: <Bike className="w-4 h-4 text-primary" />,
          onClick: () => sileo.success({
            title: "Đánh giá tài xế thành công",
            description: "Review đã được ghi nhận. Cảm ơn bạn nhé!",
            actionType: "review_driver_success",
            avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
          } as any)
        },
        {
          label: "Thông tin còn thiếu",
          icon: <AlertCircle className="w-4 h-4" />,
          onClick: () => sileo.warning({
            title: "Vui lòng chọn sao & nhận xét",
            actionType: "review_validation"
          } as any)
        }
      ]
    },
    {
      group: "Giỏ hàng (Cart)",
      items: [
        {
          label: "Thêm vào giỏ hàng",
          icon: <ShoppingBag className="w-4 h-4" />,
          onClick: () => sileo.success({
            description: "Pizza Seafood Special",
            actionType: "cart_add",
            avatarUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=500&fit=crop",
            dishOptions: ["Size L", "Đế dày", "Thêm phô mai"]
          } as any)
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 p-12 font-sans selection:bg-primary/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-6 mb-16">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center transition-colors shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </motion.button>
          <div>
            <h1 className="text-4xl font-anton uppercase tracking-widest leading-none mb-2 text-slate-900">
              Notification <span className="text-primary italic">Lab</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              Eatzy Premium Design System
            </p>
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid gap-14 text-slate-900">
          {testCases.map((group, gIdx) => (group.group && (
            <div key={gIdx} className="space-y-6">
              <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] pl-1 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-slate-100" />
                {group.group}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map((item, iIdx) => (
                  <motion.button
                    key={iIdx}
                    whileHover={{ scale: 1.02, x: 8, backgroundColor: "rgba(0,0,0,0.02)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={item.onClick}
                    className="flex items-center justify-between bg-slate-50 border border-slate-100 p-6 rounded-[32px] text-left transition-all group relative overflow-hidden shadow-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative font-bold text-lg tracking-tight text-slate-800">
                      {item.label}
                    </span>
                    <div className="relative w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-all shadow-sm">
                      <div className="text-slate-300 group-hover:text-primary transition-colors">
                        {(item as any).icon || <Zap className="w-4 h-4" />}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )))}
        </div>

        {/* Footer info */}
        <div className="mt-24 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-300 text-[9px] font-black uppercase tracking-[0.6em]">
            Eatzy • Ultra Premium Island Feedback
          </p>
        </div>
      </div>
    </div>
  );
}
