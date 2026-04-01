"use client";

import { useState } from "react";
import { useZodForm, z } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, ShieldCheck, CheckCircle, ChevronRight, Lock } from "@repo/ui/icons";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import OTPInput from "./OTPInput";
import { emailVerificationSchema, type EmailVerificationData } from "@repo/lib";

interface MobileForgotPasswordDrawerProps {
  onBackToLogin: () => void;
}

type Step = "email" | "otp" | "password" | "success";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().min(8, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function MobileForgotPasswordDrawer({ onBackToLogin }: MobileForgotPasswordDrawerProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const emailForm = useZodForm<EmailVerificationData>({
    schema: emailVerificationSchema,
    mode: "all",
  });

  const passwordForm = useZodForm<ResetPasswordData>({
    schema: resetPasswordSchema,
    mode: "all",
  });

  const handleEmailSubmit = async (data: EmailVerificationData) => {
    setIsLoading(true);
    setEmail(data.email);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep("otp");
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }
    setIsLoading(true);
    setOtpError("");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (otp === "123456") {
      setIsLoading(false);
      setCurrentStep("password");
    } else {
      setIsLoading(false);
      setOtpError("Mã OTP không chính xác");
    }
  };

  const handlePasswordSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep("success");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <motion.div
            key="forgot-email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Lost Key?</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">Enter your email to receive a code.</p>
            </div>

            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="pb-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                    <Mail size={16} strokeWidth={3} />
                  </div>
                  <input
                    type="email"
                    placeholder="e-mail address"
                    {...emailForm.register("email")}
                    className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading || !emailForm.formState.isValid}
                  className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !emailForm.formState.isValid)
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <span className="tracking-tight">Send Code</span>
                      <ChevronRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        );

      case "otp":
        return (
          <motion.div
            key="forgot-otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-2">
              <button
                onClick={() => setCurrentStep("email")}
                className="flex items-center gap-1 text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-4 hover:text-black transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Change Email</span>
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Verify Identity</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">Validation code sent to {email}</p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <OTPInput value={otp} onChange={setOtp} error={otpError} />
              
              <button
                onClick={handleOTPVerify}
                disabled={isLoading || otp.length !== 6}
                className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || otp.length !== 6)
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <span className="tracking-tight">Verify & Continue</span>
                    <ChevronRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );

      case "password":
        return (
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">New Security</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">Set a strong password for your account.</p>
            </div>

            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="pb-4">
              <div className="space-y-3">
                {/* Password Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <ShieldCheck size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="password"
                      placeholder="new password"
                      {...passwordForm.register("password")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {passwordForm.formState.errors.password && (
                    <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{passwordForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <ShieldCheck size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="password"
                      placeholder="confirm new password"
                      {...passwordForm.register("confirmPassword")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading || !passwordForm.formState.isValid}
                  className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !passwordForm.formState.isValid)
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <span className="tracking-tight">Update Password</span>
                      <ChevronRight size={20} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        );

      case "success":
        return (
          <motion.div
            key="forgot-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-8"
          >
            <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(120,200,65,0.3)]">
              <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
            </div>
            
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Secure!</h1>
              <p className="text-gray-400 font-medium italic">Your password has been successfully updated.</p>
            </div>

            <button
              onClick={onBackToLogin}
              className="w-full h-16 bg-black text-white rounded-full font-black text-lg shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-zinc-800 transition-all active:scale-95"
            >
              Sign In Now
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key="forgot-drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 150 }}
      className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Eat Eatzy, eat easy!</span>
        {(currentStep as string) !== "success" && (
          <button
            onClick={onBackToLogin}
            className="text-gray-900 font-black text-lg tracking-tighter flex items-center gap-1 active:scale-95 transition-all group"
          >
            <span>Log in</span>
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.7} />
          </button>
        )}
      </div>

      {renderStep()}
    </motion.div>
  );
}
