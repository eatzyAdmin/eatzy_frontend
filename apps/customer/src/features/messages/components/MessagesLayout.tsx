'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  ArrowLeft, Search, Filter, X, LayoutGrid, Truck, BellRing,
  MessageSquare, User, Info, Compass, RotateCcw
} from '@repo/ui/icons';
import { mockSystemChats, mockDriverChats, ChatSession } from '../data/mockMessages';
import MessageList from './MessageList';
import MessageDetail from './MessageDetail';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useBottomNav } from '@/features/navigation/context/BottomNavContext';
import { EmptyState } from '@/components/ui/EmptyState';
import MobileMessagesView from './mobile/MobileMessagesView';
import { useMobileBackHandler } from '@/hooks/useMobileBackHandler';
import { useCurrentOrders } from '@/features/orders/hooks/useCurrentOrders';

const statusFilters = [
  { value: "ALL", label: "All", icon: LayoutGrid },
  { value: "driver", label: "Drivers", icon: Truck },
  { value: "system", label: "System", icon: BellRing },
];

export default function MessagesLayout() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ALL' | 'driver' | 'system'>('ALL');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();
  const { setIsVisible } = useBottomNav();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refresh } = useCurrentOrders();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Hide bottom nav when on the messages page
    setIsVisible(false);
    return () => setIsVisible(true);
  }, [setIsVisible]);

  const allChats = [...mockDriverChats, ...mockSystemChats];
  const isEmpty = allChats.length === 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh orders cache via hook
    await refresh();
    
    // Simulate refresh for mock messages
    setTimeout(() => {
      router.refresh();
      setIsRefreshing(false);
    }, 1000);
  };

  const filteredChats = allChats.filter(chat => {
    const matchesTab = activeTab === 'ALL' || chat.type === activeTab;
    const matchesSearch = chat.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const isSearchEmpty = searchQuery.length > 0 && filteredChats.length === 0;

  const activeChat = allChats.find(c => c.id === activeChatId) || null;

  const handleBack = () => {
    setActiveChatId(null);
  };

  // Use the standard mobile back handler
  useMobileBackHandler(!!activeChatId && isMobile, () => setActiveChatId(null));

  const handleClearSearch = () => {
    setSearchQuery("");
  };


  if (!isMounted) {
    return <div className="h-screen bg-[#F7F7F7]" />;
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7] overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">

        {/* DESKTOP FIXED TOOLBAR */}
        {!isMobile && (
          <div className="fixed top-0 left-0 right-0 z-[51] h-[88px] flex items-center justify-center gap-8 px-8 pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="flex items-center gap-2">
                {statusFilters.map((filter) => (
                  <motion.button
                    key={filter.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setActiveTab(filter.value as any);
                      setActiveChatId(null);
                    }}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === filter.value
                      ? filter.value === "ALL"
                        ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/10"
                        : "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
                      : "bg-gray-200/40 text-gray-600 hover:text-[var(--primary)]"
                      }`}
                  >
                    <filter.icon className={`w-4 h-4 ${activeTab === filter.value ? "text-white" : "text-gray-500"}`} strokeWidth={2.4} />
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative w-80 pointer-events-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-2 border-white focus:border-[var(--primary)]/20 rounded-[22px] py-3 pl-14 pr-12 text-md font-bold font-anton text-gray-900 placeholder:text-gray-300 outline-none focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/5 transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.05)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gray-200/50 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* MOBILE VIEW DASHBOARD */}
        {isMobile && (
          <MobileMessagesView
            onBack={() => router.back()}
            onRefresh={handleRefresh}
            statusFilters={statusFilters}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            filteredChats={filteredChats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
          />
        )}

        {/* MOBILE DETAIL OVERLAY - Fixed Transition */}
        {isMobile && (
          <AnimatePresence mode="wait">
            {activeChat && (
              <motion.div
                key={activeChat.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="fixed inset-0 z-50 bg-white"
              >
                <MessageDetail
                  chat={activeChat}
                  onBack={handleBack}
                  isMobile={isMobile}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* DESKTOP VIEW */}
        {!isMobile && (
          <div className="max-w-[1400px] w-full mx-auto h-full flex flex-col pt-24 px-8">
            <div className="flex-1 flex min-h-0 gap-8 pb-4">
              {filteredChats.length === 0 ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  {isSearchEmpty ? (
                    <EmptyState
                      icon={Search}
                      title="No results found"
                      description={`We couldn't find any messages matching "${searchQuery}".`}
                      buttonText="Clear Search"
                      buttonIcon={X}
                      onButtonClick={handleClearSearch}
                      className="py-12"
                    />
                  ) : (
                    <EmptyState
                      icon={MessageSquare}
                      title={activeTab === 'ALL' ? "No messages yet" : `No ${activeTab} messages`}
                      description={activeTab === 'ALL'
                        ? "Your inbox is empty. When you receive or send messages, they will appear here."
                        : `You don't have any messages in the ${activeTab} category.`
                      }
                      buttonText={isRefreshing ? "Refreshing..." : "Refresh Inbox"}
                      buttonIcon={RotateCcw}
                      onButtonClick={handleRefresh}
                      className="py-20"
                    />
                  )}
                </div>
              ) : (
                <>
                  {/* List column */}
                  <div className="flex-shrink-0 w-[380px] h-full">
                    <div className="h-full overflow-hidden flex flex-col">
                      <MessageList
                        chats={filteredChats}
                        activeChatId={activeChatId}
                        onSelectChat={setActiveChatId}
                      />
                    </div>
                  </div>

                  {/* Detail column */}
                  <div className="flex-1 bg-white rounded-[44px] shadow-[0_0_30px_rgba(0,0,0,0.18)] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {activeChat ? (
                        <motion.div
                          key={activeChat.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 z-50 bg-white"
                        >
                          <MessageDetail
                            chat={activeChat}
                            onBack={handleBack}
                            isMobile={isMobile}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty-detail"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center p-8 text-center"
                        >
                          <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                            <MessageSquare className="w-10 h-10 text-gray-300" />
                          </div>
                          <h2 className="text-xl font-anton font-bold text-gray-800 uppercase tracking-tight">Select a conversation</h2>
                          <p className="text-gray-400 mt-2 max-w-xs font-medium">Choose a contact from the list on the left to start messaging.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
