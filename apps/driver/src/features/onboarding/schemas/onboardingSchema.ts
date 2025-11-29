import { z } from "@repo/lib/zod";

export const emailVerificationSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP phải có 6 chữ số"),
});

export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type OTPData = z.infer<typeof otpSchema>;
