"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryProvider>
  );
}