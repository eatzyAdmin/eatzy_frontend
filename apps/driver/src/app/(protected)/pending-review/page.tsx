"use client";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { CheckCircle2 } from "@repo/ui/icons";
import { Button } from "@repo/ui";
import { useRouter } from "next/navigation";

export default function PendingReviewPage() {
  const router = useRouter();
  const { hide } = useLoading();
  useEffect(() => {
    hide();
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#1A1A1A]">
          <CheckCircle2 className="w-6 h-6 text-[var(--primary)]" />
          <div>Application Submitted Successfully</div>
        </div>
        <div className="mt-2 text-[#555]">Your application is pending review. Please stay tuned for updates.</div>
        <div className="mt-6">
          <Button variant="outline" size="lg" onClick={() => router.push("/login")} className="w-full">Back to Login</Button>
        </div>
      </div>
    </div>
  );
}
