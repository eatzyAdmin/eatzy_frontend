"use client";

import { motion } from "framer-motion";

interface DotsLoaderProps {
  color?: string;
  size?: number;
}

export default function DotsLoader({ color = "#ffffff", size = 8 }: DotsLoaderProps) {
  const dotVariants = {
    initial: { y: 0 },
    animate: { y: -8 },
  };

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="flex items-center justify-center gap-1.5"
    >
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          variants={dotVariants}
          transition={{
            duration: 0.4,
            ease: "easeInOut",
          }}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
      ))}
    </motion.div>
  );
}
