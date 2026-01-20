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
      <div className="flex flex-col h-full bg-[#F8F9FA]">
        {/* Header - Premium Design */}
        <div className="px-8 pt-5 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardList size={12} />
                  Live Orders
                </span>
              </div>
              <h1 className="text-4xl font-anton text-gray-900 uppercase tracking-tight">
                {user?.name?.toUpperCase() || "RESTAURANT"}
              </h1>
              <p className="text-gray-500 font-medium mt-1">Manage incoming orders and kitchen workflow.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleApp}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 ${isAppActive
                ? 'bg-primary text-white shadow-xl shadow-primary/30'
                : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                }`}
            >
              <Power className="w-5 h-5" />
              <span>{isAppActive ? 'Open' : 'Closed'}</span>
            </motion.button>
          </div>
        </div>

        {/* 3 Column Layout */}
        <div className="grid grid-cols-3 gap-0 px-6 py-6 flex-1 min-h-0">
          {/* Column 1: Pending Confirmation */}
          <div className="flex flex-col h-full min-h-0 px-3">
            <div className="mb-5 flex items-center justify-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl border-2 border-yellow-200 shadow-sm">
                <h3 className="text-base font-anton font-black text-[#1A1A1A]">
                  PENDING
                </h3>
                <div className="w-7 h-7 rounded-xl bg-yellow-500 flex items-center justify-center shadow-md shadow-yellow-500/30">
                  <span className="text-xs font-bold text-white">{pendingOrders.length}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 py-2 px-1">
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
                        <div className="text-center text-gray-400 mt-36">
                          <ClipboardList className="w-16 h-16 mx-auto mb-2 opacity-30" />
                          <div className="text-sm">Không có đơn hàng mới</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: In Progress */}
          <div className="flex flex-col h-full min-h-0 px-3">
            <div className="mb-5 flex items-center justify-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl border-2 border-blue-200 shadow-sm">
                <h3 className="text-base font-anton font-bold text-[#1A1A1A]">
                  IN PROGRESS
                </h3>
                <div className="w-7 h-7 rounded-xl bg-blue-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                  <span className="text-xs font-bold text-white">{isLoading ? '-' : inProgressOrders.length}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 py-2 px-1">
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
                        <div className="text-center text-gray-400 mt-36">
                          <ChefHat className="w-16 h-16 mx-auto mb-2 opacity-30" />
                          <div className="text-sm">Không có đơn đang chuẩn bị</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Waiting for Driver */}
          <div className="flex flex-col h-full min-h-0 px-3">
            <div className="mb-5 flex items-center justify-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl border-2 border-lime-200 shadow-sm">
                <h3 className="text-base font-anton font-bold text-[#1A1A1A]">
                  WAITING FOR DRIVER
                </h3>
                <div className="w-7 h-7 rounded-xl bg-lime-500 flex items-center justify-center shadow-md shadow-lime-500/30">
                  <span className="text-xs font-bold text-white">{isLoading ? '-' : waitingForDriverOrders.length}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
              <div className="space-y-4 py-2 px-1">
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
                        <div className="text-center text-gray-400 mt-36">
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
