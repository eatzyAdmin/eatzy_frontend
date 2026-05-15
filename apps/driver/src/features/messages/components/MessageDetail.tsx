import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, Fragment } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { ChatSession, ChatMessage } from '../data/mockMessages';
import { ChevronLeft, Send, BadgeCheck, Utensils, Info, Clock, ExternalLink, ArrowLeft, Store, ChevronRight } from '@repo/ui/icons';
import Image from 'next/image';
import { ImageWithFallback } from '@repo/ui';
import { formatVnd } from '@repo/lib';
import CurrentOrderCard from '@/features/orders/components/CurrentOrderCard';
import type { OrderResponse } from '@repo/types';
import { StickyOrderHeaderCard } from './StickyOrderHeaderCard';
import { mapToOrderResponse } from '../utils';
import MessageDetailShimmer from './MessageDetailShimmer';

import patternBg from '@repo/ui/assets/placeholders/background_pattern_light.jpg';

interface MessageDetailProps {
  chat: ChatSession;
  onBack: () => void;
  isMobile: boolean;
}

/**
 * MessageDetail Component
 * High-fidelity redesign mirrored 100% from the customer app.
 * Features Telegram-style bubbles, sticky order context, and smooth staggered animations.
 */
export default function MessageDetail({ chat, onBack, isMobile }: MessageDetailProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stickyOrder, setStickyOrder] = useState<any>(null);
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showTimeId, setShowTimeId] = useState<string | null>(null);

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(chat.messages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading simulation
  useEffect(() => {
    // Wait for the detail view animation to settle first
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [chat.id]);

  useEffect(() => {
    setLocalMessages(chat.messages);
  }, [chat.messages]);

  // Auto-resize textarea
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(48, Math.min(scrollHeight, 120))}px`;
    }
  }, [inputText]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: any = {
      id: `temp-${Date.now()}`,
      text: inputText,
      senderId: 'me',
      isMe: true,
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setLocalMessages(prev => [...prev, newMessage]);
    setInputText("");

    // Simulate server response/sent status
    setTimeout(() => {
      setLocalMessages(prev => prev.map(m =>
        m.id === newMessage.id ? { ...m, status: 'sent' } : m
      ));
    }, 1500);

    // Immediate smooth scroll to bottom after state update
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Scroll to bottom whenever messages change or loading ends
  useLayoutEffect(() => {
    if (scrollRef.current && !isLoading) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, isLoading]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      // 1. Find the absolute latest message with an order card
      const orderMessages = chat.messages.filter(m => m.orderCard);
      if (orderMessages.length === 0) {
        setStickyOrder(null);
        return;
      }

      const lastOrderMsg = orderMessages[orderMessages.length - 1];
      const lastOrderRef = orderRefs.current[lastOrderMsg.id];

      if (lastOrderRef) {
        const rect = lastOrderRef.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // 2. Determine visibility
        // Header height is roughly 70px, so we use a small buffer
        const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top + 70;

        // 3. Show sticky only if the LATEST order is NOT visible
        setStickyOrder(isVisible ? null : lastOrderMsg.orderCard);
      }
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [chat.messages]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] overflow-hidden relative">
      {/* Header with Integrated Sticky Order */}
      <div className="absolute top-0 inset-x-0 z-30 bg-[#F7F7F7]/70 backdrop-blur-sm rounded-b-[36px] md:rounded-b-[36px] shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-300">
        {/* Main Header Row */}
        <div className="px-3 py-3 md:px-4 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {isMobile && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full bg-white/60 shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 font-bold shrink-0"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
              </motion.button>
            )}

            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-11 h-11 rounded-[18px] overflow-hidden shrink-0 bg-gray-100 ring-2 ring-white shadow-sm">
                <ImageWithFallback
                  src={chat.partnerAvatar || ""}
                  alt={chat.partnerName}
                  fill
                  placeholderMode="horizontal"
                  className="object-cover"
                  sizes="44px"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-gray-700 text-lg truncate leading-tight tracking-tight">
                  {chat.partnerName}
                </h3>
                <div className="text-xs font-medium text-gray-500 mt-0.5 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${chat.type === 'system' ? 'bg-blue-400' : 'bg-lime-500'}`} />
                  <p className="truncate shrink-0">{chat.type === 'system' ? 'Eatzy Official' : 'Assigned Driver'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 ml-4 flex items-center gap-3">
            <AnimatePresence>
              {!isMobile && stickyOrder && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-[280px]"
                >
                  <StickyOrderHeaderCard order={stickyOrder} compact />
                </motion.div>
              )}
            </AnimatePresence>
            <button className="w-10 h-10 rounded-full bg-white/60 shadow-sm border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sticky Order Slot inside Header (Mobile Only) */}
        <AnimatePresence>
          {isMobile && stickyOrder && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <StickyOrderHeaderCard order={stickyOrder} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages Area Container */}
      <div className="flex-1 relative overflow-hidden bg-[#F9FAFB]">
        {/* Subtle Pattern Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.32] pointer-events-none"
          style={{
            backgroundImage: `url(${patternBg.src || patternBg})`,
            backgroundRepeat: 'repeat',
            backgroundSize: '360px',
            backgroundAttachment: 'fixed'
          }}
        />

        {/* Messages List Area */}
        <div
          ref={scrollRef}
          className={`h-full overflow-y-auto no-scrollbar px-3 relative z-10 transition-all duration-300 ${isMobile
            ? (stickyOrder ? 'pt-[175px]' : 'pt-20')
            : (stickyOrder ? 'pt-[105px]' : 'pt-24')
            } pb-20`}
        >
          <AnimatePresence>
            {isLoading ? (
              <MessageDetailShimmer isMobile={isMobile} />
            ) : localMessages.map((msg, idx) => {
              const isSystemMsg = msg.senderId === 'system_auto' || msg.senderId === 'eatzy_system' || msg.senderId === 'eatzy_promos';

              // Telegram Style Date Separator Logic
              const currentDate = new Date(msg.timestamp);
              const prevMsg = idx > 0 ? localMessages[idx - 1] : null;
              const prevDate = prevMsg ? new Date(prevMsg.timestamp) : null;

              const isNewDay = !prevDate ||
                currentDate.getDate() !== prevDate.getDate() ||
                currentDate.getMonth() !== prevDate.getMonth() ||
                currentDate.getFullYear() !== prevDate.getFullYear();

              const isSamePersonPrev = prevMsg?.senderId === msg.senderId;
              const isWithinOneMinutePrev = prevDate && (currentDate.getTime() - prevDate.getTime() < 60000);
              const isSameGroupPrev = isSamePersonPrev && isWithinOneMinutePrev && !isNewDay;

              const nextMsg = idx < localMessages.length - 1 ? localMessages[idx + 1] : null;
              const isSamePersonNext = nextMsg?.senderId === msg.senderId;
              const nextDate = nextMsg ? new Date(nextMsg.timestamp) : null;
              const isWithinOneMinuteNext = nextDate && (nextDate.getTime() - currentDate.getTime() < 60000);

              // Check if next message would start a new day
              const isNextNewDay = nextDate && (
                nextDate.getDate() !== currentDate.getDate() ||
                nextDate.getMonth() !== currentDate.getMonth() ||
                nextDate.getFullYear() !== currentDate.getFullYear()
              );

              const isSameGroupNext = isSamePersonNext && isWithinOneMinuteNext && !isNextNewDay;

              const getDateLabel = (date: Date) => {
                const today = new Date();
                const yesterday = new Date();
                yesterday.setDate(today.getDate() - 1);

                if (date.toDateString() === today.toDateString()) return 'Today';
                if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

                return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
              };

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 ${isSameGroupNext ? 'mb-1' : 'mb-5'}`}
                >
                  <Fragment>
                    {isNewDay && (
                      <div className={`flex justify-center my-6 sticky z-20 transition-all duration-300 ${(stickyOrder && isMobile) ? 'top-[15px]' : 'top-[0px]'
                        }`}>
                        <div className="bg-gray-100/60 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.1)] border-2 border-white/40">
                          <span className="text-[13px] font-bold text-gray-500 tracking-tight">
                            {getDateLabel(currentDate)}
                          </span>
                        </div>
                      </div>
                    )}


                    {/* Message Bubble (Telegram Style) */}
                    <div className={`flex items-end gap-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      {/* Loading Status Left of Bubble */}
                      <AnimatePresence>
                        {msg.isMe && (msg as any).status === 'sending' && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="flex items-center gap-2 mb-1.5"
                          >
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                            <span className="text-[14px] leading-snug tracking-tight font-semibold text-gray-400">Sending...</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.3, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 250,
                          damping: 25,
                          mass: 1,
                          delay: (localMessages.length - 1 - idx) * 0.08
                        }}
                        style={{ transformOrigin: msg.isMe ? 'bottom right' : 'bottom left' }}
                        onClick={() => setShowTimeId(showTimeId === msg.id ? null : msg.id)}
                        className={`relative px-3 py-2 cursor-pointer max-w-[76%] md:max-w-[72%] ${msg.isMe
                          ? `bg-primary/60 backdrop-blur-sm text-white rounded-[24px] shadow-[0_0_24px_rgba(0,0,0,0.18)] ${!isSameGroupPrev ? 'rounded-br-[8px]' : (!isSameGroupNext ? 'rounded-tr-[8px]' : 'rounded-r-[8px]')
                          }`
                          : `bg-white/50 backdrop-blur-sm text-gray-800 rounded-[24px] border-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.12)] ${!isSameGroupPrev ? 'rounded-bl-[8px]' : (!isSameGroupNext ? 'rounded-tl-[8px]' : 'rounded-l-[8px]')
                          }`
                          }`}
                      >
                        <p className="text-[15px] leading-snug tracking-tight font-normal">
                          {msg.text}
                        </p>

                        <AnimatePresence>
                          {showTimeId === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              transition={{ duration: 0.2 }}
                              className={`flex items-center gap-1 mt-1 opacity-60 justify-end`}
                            >
                              <span className={`text-[9px] font-bold tabular-nums ${msg.isMe ? 'text-white/80' : 'text-gray-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>

                    {/* Official CurrentOrderCard Integrated 100% */}
                    {msg.orderCard && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.3, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 250,
                          damping: 25,
                          mass: 1,
                          delay: (localMessages.length - 1 - idx) * 0.05
                        }}
                        style={{ transformOrigin: msg.isMe ? 'bottom right' : 'bottom left' }}
                        ref={el => { orderRefs.current[msg.id] = el }}
                        className={`w-full flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-5`}
                      >
                        <div className="w-full md:max-w-[400px]">
                          <CurrentOrderCard
                            order={mapToOrderResponse(msg.orderCard)}
                            onClick={() => { }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </Fragment>
                </div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Input Area */}
      <motion.div
        layout
        initial={false}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 38,
          mass: 1
        }}
        className="absolute bottom-0 inset-x-0 z-20 p-3 bg-[#F7F7F7]/70 backdrop-blur-sm rounded-t-[36px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]"
      >
        {chat.type === 'system' ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-white/50 border-2 border-white rounded-[24px] text-gray-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.06)]">
            <Info className="w-5 h-5 shrink-0" />
            <p className="text-[13px] font-bold uppercase tracking-tight leading-none pt-0.5">Official Eatzy Communication Channel</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative flex items-end px-0">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message here"
              className="w-full min-h-[48px] py-[13px] pl-4 pr-12 bg-white/60 border border-white rounded-[24px] shadow-[inset_0_0_18px_rgba(0,0,0,0.08)] outline-none focus:outline-none focus:ring-0 focus:border-white transition-colors text-[15px] leading-snug tracking-tight font-normal text-gray-800 resize-none overflow-y-auto no-scrollbar"
              rows={1}
            />
            <button
              onClick={handleSend}
              className="absolute right-5 bottom-3.5 text-gray-900 hover:scale-110 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
