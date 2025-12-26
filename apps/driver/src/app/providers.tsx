"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider, NotificationProvider, SwipeConfirmationProvider, EatzyDataInitializer } from "@repo/ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EatzyDataInitializer>
      <QueryProvider>
        <ThemeProvider>
          <LoadingProvider>
            <NotificationProvider>
              <SwipeConfirmationProvider>{children}</SwipeConfirmationProvider>
            </NotificationProvider>
          </LoadingProvider>
        </ThemeProvider>
      </QueryProvider>
    </EatzyDataInitializer>
  );
}