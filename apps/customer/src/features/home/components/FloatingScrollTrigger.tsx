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
      className="fixed bottom-8 right-8 z-40 group"
    >
      <div className="relative flex items-center gap-3">
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg"
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
          className="w-12 h-12 bg-white rounded-full text-black flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.button>
  );
}
