"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { sileo } from "@/components/DynamicIslandToast";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password", "/test-notification", "/test-magazine"];

export const AuthInitializer = () => {
  const { isError, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we are on a public page, do nothing
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
      return;
    }

    // If auth failed (after retries) and we are not loading -> Redirect
    if (isError && !isLoading) {
      sileo.error({
        title: "Phiên đăng nhập đã hết hạn",
        description: "Vui lòng đăng nhập lại. Đang điều hướng đến trang đăng nhập...",
      });
      router.replace("/login");
    }
  }, [isError, isLoading, pathname, router]);

  return null;
};
