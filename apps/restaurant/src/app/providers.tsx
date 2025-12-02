"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider, SwipeConfirmationProvider } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LoadingProvider>
          <SwipeConfirmationProvider>
            {children}
          </SwipeConfirmationProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}