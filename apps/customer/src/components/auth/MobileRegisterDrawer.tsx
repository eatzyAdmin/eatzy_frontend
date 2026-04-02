"use client";

import { useState } from "react";
import { useZodForm, z } from "@repo/lib";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { ArrowLeft, Key, User, Phone, CheckCircle, ChevronRight, Calendar } from "@repo/ui/icons";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";
import OTPInput from "./OTPInput";
import EatzyMobileDatePicker from "./EatzyMobileDatePicker";
import {
  emailVerificationSchema,
  userInfoSchema,
  type EmailVerificationData,
  type UserInfoData,
} from "./schemas/registerSchema";

interface MobileRegisterDrawerProps {
  onBackToLogin: () => void;
}

type Step = "email" | "otp" | "info" | "success";

export default function MobileRegisterDrawer({ onBackToLogin }: MobileRegisterDrawerProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const { show } = useLoading();

  const emailForm = useZodForm<EmailVerificationData>({
    schema: emailVerificationSchema,
    mode: "all",
  });

  const infoForm = useZodForm<UserInfoData>({
    schema: userInfoSchema,
    mode: "all",
  });

  const handleEmailSubmit = async (data: EmailVerificationData) => {
    setIsLoading(true);
    setEmail(data.email);
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (otp === "123456") {
      setIsLoading(false);
      setCurrentStep("info");
    } else {
      setIsLoading(false);
      setOtpError("Mã OTP không chính xác");
    }
  };

  const handleInfoSubmit = async (data: UserInfoData) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCurrentStep("success");
  };

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <motion.div
            key="step-email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Enter Email</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">We'll send you a verification code.</p>
            </div>

            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute left-2 top-2 bottom-2 w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                    <span className="font-extrabold text-sm">@</span>
                  </div>
                  <input
                    type="email"
                    placeholder="e-mail address"
                    {...emailForm.register("email")}
                    className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

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
                    <span className="text-black/60 text-sm">Validating...</span>
                  </div>
                ) : (
                  <>
                    <span className="tracking-tight">Next Step</span>
                    <ChevronRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        );

      case "otp":
        return (
          <motion.div
            key="step-otp"
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
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Verify OTP</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">Sent to {email}</p>
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
                    <span className="text-black/60 text-sm">Verifying...</span>
                  </div>
                ) : (
                  <>
                    <span className="tracking-tight">Verify Code</span>
                    <ChevronRight size={20} strokeWidth={3} />
                  </>
                )}
              </button>

              <button className="text-[11px] font-bold text-gray-400 hover:text-black border-b border-transparent hover:border-gray-200 pb-0.5 transition-all">
                Resend code in 45s
              </button>
            </div>
          </motion.div>
        );

      case "info":
        return (
          <motion.div
            key="step-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="mb-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Profile Details</h1>
              <p className="text-gray-400 font-medium text-sm mt-2 italic">Tell us a bit more about yourself.</p>
            </div>

            <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="pb-4">
              <div className="space-y-3">
                {/* Full Name Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <User size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="text"
                      placeholder="full name"
                      {...infoForm.register("fullName")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {infoForm.formState.errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{infoForm.formState.errors.fullName.message}</p>}
                </div>

                {/* Phone Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <Phone size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="tel"
                      placeholder="phone number"
                      {...infoForm.register("phoneNumber")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {infoForm.formState.errors.phoneNumber && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{infoForm.formState.errors.phoneNumber.message}</p>}
                </div>

                {/* DOB Capsule - COMPLETELY IDENTICAL UI */}
                <div className="space-y-2">
                  <EatzyMobileDatePicker
                    value={infoForm.watch("dateOfBirth")}
                    onChange={(date) => infoForm.setValue("dateOfBirth", date, { shouldValidate: true })}
                    placeholder="birth date (optional)"
                    error={infoForm.formState.errors.dateOfBirth?.message}
                  />
                </div>

                {/* Password Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <Key size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="password"
                      placeholder="password"
                      {...infoForm.register("password")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {infoForm.formState.errors.password && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{infoForm.formState.errors.password.message}</p>}
                </div>

                {/* Confirm Password Capsule */}
                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 box-content">
                      <Key size={16} strokeWidth={3} />
                    </div>
                    <input
                      type="password"
                      placeholder="confirm password"
                      {...infoForm.register("confirmPassword")}
                      className="w-full h-[60px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
                    />
                  </div>
                  {infoForm.formState.errors.confirmPassword && (
                    <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{infoForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isLoading || !infoForm.formState.isValid}
                  className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !infoForm.formState.isValid)
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span className="text-black/60 text-sm">Creating Account...</span>
                    </div>
                  ) : (
                    <>
                      <span className="tracking-tight">Complete Sign up</span>
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
            key="step-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 space-y-8"
          >
            <div className="w-24 h-24 bg-lime-500 rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(120,200,65,0.3)]">
              <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Perfect!</h1>
              <p className="text-gray-400 font-medium italic">Your account is ready for culinary exploration.</p>
            </div>

            <button
              onClick={() => router.push("/home")}
              className="w-full h-16 bg-black text-white rounded-full font-black text-lg shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:bg-zinc-800 transition-all active:scale-95"
            >
              Start Exploring Now
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      key="register-drawer"
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
