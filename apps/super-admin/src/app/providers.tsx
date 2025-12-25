"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider, SwipeConfirmationProvider, NotificationProvider } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LoadingProvider>
          <NotificationProvider>
            <SwipeConfirmationProvider>
              {children}
            </SwipeConfirmationProvider>
          </NotificationProvider>
        </LoadingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}