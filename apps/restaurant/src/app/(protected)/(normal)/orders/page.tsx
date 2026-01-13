'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from '@repo/ui/motion';
import { useLoading, OrderCardShimmer, useSwipeConfirmation, useNotification } from '@repo/ui';
import { ClipboardList, ChefHat, Bike, Power } from '@repo/ui/icons';
import type { Order } from '@repo/types';
import { mockRestaurantOrders } from '@/data/mockOrders';
import OrderCard from '@/components/OrderCard';
import OrderDrawer from '@/components/OrderDrawer';
import '@repo/ui/styles/scrollbar.css';

import { useAuth } from '@/features/auth/hooks/useAuth';

export default function OrdersPage() {
  const { user } = useAuth();
  const { confirm } = useSwipeConfirmation();
  const { showNotification } = useNotification();
  const { hide } = useLoading();
  const [isAppActive, setIsAppActive] = useState(true);
  const [orders, setOrders] = useState<Order[]>(mockRestaurantOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  const handleToggleApp = () => {
    // ... same content
    const newStatus = !isAppActive;
    confirm({
      title: newStatus ? 'Bật ứng dụng' : 'Tắt ứng dụng',
      description: newStatus
        ? 'Bật ứng dụng để nhận đơn hàng mới từ khách hàng.'
        : 'Tắt ứng dụng sẽ ngừng nhận đơn hàng mới. Bạn có chắc chắn?',
      confirmText: newStatus ? 'Bật' : 'Tắt',
      onConfirm: () => {
        setIsAppActive(newStatus);

        // Show notification after successful toggle
        showNotification({
          message: newStatus
            ? 'Mở nhà hàng thành công!'
            : 'Nhà hàng đã tạm đóng cửa.',
          type: 'success', // Both on/off are successful operations
          format: newStatus
            ? 'Nhà hàng đang mở và sẵn sàng nhận đơn hàng mới!'
            : 'Nhà hàng đã tạm đóng cửa. Bạn sẽ không nhận được đơn hàng mới.',
          autoHideDuration: 3000
        });
      }
    });
  };

  const pendingOrders = orders.filter(o => o.status === 'PLACED');
  const inProgressOrders = orders.filter(o => o.status === 'PREPARED');
  const waitingForDriverOrders = orders.filter(o => o.status === 'PICKED');

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    // Don't clear selectedOrder immediately, let AnimatePresence handle exit
    setTimeout(() => setSelectedOrder(null), 300);
  };

  const handleConfirmOrder = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: 'PREPARED' as const }
        : order
    ));
    handleCloseDrawer();

    // Show loading shimmer for 1s after action
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRejectOrder = (orderId: string, reason: string) => {
    console.log(`Rejected order ${orderId} with reason: ${reason}`);
    setOrders(prev => prev.filter(order => order.id !== orderId));
    handleCloseDrawer();

    // Show loading shimmer for 1s after action
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId
        ? { ...order, status: 'PICKED' as const }
        : order
    ));
    handleCloseDrawer();

    // Show loading shimmer for 1s after action
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (

    <>
      <div className="flex flex-col h-full">
        {/* Header moved from Layout to Orders Page */}
        <div className="border-b border-gray-200 px-8 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-anton font-bold text-[#1A1A1A]">
              {user?.name?.toUpperCase() || "NHÀ HÀNG ABC"}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleApp}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${isAppActive
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-gray-200 text-gray-600'
                }`}
            >
              <Power className="w-5 h-5" />
              <span>{isAppActive ? 'Đang mở' : 'Đã đóng'}</span>
            </motion.button>
          </div>
        </div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-3 gap-8 px-8 py-6 flex-1 overflow-hidden">
          {/* Column 1: Pending Confirmation */}
          <div className="flex flex-col h-full min-h-0">
            <div className="mb-4 flex items-center justify-center gap-3 flex-shrink-0">
              <h3 className="text-lg font-anton font-bold text-[#1A1A1A]">
                CHỜ XÁC NHẬN
              </h3>
              <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{pendingOrders.length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-0 px-3">
              {isLoading ? (
                <OrderCardShimmer cardCount={2} />
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {pendingOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => handleOpenOrder(order)}
                      />
                    ))}
                  </AnimatePresence>
                  {pendingOrders.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ClipboardList className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <div className="text-sm">Không có đơn hàng mới</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="flex flex-col h-full min-h-0">
            <div className="mb-4 flex items-center justify-center gap-3 flex-shrink-0">
              <h3 className="text-lg font-anton font-bold text-[#1A1A1A]">
                ĐANG CHUẨN BỊ
              </h3>
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{isLoading ? '-' : inProgressOrders.length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-0 px-2">
              {isLoading ? (
                <OrderCardShimmer cardCount={2} />
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {inProgressOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => handleOpenOrder(order)}
                      />
                    ))}
                  </AnimatePresence>
                  {inProgressOrders.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <ChefHat className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <div className="text-sm">Không có đơn đang chuẩn bị</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Column 3: Waiting for Driver */}
          <div className="flex flex-col h-full min-h-0">
            <div className="mb-4 flex items-center justify-center gap-3 flex-shrink-0">
              <h3 className="text-lg font-anton font-bold text-[#1A1A1A]">
                CHỜ TÀI XẾ
              </h3>
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{isLoading ? '-' : waitingForDriverOrders.length}</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar min-h-0 pl-3">
              {isLoading ? (
                <OrderCardShimmer cardCount={2} />
              ) : (
                <>
                  <AnimatePresence mode="popLayout">
                    {waitingForDriverOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onClick={() => handleOpenOrder(order)}
                      />
                    ))}
                  </AnimatePresence>
                  {waitingForDriverOrders.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Bike className="w-16 h-16 mx-auto mb-2 opacity-30" />
                        <div className="text-sm">Chưa có đơn chờ tài xế</div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Drawer with AnimatePresence */}
      <OrderDrawer
        open={drawerOpen}
        order={selectedOrder}
        onClose={handleCloseDrawer}
        onConfirm={handleConfirmOrder}
        onReject={handleRejectOrder}
        onComplete={handleCompleteOrder}
      />
    </>
  );
}
