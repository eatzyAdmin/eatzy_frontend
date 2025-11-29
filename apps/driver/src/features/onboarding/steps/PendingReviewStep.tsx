"use client";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";

export default function PendingReviewStep() {
  const router = useRouter();
  return (
    <div className="p-6 space-y-4">
      <div className="text-lg font-semibold text-gray-900">Hồ sơ đang được kiểm duyệt</div>
      <div className="mt-2 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <div className="text-sm text-gray-700">Đã gửi hồ sơ</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="text-sm text-gray-700">Đang kiểm tra giấy tờ</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <div className="text-sm text-gray-700">Hoàn thành khóa học</div>
        </div>
      </div>
      <div className="pt-4">
        <Button variant="outline" size="lg" onClick={() => router.push("/login")} className="w-full">Quay về trang đăng nhập</Button>
      </div>
    </div>
  );
}
