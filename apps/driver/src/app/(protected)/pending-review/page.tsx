"use client";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { CheckCircle2 } from "@repo/ui/icons";

export default function PendingReviewPage() {
  const { hide } = useLoading();
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#1A1A1A]">
          <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
          <div>Đã nộp hồ sơ thành công</div>
        </div>
        <div className="mt-2 text-[#555]">Hồ sơ của bạn đang chờ kiểm duyệt. Vui lòng theo dõi phản hồi.</div>
      </div>
    </div>
  );
}
