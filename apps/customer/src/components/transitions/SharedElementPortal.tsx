"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useTransitionStore } from "@/store/transitionStore";

export default function SharedElementPortal() {
  const { isTransitioning, fromRect, endTransition } = useTransitionStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isTransitioning && fromRect && (
        <motion.div
          initial={{
            position: "fixed",
            top: fromRect.top,
            left: fromRect.left,
            width: fromRect.width,
            height: fromRect.height,
            borderRadius: "40px",
            background: "linear-gradient(to bottom right, #F5F5F5, #FFFFFF)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
          animate={{
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: "0px",
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.32, 0.72, 0, 1],
          }}
          onAnimationComplete={() => {
            endTransition();
          }}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}

