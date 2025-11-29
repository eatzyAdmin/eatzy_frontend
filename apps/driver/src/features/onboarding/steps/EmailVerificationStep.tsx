"use client";

import { useState } from "react";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, CheckCircle } from "@repo/ui/icons";
import { FloatingLabelInput } from "@repo/ui";
import OTPInput from "../components/OTPInput";
import ProgressBar from "../components/ProgressBar";
import { emailVerificationSchema, type EmailVerificationData } from "../schemas/onboardingSchema";
import { useOnboardingStore } from "../store/useOnboardingStore";

type SubStep = "email" | "otp" | "success";

export default function EmailVerificationStep() {
  const { setField, back, setStepValid, setStepById } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState<SubStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const emailForm = useForm<EmailVerificationData>({ resolver: zodResolver(emailVerificationSchema), mode: "onChange" });

  const handleEmailSubmit = async (data: EmailVerificationData) => {
    setIsLoading(true);
    setEmail(data.email);
    setField("email", data.email);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setCurrentStep("otp");
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) { setOtpError("Vui lòng nhập đầy đủ 6 số OTP"); return; }
    setIsLoading(true);
    setOtpError("");
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (otp) {
      setField("otpCode", otp);
      setField("isPhoneVerified", true);
      setStepValid("otp", true);
      setIsLoading(false);
      setCurrentStep("success");
    } else {
      setIsLoading(false);
      setOtpError("Mã OTP không chính xác");
    }
  };

  const getStepNumber = () => currentStep === "email" || currentStep === "otp" ? 1 : 2;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-lime-50 flex flex-col">
      <div className="w-full px-6 py-6">
        <button onClick={back} className="flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors duration-200 group">
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1 duration-200" />
          <span className="font-medium">Quay lại</span>
        </button>
      </div>
      <div className="px-6 py-4">
        <ProgressBar currentStep={getStepNumber()} totalSteps={2} steps={["Xác thực Email", "Hoàn thiện hồ sơ"]} />
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {currentStep === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center">
                    <Mail size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Xác thực tài xế</h2>
                  <p className="text-gray-600">Nhập email của bạn để bắt đầu</p>
                </div>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
                  <FloatingLabelInput label="Email" type="email" value={emailForm.watch("email")} error={emailForm.formState.errors.email?.message} {...emailForm.register("email")} />
                  <button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang gửi OTP...</span>
                      </div>
                    ) : (
                      "Tiếp tục"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
            {currentStep === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.1, type: "spring", stiffness: 200 }} className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center">
                    <Mail size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Xác thực Email</h2>
                  <p className="text-gray-600">Mã OTP đã được gửi đến <span className="font-semibold text-[var(--primary)]">{email}</span></p>
                  <button onClick={() => setCurrentStep("email")} className="mt-2 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">Thay đổi email</button>
                </div>
                <div className="space-y-6">
                  <OTPInput length={6} value={otp} onChange={setOtp} error={otpError} />
                  <div className="text-center text-sm text-gray-600">Không nhận được mã? <button className="text-[var(--primary)] font-semibold hover:underline">Gửi lại</button></div>
                  <button onClick={handleOTPVerify} disabled={isLoading || otp.length !== 6} className="w-full h-14 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Đang xác thực...</span>
                      </div>
                    ) : (
                      "Xác nhận"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
            {currentStep === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                </motion.div>
                <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-bold text-gray-900 mb-3">Thành công!</motion.h2>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-gray-600 mb-8">Email đã xác thực, tiếp tục hoàn thiện hồ sơ</motion.p>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setStepById("personal")}
                  className="px-8 py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-semibold rounded-full hover:shadow-lg active:scale-[0.98] transition-all duration-200"
                >
                  Tiếp tục hoàn thiện hồ sơ
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
