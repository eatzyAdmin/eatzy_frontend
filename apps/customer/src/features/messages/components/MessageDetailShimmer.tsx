import React from 'react';
import { motion } from '@repo/ui/motion';

interface MessageDetailShimmerProps {
  isMobile: boolean;
}

/**
 * MessageDetailShimmer Component
 * Provides a high-fidelity shimmer loading state for the message list.
 * Features diverse bubble sizes, Telegram-style rounding, and staggered spring animations.
 */
const MessageDetailShimmer = ({ isMobile }: MessageDetailShimmerProps) => {
  // Diverse widths and heights to simulate different message lengths
  const placeholders = [
    { isMe: false, width: 'w-[75%]', height: 'h-[48px]' },
    { isMe: true, width: 'w-[60%]', height: 'h-[48px]' },
    { isMe: false, width: 'w-[85%]', height: 'h-[64px]' }, // Simulates a 2-line message
    { isMe: false, width: 'w-[40%]', height: 'h-[48px]' },
    { isMe: true, width: 'w-[70%]', height: 'h-[48px]' },
    { isMe: false, width: 'w-[65%]', height: 'h-[48px]' },
    { isMe: true, width: 'w-[45%]', height: 'h-[48px]' },
    { isMe: false, width: 'w-[90%]', height: 'h-[82px]' }, // Simulates a longer message
    { isMe: true, width: 'w-[55%]', height: 'h-[48px]' },
    { isMe: false, width: 'w-[50%]', height: 'h-[48px]' },
  ];

  return (
    <>
      {placeholders.map((item, i) => (
        <div
          key={`shimmer-${i}`}
          className={`flex flex-col gap-1 mb-5 ${item.isMe ? 'items-end' : 'items-start'}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.3, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 25,
              delay: i * 0.07
            }}
            style={{ transformOrigin: item.isMe ? 'bottom right' : 'bottom left' }}
            className={`relative px-3 py-2 ${item.height} ${item.width} ${item.isMe
              ? 'bg-primary/40 backdrop-blur-sm shadow-[0_0_24px_rgba(0,0,0,0.18)] rounded-[24px] rounded-br-[8px]'
              : 'bg-white/50 backdrop-blur-sm border-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.12)] rounded-[24px] rounded-bl-[8px]'
              } overflow-hidden`}
          >
            {/* Standard Smooth Shimmer Effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "linear"
              }}
              className={`absolute inset-0 bg-gradient-to-r from-transparent ${item.isMe ? 'via-white/20' : 'via-white'} to-transparent`}
            />
          </motion.div>
        </div>
      ))}
    </>
  );
};

export default MessageDetailShimmer;
