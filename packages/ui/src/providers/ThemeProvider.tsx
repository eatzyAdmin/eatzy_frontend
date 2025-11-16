"use client";

import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { lightTheme, darkTheme } from "../themes";

type ThemeName = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeName;
  applyTheme: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, defaultTheme = "light" }: { children: ReactNode; defaultTheme?: ThemeName }) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);

  const themes: Record<ThemeName, Record<string, string>> = useMemo(
    () => ({ light: lightTheme, dark: darkTheme }),
    []
  );

  const applyTheme = (name: ThemeName) => {
    const selected = themes[name];
    Object.entries(selected).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    setTheme(name);
  };

  useEffect(() => {
    applyTheme(theme);
  }, []);

  return <ThemeContext.Provider value={{ theme, applyTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};