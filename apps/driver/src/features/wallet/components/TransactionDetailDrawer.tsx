"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { DriverWalletTransaction } from "@repo/types";
import { useOrderDetail } from "@/features/history/hooks/useOrderDetail";
import TransactionInfoView from "./TransactionInfoView";
import LinkedOrderView from "./LinkedOrderView";

export default function TransactionDetailDrawer({
  transaction,
  open,
  onClose,
}: {
  transaction: DriverWalletTransaction | null;
  open: boolean;
  onClose: () => void;
}) {
  const [view, setView] = useState<'info' | 'order'>('info');
  const { order, isLoading, fetchOrder, clearOrder } = useOrderDetail();

  // Reset view and clear order when drawer closes or transaction changes
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setView('info');
        clearOrder();
      }, 300); // Wait for exit animation
      return () => clearTimeout(timer);
    }
  }, [open, clearOrder]);

  const handleViewOrder = (orderId: number) => {
    setView('order');
    fetchOrder(orderId);
  };

  const handleBackToInfo = () => {
    setView('info');
  };

  if (!transaction && !open) return null;

  return (
    <AnimatePresence>
      {open && transaction && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[40px] overflow-hidden h-[92vh] max-h-[92vh] flex flex-col shadow-2xl"
          >
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {view === 'info' ? (
                  <motion.div
                    key="info"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <TransactionInfoView
                      transaction={transaction}
                      onClose={onClose}
                      onViewOrder={handleViewOrder}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="order"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0"
                  >
                    <LinkedOrderView
                      order={order}
                      isLoading={isLoading}
                      onBack={handleBackToInfo}
                      onClose={onClose}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
