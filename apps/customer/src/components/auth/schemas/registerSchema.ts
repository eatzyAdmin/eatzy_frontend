import { z } from "@repo/lib/zod";

// Step 1: Email verification
export const emailVerificationSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP phải có 6 chữ số"),
});

// Step 2: User information
export const userInfoSchema = z.object({
  fullName: z.string().min(1, "Họ tên là bắt buộc").min(2, "Họ tên phải có ít nhất 2 ký tự"),
  dateOfBirth: z
    .string()
    .min(1, "Ngày sinh là bắt buộc")
    .refine((date) => {
      const [day, month, year] = date.split("/").map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }, "Bạn phải từ 16 tuổi trở lên"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
  password: z.string().min(1, "Mật khẩu là bắt buộc").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export type EmailVerificationData = z.infer<typeof emailVerificationSchema>;
export type OTPData = z.infer<typeof otpSchema>;
export type UserInfoData = z.infer<typeof userInfoSchema>;

