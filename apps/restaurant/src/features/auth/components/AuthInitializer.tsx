"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNotification } from "@repo/ui";
import { useAuth } from "../hooks/useAuth";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

export const AuthInitializer = () => {
  const { isError, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { showNotification } = useNotification();

  useEffect(() => {
    // If we are on a public page, do nothing
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return;
    }

    // If auth failed (after retries) and we are not loading -> Redirect
    if (isError && !isLoading) {
      showNotification({
        message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        type: "error",
        format: "Đang điều hướng đến trang đăng nhập..."
      });
      router.replace("/login");
    }
  }, [isError, isLoading, pathname, router, showNotification]);

  return null;
};
