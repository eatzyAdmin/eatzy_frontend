"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useCurrentOrders } from "@/features/orders/hooks/useCurrentOrders";
import { useSwipeConfirmation, useLoading } from "@repo/ui";
import { sileo } from "@/components/DynamicIslandToast";
import { orderApi } from "@repo/api";
import { useMobileBackHandler } from "@/hooks/useMobileBackHandler";

import { DesktopView, MobileView } from "./current-orders-drawer/index";

export default function CurrentOrdersDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { orders, isLoading: isLoadingOrders, refetch } = useCurrentOrders({ isDrawerOpen: open });
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"LIST" | "DETAIL">("LIST");
  const activeOrder = orders.find((o) => o.id === activeOrderId) ?? orders[0] ?? null;
  const { confirm } = useSwipeConfirmation();
  const { hide: hideLoading } = useLoading();

  // Navigation handlers - Consolidate into one to prevent double-firing and race conditions
  useMobileBackHandler(open, () => {
    // Only handle mobile back if we're on mobile and in DETAIL view
    if (window.innerWidth < 768 && mobileView === "DETAIL") {
      setMobileView("LIST");
    } else {
      // Otherwise, close the drawer
      onClose();
    }
  });

  useEffect(() => {
    if (orders.length > 0 && !activeOrderId) {
      setActiveOrderId(orders[0].id);
    }
  }, [orders, activeOrderId]);

  useEffect(() => {
    if (orders.length > 0 && activeOrderId && !orders.find(o => o.id === activeOrderId)) {
      setActiveOrderId(orders[0].id);
    }
  }, [orders, activeOrderId]);

  const [isMapVisible, setIsMapVisible] = useState(false);

  useEffect(() => {
    if (open) {
      refetch();
      setMobileView("LIST"); // Only reset to LIST when EXACTLY opening the drawer
    } else {
      // Khi đóng drawer, sau 2s reset lại về LIST để lần sau mở lên luôn ở trang danh sách
      const timer = setTimeout(() => {
        setMobileView("LIST");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [open]); // Removed refetch from dependencies

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setIsMapVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      setIsMapVisible(false);
    }
  }, [open]);

  const [showCancelReasons, setShowCancelReasons] = useState(false);
  const cancellationReasons = [
    "Đổi ý, không muốn mua nữa",
    "Đặt nhầm món/số lượng",
    "Thời gian giao hàng quá lâu",
    "Giá cao hơn dự kiến",
    "Lý do khác",
  ];
  const detailsContainerRef = useRef<HTMLDivElement>(null);

  const handleCancelOrder = () => {
    if (!activeOrder) return;
    setShowCancelReasons(true);
    setTimeout(() => {
      detailsContainerRef.current?.scrollTo({
        top: detailsContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }, 100);
  };

  const handleConfirmCancel = (reason: string) => {
    confirm({
      title: "Xác nhận hủy đơn",
      description: `Lý do: ${reason}. Vuốt để xác nhận hủy đơn hàng #${activeOrder?.id}`,
      confirmText: "Xác nhận hủy",
      type: "danger",
      processingDuration: 1500,
      onConfirm: async () => {
        if (!activeOrder) return;
        try {
          await orderApi.cancelOrder(activeOrder.id, reason);
          hideLoading();
          sileo.success({
            title: `Đơn hàng tại ${activeOrder.restaurant?.name} đã được hủy`,
            description: `Hủy đơn hàng #${activeOrder.id}`,
            actionType: "order_cancel",
          } as any);
          setShowCancelReasons(false);
          refetch();
          if (orders.length <= 1) {
            setTimeout(() => onClose(), 500);
          } else {
            setMobileView("LIST");
          }
        } catch (error) {
          sileo.error({ title: "Lỗi", description: "Không thể hủy đơn hàng" });
        }
      }
    });
  };

  const handleOrderClick = (id: number) => {
    setActiveOrderId(id);
    setMobileView("DETAIL");
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="orders-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {open && (
          <motion.div
            key="orders-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
            className="fixed z-[70] inset-0 md:inset-x-0 md:bottom-0 md:top-auto md:max-h-[88vh] md:rounded-t-[40px] bg-[#F8F9FA] overflow-hidden shadow-2xl flex flex-col border border-white/20 [overscroll-behavior:contain]"
          >
            <MobileView
              orders={orders}
              activeOrder={activeOrder}
              mobileView={mobileView}
              setMobileView={setMobileView}
              handleOrderClick={handleOrderClick}
              isLoadingOrders={isLoadingOrders}
              onClose={onClose}
              showCancelReasons={showCancelReasons}
              setShowCancelReasons={setShowCancelReasons}
              handleCancelOrder={handleCancelOrder}
              handleConfirmCancel={handleConfirmCancel}
              cancellationReasons={cancellationReasons}
            />
            <DesktopView
              orders={orders}
              activeOrder={activeOrder}
              activeOrderId={activeOrderId}
              setActiveOrderId={setActiveOrderId}
              isMapVisible={isMapVisible}
              onClose={onClose}
              showCancelReasons={showCancelReasons}
              setShowCancelReasons={setShowCancelReasons}
              handleCancelOrder={handleCancelOrder}
              handleConfirmCancel={handleConfirmCancel}
              cancellationReasons={cancellationReasons}
              detailsContainerRef={detailsContainerRef}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
