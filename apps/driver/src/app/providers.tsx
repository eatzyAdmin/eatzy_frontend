"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider, LoadingProvider, NotificationProvider, SwipeConfirmationProvider } from "@repo/ui";
import { AuthInitializer } from "@/features/auth/components/AuthInitializer";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Retry failed requests once (except 401s which are handled by useAuth/Interceptor)
        retry: 1,
        // Data is fresh for 1 minute by default
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          <NotificationProvider>
            <SwipeConfirmationProvider>
              <AuthInitializer />
              {children}
            </SwipeConfirmationProvider>
          </NotificationProvider>
        </LoadingProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}