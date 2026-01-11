'use client';

import { motion } from "@repo/ui/motion";
import { ChevronDown } from "@repo/ui/icons";

interface Props {
  onClick: () => void;
}

export default function FloatingScrollTrigger({ onClick }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      onClick={onClick}
      className="fixed bottom-28 md:bottom-8 right-3 md:right-8 z-40 group"
    >
      <div className="relative flex items-center gap-2 md:gap-3">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-medium shadow-lg"
        >
          Scroll down to see nearby restaurants!
        </motion.div>

        <motion.div
          animate={{
            y: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full text-black flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
        >
          <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
        </motion.div>
      </div>
    </motion.button>
  );
}
