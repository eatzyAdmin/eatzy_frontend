"use client";

import { useState, useEffect } from "react";
import { AnimationState } from "../types";

export function usePageAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    pageLoaded: false,
    animationComplete: false,
  });

  useEffect(() => {
    const pageLoadTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, pageLoaded: true }));
    }, 100);

    const animationTimer = setTimeout(() => {
      setAnimationState((prev) => ({ ...prev, animationComplete: true }));
    }, 1800);

    return () => {
      clearTimeout(pageLoadTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  return animationState;
}

