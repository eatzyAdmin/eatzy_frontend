"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider, NotificationProvider } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LoadingProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}