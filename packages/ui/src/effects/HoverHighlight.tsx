import { useState, useCallback, useRef } from "react";
import { motion } from "../motion";

export type HighlightRect = { x: number; y: number; width: number; height: number };
export type HighlightStyle = {
  borderRadius: number;
  backgroundColor: string;
  opacity?: number;
  scaleEnabled?: boolean;
  scale?: number;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
};

export type SpringPreset = "smooth" | "tail";

export function useHoverHighlight<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);
  const [rect, setRect] = useState<HighlightRect>({ x: 0, y: 0, width: 0, height: 0 });
  const [style, setStyle] = useState<HighlightStyle>({ borderRadius: 12, backgroundColor: "#f2ebe3", opacity: 0, scaleEnabled: false, scale: 1, padding: 0 });

  const moveHighlight = useCallback(
    (e: React.MouseEvent<HTMLElement>, nextStyle?: Partial<HighlightStyle>) => {
      const target = e.currentTarget as HTMLElement;
      if (!containerRef.current) return;
      const r = target.getBoundingClientRect();
      const parent = containerRef.current.getBoundingClientRect();
      setRect({ x: r.left - parent.left, y: r.top - parent.top, width: r.width, height: r.height });
      setStyle((prev) => ({
        borderRadius: nextStyle?.borderRadius ?? prev.borderRadius,
        backgroundColor: nextStyle?.backgroundColor ?? prev.backgroundColor,
        opacity: nextStyle?.opacity ?? 1,
        scaleEnabled: nextStyle?.scaleEnabled ?? prev.scaleEnabled ?? false,
        scale: nextStyle?.scale ?? prev.scale ?? 1,
        padding: nextStyle?.padding ?? prev.padding ?? 0,
        paddingX: nextStyle?.paddingX ?? prev.paddingX,
        paddingY: nextStyle?.paddingY ?? prev.paddingY,
      }));
    },
    []
  );

  const clearHover = useCallback(() => {
    setStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return { containerRef, rect, style, moveHighlight, clearHover };
}

export function HoverHighlightOverlay({ rect, style, preset = "smooth" }: { rect: HighlightRect; style: HighlightStyle; preset?: SpringPreset }) {
  const transition =
    preset === "tail"
      ? { type: "spring", mass: 0.4, stiffness: 220, damping: 22 }
      : { type: "spring", stiffness: 300, damping: 30 };

  const px = style.paddingX ?? style.padding ?? 0;
  const py = style.paddingY ?? style.padding ?? 0;

  return (
    <motion.div
      layoutId="hoverHighlight"
      className="absolute pointer-events-none z-0"
      style={{ transformOrigin: "center" }}
      animate={{
        x: rect.x - px,
        y: rect.y - py,
        width: rect.width + (px * 2),
        height: rect.height + (py * 2),
        borderRadius: style.borderRadius,
        backgroundColor: style.backgroundColor,
        opacity: style.opacity ?? 0,
        scale: style.scaleEnabled ? style.scale ?? 1.05 : 1
      }}
      transition={transition}
    />
  );
}