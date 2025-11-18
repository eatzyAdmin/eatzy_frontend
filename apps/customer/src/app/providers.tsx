"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}