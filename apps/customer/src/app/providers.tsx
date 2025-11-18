"use client";
import { QueryProvider } from "@repo/lib";
import { ThemeProvider, LoadingProvider } from "@repo/ui";
import SharedElementPortal from "@/components/transitions/SharedElementPortal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <LoadingProvider>
          {children}
          <SharedElementPortal />
        </LoadingProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}