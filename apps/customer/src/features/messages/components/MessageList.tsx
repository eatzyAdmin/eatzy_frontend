import { useState } from 'react';
import { motion } from '@repo/ui/motion';
import { ChatSession } from '../data/mockMessages';
import { BadgeCheck, Search, MessageSquare, CheckCircle2 } from '@repo/ui/icons';
import { ImageWithFallback } from '@repo/ui';
import { EmptyState } from '@/components/ui/EmptyState';

interface MessageListProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

export default function MessageList({ chats, activeChatId, onSelectChat }: MessageListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat List */}
      <div className="flex-1 px-1.5 md:px-0 overflow-y-auto no-scrollbar space-y-1">
        {chats.map((chat, idx) => {
          const isNextActive = chats[idx + 1]?.id === activeChatId;
          const isNextHovered = chats[idx + 1]?.id === hoveredId;
          const isCurrentActive = chat.id === activeChatId;
          const isCurrentHovered = chat.id === hoveredId;
          const hideBorder = isCurrentActive || isCurrentHovered || isNextActive || isNextHovered;

          return (
            <div key={chat.id} className="group flex flex-col">
              <motion.button
                onClick={() => onSelectChat(chat.id)}
                onMouseEnter={() => setHoveredId(chat.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 md:px-4 py-1 transition-all text-left rounded-[34px] ${activeChatId === chat.id ? 'bg-gray-200/80' : 'hover:bg-gray-200/30'
                  }`}
              >
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-100 my-3">
                  <ImageWithFallback
                    src={chat.partnerAvatar || ""}
                    alt={chat.partnerName}
                    fill
                    placeholderMode="horizontal"
                    className="object-cover transition-transform duration-700 ease-out md:group-hover:scale-110"
                    sizes="48px"
                  />
                  <div className="absolute inset-0 bg-black/5 md:group-hover:bg-black/0 transition-all duration-700 ease-out" />
                </div>

                {/* Info Container */}
                <div className="flex-1 min-w-0 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="font-bold text-[#1A1A1A] tracking-tight truncate">{chat.partnerName}</span>
                      {chat.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" stroke="white" strokeWidth={2.0} />}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{chat.lastMessageTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-black font-semibold' : 'text-gray-500'}`}>
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-primary/60 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.button>

              {/* Full Width Separator - Spans across avatar and info */}
              {idx !== chats.length - 1 && (
                <div className={`mx-4 border-b-[1.5px] border-gray-200/80 transition-opacity duration-300 ${hideBorder ? 'opacity-0' : 'opacity-100'}`} />
              )}
            </div>
          );
        })}

        {/* End of List design - From CartOverlay */}
        {chats.length >= 4 && (
          <div className="py-12 flex items-center justify-center gap-4 opacity-30 mt-4 pb-20">
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-16" />
            <div className="flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[12px] font-bold text-gray-400 uppercase font-anton tracking-wider">End of list</span>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent w-16" />
          </div>
        )}
        {chats.length === 0 && (
          <EmptyState
            icon={MessageSquare}
            title="No messages found"
            description="Try searching with different keywords"
            className="py-12"
          />
        )}
      </div>
    </div>
  );
}
