"use client";

import { useState, useEffect } from "react";
import { ScrollState } from "../types";

export function useScrollAnimation() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    position: 0,
    showScrollTop: false,
    activeSection: "home",
  });

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollState((prev) => ({
        ...prev,
        position,
        showScrollTop: position > 500,
      }));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    const navHeight = 60;
    const top = (ref.current?.getBoundingClientRect().top || 0) + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return { scrollState, scrollToTop, scrollToSection, setScrollState };
}

