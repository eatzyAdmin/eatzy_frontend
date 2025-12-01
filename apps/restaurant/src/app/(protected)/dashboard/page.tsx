"use client";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";

export default function Page() {
  const { hide } = useLoading();

  // Hide loading after 1.5s on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      hide();
    }, 1500);
    return () => clearTimeout(timer);
  }, [hide]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
      <p className="text-gray-600 mt-2">Chào mừng đến với trang quản lý nhà hàng</p>
    </div>
  );
}
