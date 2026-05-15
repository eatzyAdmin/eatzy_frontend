"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useDragControls } from "@repo/ui/motion";

interface ChatListContainerProps {
  children: React.ReactNode;
}

/**
 * ChatListContainer Component
 * A premium draggable bottom sheet that "slips up" to overlap the top section.
 * Replicates the gesture-based dragging behavior from the Order Drawer.
 * Mirrored 100% from the customer app.
 */
export default function ChatListContainer({ children }: ChatListContainerProps) {
  const dragY = useMotionValue(0);
  const dragControls = useDragControls();
  const [isMaximized, setIsMaximized] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const dragStarted = useRef(false);
  const downEvent = useRef<React.PointerEvent | null>(null);

  // Snap points (0 is maximized, 325 is minimized/peeking)
  const SNAP_MINIMIZED = 325;
  const SNAP_MAXIMIZED = 0;

  return (
    <motion.div
      style={{ y: dragY }}
      drag="y"
      dragControls={dragControls}
      dragListener={true}
      dragConstraints={{ top: SNAP_MAXIMIZED, bottom: SNAP_MINIMIZED }}
      dragElastic={0.1}
      onDragEnd={(e, info) => {
        if (info.offset.y < -30 || info.velocity.y < -200) {
          setIsMaximized(true);
        } else if (info.offset.y > 30 || info.velocity.y > 200) {
          setIsMaximized(false);
        }
      }}
      initial={{ y: SNAP_MINIMIZED }}
      animate={{ y: isMaximized ? SNAP_MAXIMIZED : SNAP_MINIMIZED }}
      transition={{ type: "spring", stiffness: 350, damping: 35 }}
      className={`absolute inset-x-0 top-0 z-30 bg-white/60 backdrop-blur-md rounded-t-[46px] shadow-[0_-10px_40px_rgba(0,0,0,0.12)] border-t border-white/50 flex flex-col overflow-hidden h-full`}
    >
      {/* Handle - Visual & Drag Trigger */}
      <div
        className="w-full h-8 flex items-center justify-center flex-shrink-0 pt-2 cursor-grab active:cursor-grabbing"
      >
        <div className="w-12 h-1.5 bg-gray-200/80 rounded-full" />
      </div>

      {/* Scrollable Content Area */}
      <div
        ref={contentRef}
        onPointerDown={(e) => {
          downEvent.current = e;
          startY.current = e.clientY;
          dragStarted.current = false;

          // If not maximized, any touch starts the drawer movement
          if (!isMaximized) {
            dragControls.start(e);
            dragStarted.current = true;
          }
        }}
        onPointerMove={(e) => {
          const deltaY = e.clientY - startY.current;

          // If maximized, start drawer drag if pulling DOWN at the top (to dismiss)
          if (isMaximized && !dragStarted.current && contentRef.current) {
            const isAtTop = contentRef.current.scrollTop <= 0;
            if (isAtTop && deltaY > 10) {
              dragStarted.current = true;
              if (downEvent.current) {
                dragControls.start(downEvent.current);
              }
            }
          }

          // Detect pulling UP to immediately pop to maximized state if not maximized
          if (!isMaximized && deltaY < -10) {
            setIsMaximized(true);
          }
        }}
        className={`flex-1 flex flex-col ${isMaximized ? "overflow-y-auto" : "overflow-y-hidden"} no-scrollbar`}
        style={{
          touchAction: isMaximized ? "pan-y" : "none",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
