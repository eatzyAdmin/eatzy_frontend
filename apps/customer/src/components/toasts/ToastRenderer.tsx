"use client";

import { motion } from "@repo/ui/motion";
import { Heart, HeartOff, AlertCircle, Store, Bike, ChevronRight, Trash2 } from "lucide-react";
import { SileoOptions } from "sileo";

export type ToastActionType =
  | "favorite_add"
  | "favorite_remove"
  | "favorite_error"
  | "review_validation"
  | "review_restaurant_success"
  | "review_restaurant_error"
  | "review_driver_success"
  | "review_driver_error"
  | "order_cancel"
  | "order_place"
  | "cart_add";

export interface ExtendedToastOptions extends SileoOptions {
  actionType?: ToastActionType;
  avatarUrl?: string;
  onViewOrder?: () => void;
  dishOptions?: string[];
}

export function renderCustomDescription(opts: ExtendedToastOptions) {
  if (!opts.actionType) return null;

  switch (opts.actionType) {
    case "favorite_add":
      return (
        <div className="flex items-center justify-between w-full py-1">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-rose-500/20 opacity-20 blur-xl rounded-full" />
              <div className="relative w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-6 h-6 text-black fill-black" />
              </div>
            </motion.div>

            <div className="flex flex-col text-left">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white font-anton font-bold text-[17px] leading-tight uppercase tracking-wide"
              >
                {String(opts.description)}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white text-[12px]"
              >
                {opts.title}
              </motion.span>
            </div>
          </div>
        </div>
      );

    case "favorite_remove":
      return (
        <div className="flex items-center justify-between w-full py-1">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"
            >
              <HeartOff className="w-5 h-5 text-white/40" />
            </motion.div>

            <div className="flex flex-col text-left">
              <span className="text-white/90 font-anton font-bold text-[17px] leading-tight uppercase tracking-wide">
                {String(opts.description)}
              </span>
              <span className="text-white/40 text-[12px]">
                {opts.title}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-40">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      );

    case "review_validation":
      return (
        <div className="flex items-center gap-4 py-1">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.5, repeat: 1 }}
            className="w-10 h-10 bg-warning/20 rounded-2xl flex items-center justify-center border border-warning/30"
          >
            <AlertCircle className="w-6 h-6 text-warning" />
          </motion.div>
          <div className="flex flex-col flex-1 text-left">
            <span className="font-bold text-[15px] leading-tight text-warning">
              Thông tin còn thiếu
            </span>
            <span className="text-white/40 text-[12px] line-clamp-1">
              {String(opts.title)}
            </span>
          </div>
        </div>
      );

    case "favorite_error":
    case "review_restaurant_error":
    case "review_driver_error":
      return (
        <div className="flex items-start gap-4 py-1 pr-6">
          <motion.div
            animate={{ x: [-4, 4, -4, 4, 0] }}
            transition={{ duration: 0.4 }}
            className="w-10 h-10 bg-danger/20 rounded-2xl flex items-center justify-center border border-danger/30 shrink-0"
          >
            <AlertCircle className="w-6 h-6 text-danger" />
          </motion.div>
          <div className="flex flex-col flex-1 text-left">
            <span className="font-bold text-[15px] leading-tight text-danger mb-0.5">
              Thao tác ko thành công
            </span>
            <span className="text-white/40 text-[12px] leading-snug">
              {String(opts.description || opts.title)}
            </span>
          </div>
        </div>
      );

    case "order_place":
      return (
        <div className="flex flex-col w-full py-2 pr-6 gap-5">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-[22px] overflow-hidden border-2 border-white/50 shrink-0"
            >
              <img
                src={opts.avatarUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop"}
                className="w-full h-full object-cover"
                alt="Restaurant"
              />
            </motion.div>

            <div className="flex-1 min-w-0">
              <h4 className="text-white font-anton font-bold text-[19px] leading-tight truncate uppercase">
                {opts.title || "Pizza 4P's"}
              </h4>
              <p className="text-white/60 text-[13px] mt-1 font-medium">
                Đang tìm tài xế phù hợp...
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                opts.onViewOrder?.();
                // Tự động clear toast khi nhấn nút
                const clearBadge = document.querySelector('[data-sileo-clear]');
                if (clearBadge) (clearBadge as HTMLElement).click();
              }}
              className="w-full py-3 rounded-2xl bg-white/10 border border-white/5 text-white font-bold text-sm transition-all hover:bg-white/20"
            >
              Xem đơn hàng
            </motion.button>
          </div>
        </div>
      );

    case "order_cancel":
      return (
        <div className="flex items-center justify-between w-full py-1 pr-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [-2, 2, -2, 2, 0] }}
              transition={{
                scale: { type: "spring", stiffness: 400, damping: 20 },
                animate: { duration: 0.4 }
              }}
              className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30"
            >
              <Trash2 className="w-5 h-5 text-primary" />
            </motion.div>

            <div className="flex flex-col text-left">
              <span className="text-white font-semibold text-[15px] leading-tight">
                {String(opts.description || "Hủy đơn hàng")}
              </span>
              <span className="text-white/40 text-[12px]">
                {opts.title || "Đơn hàng đã được hủy"}
              </span>
            </div>
          </div>
        </div>
      );

    case "cart_add":
      return (
        <div className="flex items-center gap-3 py-1 pr-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-12 h-12 shrink-0"
          >
            <img
              src={opts.avatarUrl || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2670&auto=format&fit=crop"}
              alt="Dish"
              className="w-full h-full object-cover rounded-2xl border-2 border-white"
            />
          </motion.div>

          <div className="flex flex-col flex-1 min-w-0">
            <h4 className="text-white font-anton font-bold text-[17px] leading-tight uppercase whitespace-normal">
              {opts.description || "Pizza Margherita"}
            </h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {opts.dishOptions && opts.dishOptions.length > 0 ? (
                <span className="text-white/50 text-[11px] font-medium italic whitespace-normal pr-2">
                  {opts.dishOptions.join(", ")}
                </span>
              ) : (
                <span className="text-white/40 text-[10px] font-medium">Đã sẵn sàng để thưởng thức!</span>
              )}
            </div>
          </div>
        </div>
      );

    case "review_restaurant_success":
    case "review_driver_success":
      const isRestaurant = opts.actionType === "review_restaurant_success";
      return (
        <div className="flex items-center gap-4 py-1">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/20 opacity-20 blur-xl rounded-full" />
            {opts.avatarUrl ? (
              <img
                src={opts.avatarUrl}
                alt="Avatar"
                className="relative w-full h-full object-cover rounded-2xl border-2 border-white"
              />
            ) : isRestaurant ? (
              <Store className="relative w-5 h-5 text-black fill-black" />
            ) : (
              <Bike className="relative w-5 h-5 text-black fill-black" />
            )}
          </motion.div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-white font-semibold text-[15px] leading-tight">
                {opts.title}
              </span>
            </div>
            <span className="text-white/40 text-[12px] line-clamp-1">
              {String(opts.description)}
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
