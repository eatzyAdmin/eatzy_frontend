"use client";

import { useState, useCallback } from "react";
import { SectionVisibility } from "../types";

export function useSectionVisibility() {
  const [visibility, setVisibility] = useState<SectionVisibility>({
    home: false,
    features: false,
    categories: false,
    benefits: false,
    cta: false,
  });

  const checkVisibility = useCallback((ref: React.RefObject<HTMLElement>, key: keyof SectionVisibility) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.75;
    
    if (isVisible && !visibility[key]) {
      setVisibility((prev) => ({ ...prev, [key]: true }));
    }
  }, [visibility]);

  return { visibility, checkVisibility, setVisibility };
}

