"use client";

import { motion } from "@repo/ui/motion";
import MessagesMobileHeader from "./MessagesMobileHeader";
import RecentOrdersList from "./RecentOrdersList";
import ChatListContainer from "./ChatListContainer";
import MessageList from "../MessageList";
import { ChatSession } from "../../data/mockMessages";
import { useState, useEffect } from "react";
import { MessageItemShimmer, PullToRefresh } from "@repo/ui";

interface MobileMessagesViewProps {
  onBack: () => void;
  onRefresh: () => Promise<void>;
  statusFilters: any[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
  filteredChats: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

/**
 * MobileMessagesView Component
 * The main assembly for the mobile messages UI.
 * Features a darker background, recent orders, and a rounded list container.
 */
export default function MobileMessagesView({
  onBack,
  onRefresh,
  statusFilters,
  activeTab,
  setActiveTab,
  filteredChats,
  activeChatId,
  setActiveChatId,
}: MobileMessagesViewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading on initial mount and when switching tabs
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="flex-1 flex flex-col bg-[#F7F7F7] relative overflow-hidden h-screen">
      <PullToRefresh onRefresh={onRefresh} className="flex-1 overflow-y-auto no-scrollbar relative">
        {/* 1. Header Area */}
        <MessagesMobileHeader onBack={onBack} />
        
        {/* 2. Recent Orders Section */}
        <RecentOrdersList onSelectChat={setActiveChatId} />

        {/* Spacer to allow background scrolling/pulling behind the drawer */}
        <div className="h-[400px]" />
      </PullToRefresh>

      {/* 3. Overlapping List Container - Now outside pull-to-refresh to avoid conflicts */}
      <ChatListContainer>
        {/* Status Filters - Now inside the container */}
        <div className="px-6 py-4 flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 w-full">
            {statusFilters.map((filter) => (
              <motion.button
                key={filter.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsLoading(true);
                  setActiveTab(filter.value);
                  setActiveChatId(null);
                }}
                className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === filter.value
                  ? "bg-[#1A1A1A] text-white shadow-lg shadow-black/10"
                  : "bg-gray-100 text-gray-500"
                  }`}
              >
                <filter.icon className="w-3.5 h-3.5" strokeWidth={2.5} />
                {filter.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* The Actual Conversation List */}
        {isLoading ? (
          <div className="px-1 pt-1">
            <MessageItemShimmer itemCount={6} />
          </div>
        ) : (
          <MessageList
            chats={filteredChats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
          />
        )}
      </ChatListContainer>
    </div>
  );
}
