"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "../motion";

type FlightGhost = {
  id: string;
  start: DOMRect;
  end: DOMRect;
  imageUrl?: string;
  color?: string;
};

const makeId = () => Math.random().toString(36).slice(2);

export function useFlyToCart() {
  const [ghosts, setGhosts] = useState<FlightGhost[]>([]);

  const fly = (req: { start: DOMRect; end: DOMRect; imageUrl?: string; color?: string }) => {
    const id = makeId();
    const ghost: FlightGhost = { id, start: req.start, end: req.end, imageUrl: req.imageUrl, color: req.color };
    setGhosts((g) => [...g, ghost]);
    setTimeout(() => {
      setGhosts((g) => g.filter((x) => x.id !== id));
    }, 800);
  };

  return { ghosts, fly };
}

export function FlyToCartLayer({ ghosts }: { ghosts: FlightGhost[] }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      <AnimatePresence>
        {ghosts.map((g) => {
          const midX = (g.start.x + g.end.x) / 2 + 80;
          const midY = (g.start.y + g.end.y) / 2 - 120;
          const size = Math.min(g.start.width, g.start.height) * 0.6;
          return (
            <motion.div
              key={g.id}
              initial={{ x: g.start.x, y: g.start.y, scale: 1, opacity: 1 }}
              animate={{
                x: [g.start.x, midX, g.end.x],
                y: [g.start.y, midY, g.end.y],
                scale: [1, 0.6, 0.3],
                opacity: [1, 0.8, 0],
              }}
              transition={{ duration: 0.65, ease: "easeInOut" }}
              style={{ position: "absolute", width: size, height: size, borderRadius: 9999, overflow: "hidden" }}
            >
              {g.imageUrl ? (
                <img src={g.imageUrl} alt="ghost" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", backgroundColor: g.color ?? "var(--primary)" }} />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}