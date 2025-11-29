"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { FloatingLabelInput, Button } from "@repo/ui";
import { Mail, ShieldCheck } from "@repo/ui/icons";
import { useEffect, useState } from "react";

export default function OtpStep() {
  const { data, setField, next } = useOnboardingStore();
  const [countdown, setCountdown] = useState<number>(0);
  const [sent, setSent] = useState<boolean>(false);
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);
  const sendOtp = () => {
    setSent(true);
    setCountdown(60);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setField("otpCode", code);
  };
  const verify = () => {
    setField("isPhoneVerified", true);
    next();
  };
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Mail className="w-5 h-5 text-[var(--primary)]" />
        <div>Xác thực Email</div>
      </div>
      <div className="mt-4 space-y-4">
        <FloatingLabelInput label="Email" type="email" value={data.email ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("email", e.target.value)} />
        <Button variant="primary" size="lg" className="w-full" onClick={sendOtp}>Gửi mã OTP</Button>
        {sent && (
          <div className="space-y-3">
            <FloatingLabelInput label="Nhập OTP 6 số" value={data.otpCode ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("otpCode", e.target.value)} />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div>Đếm ngược: {countdown}s</div>
              <button className="text-[var(--primary)]" onClick={sendOtp} disabled={countdown > 0}>Gửi lại</button>
            </div>
            <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!data.otpCode} onClick={verify}>
              <ShieldCheck className="w-5 h-5" />
              Xác minh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
