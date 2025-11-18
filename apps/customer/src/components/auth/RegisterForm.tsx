"use client";

import { useState } from "react";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, CheckCircle, User } from "@repo/ui/icons";
import { FloatingLabelInput, CalendarDatePicker } from "@repo/ui";
import OTPInput from "./OTPInput";
import ProgressBar from "./ProgressBar";
import {
  emailVerificationSchema,
  // otpSchema,
  userInfoSchema,
  type EmailVerificationData,
  // type OTPData,
  type UserInfoData,
} from "./schemas/registerSchema";

interface RegisterFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = "email" | "otp" | "info" | "success";

export default function RegisterForm({ onBack, onSuccess }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Email form
  const emailForm = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: "onChange",
  });

  // User info form
  const infoForm = useForm<UserInfoData>({
    resolver: zodResolver(userInfoSchema),
    mode: "onChange",
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

    // Mock validation - Accept "123456" as correct OTP
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Registration data:", { email, ...data });

    setIsLoading(false);
    setCurrentStep("success");
  };

  const getStepNumber = () => {
    switch (currentStep) {
      case "email":
      case "otp":
        return 1;
      case "info":
        return 2;
      case "success":
        return 2;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex flex-col">
      {/* Header with back button */}
      {currentStep !== "success" && (
        <div className="w-full px-6 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors duration-200 group"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1 duration-200" />
            <span className="font-medium">Quay lại</span>
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {currentStep !== "success" && (
        <div className="px-6 py-4">
          <ProgressBar currentStep={getStepNumber()} totalSteps={2} steps={["Xác thực Email", "Thông tin cá nhân"]} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {currentStep === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center"
                  >
                    <Mail size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
                  <p className="text-gray-600">Nhập email của bạn để bắt đầu</p>
                </div>

                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
                  <FloatingLabelInput
                    label="Email"
                    type="email"
                    value={emailForm.watch("email")}
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang gửi OTP...</span>
                      </div>
                    ) : (
                      "Tiếp tục"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Input */}
            {currentStep === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center"
                  >
                    <Mail size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Xác thực Email</h2>
                  <p className="text-gray-600">
                    Mã OTP đã được gửi đến <span className="font-semibold text-[var(--primary)]">{email}</span>
                  </p>
                  <button
                    onClick={() => setCurrentStep("email")}
                    className="mt-2 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors"
                  >
                    Thay đổi email
                  </button>
                </div>

                <div className="space-y-6">
                  <OTPInput length={6} value={otp} onChange={setOtp} error={otpError} />

                  <div className="text-center text-sm text-gray-600">
                    Không nhận được mã?{" "}
                    <button className="text-[var(--primary)] font-semibold hover:underline">Gửi lại</button>
                  </div>

                  <button
                    onClick={handleOTPVerify}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang xác thực...</span>
                      </div>
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>

                <p className="mt-6 text-center text-xs text-gray-500">Mã OTP test: 123456</p>
              </motion.div>
            )}

            {/* Step 3: User Info */}
            {currentStep === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center"
                  >
                    <User size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h2>
                  <p className="text-gray-600">Hoàn tất thông tin để tạo tài khoản</p>
                </div>

                <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="space-y-5">
                  <FloatingLabelInput
                    label="Họ và tên"
                    type="text"
                    value={infoForm.watch("fullName")}
                    error={infoForm.formState.errors.fullName?.message}
                    {...infoForm.register("fullName")}
                  />

                  <CalendarDatePicker
                    label="Ngày sinh"
                    value={infoForm.watch("dateOfBirth")}
                    onChange={(date) => infoForm.setValue("dateOfBirth", date as string, { shouldValidate: true })}
                    error={infoForm.formState.errors.dateOfBirth?.message}
                    placeholder="DD/MM/YYYY"
                    allowFutureDates={false}
                    required
                  />

                  <FloatingLabelInput
                    label="Số điện thoại"
                    type="tel"
                    value={infoForm.watch("phoneNumber")}
                    error={infoForm.formState.errors.phoneNumber?.message}
                    {...infoForm.register("phoneNumber")}
                  />

                  <FloatingLabelInput
                    label="Mật khẩu"
                    type="password"
                    value={infoForm.watch("password")}
                    error={infoForm.formState.errors.password?.message}
                    {...infoForm.register("password")}
                  />

                  <FloatingLabelInput
                    label="Xác nhận mật khẩu"
                    type="password"
                    value={infoForm.watch("confirmPassword")}
                    error={infoForm.formState.errors.confirmPassword?.message}
                    {...infoForm.register("confirmPassword")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang tạo tài khoản...</span>
                      </div>
                    ) : (
                      "Hoàn tất đăng ký"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Success Screen */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold text-gray-900 mb-3"
                >
                  Chúc mừng!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-8"
                >
                  Tài khoản của bạn đã được tạo thành công
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={onSuccess}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                  Đăng nhập ngay
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

