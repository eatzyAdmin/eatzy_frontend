"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "@/components/DynamicIslandToast";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/onboarding"];

export const AuthInitializer = () => {
  const { isError, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we are on a public page, do nothing
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return;
    }

    // If auth failed OR we are confirmed not authenticated (after loading finished)
    const isUnauthenticated = (isError || (!isAuthenticated && !isLoading));

    if (isUnauthenticated) {
      // Only show message if we're actually in an error state (token expired/invalid)
      if (isError) {
        sileo.error({
          title: "Phiên đăng nhập đã hết hạn",
          description: "Vui lòng đăng nhập lại. Đang điều hướng đến trang đăng nhập...",
          duration: 4000
        });
      }
      router.replace("/login");
    }
  }, [isError, isLoading, isAuthenticated, pathname, router]);

  return null;
};
