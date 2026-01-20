"use client";

import { useState } from "react";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, CheckCircle, ShieldCheck } from "@repo/ui/icons";
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
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col">
      {/* Header - Matching OrderDetailsModal */}
      <div className="bg-white px-6 py-5 border-b border-gray-100 shadow-sm/50">
        <button onClick={back} className="flex items-center gap-2 text-gray-500 hover:text-[#1A1A1A] transition-colors duration-200 group">
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1 duration-200" />
          <span className="text-sm font-bold uppercase tracking-wider">Quay lại</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-5">
        <ProgressBar currentStep={getStepNumber()} totalSteps={2} steps={["Xác thực Email", "Hoàn thiện hồ sơ"]} />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {/* Email Step */}
            {currentStep === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                {/* Header Card */}
                <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 mb-5">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-[20px] bg-lime-100 flex items-center justify-center mb-4 border border-lime-200">
                      <Mail size={28} className="text-lime-600" />
                    </div>
                    <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">XÁC THỰC TÀI XẾ</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2">Nhập email của bạn để bắt đầu</p>
                  </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-5">
                    <FloatingLabelInput label="Email" type="email" value={emailForm.watch("email")} error={emailForm.formState.errors.email?.message} {...emailForm.register("email")} />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-lime-500 text-[#1A1A1A] font-bold rounded-2xl hover:bg-lime-400 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-lime-500/20"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                          <span className="font-anton uppercase tracking-wider">ĐANG GỬI OTP...</span>
                        </div>
                      ) : (
                        <span className="font-anton text-base uppercase tracking-wider">TIẾP TỤC</span>
                      )}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* OTP Step */}
            {currentStep === "otp" && (
              <motion.div key="otp" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }}>
                {/* Header Card */}
                <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 mb-5">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-[20px] bg-lime-100 flex items-center justify-center mb-4 border border-lime-200">
                      <Mail size={28} className="text-lime-600" />
                    </div>
                    <h2 className="text-2xl font-anton font-bold text-[#1A1A1A]">XÁC THỰC EMAIL</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2">
                      Mã OTP đã được gửi đến <span className="font-bold text-lime-600">{email}</span>
                    </p>
                    <button onClick={() => setCurrentStep("email")} className="mt-2 text-xs font-bold text-gray-400 hover:text-lime-600 transition-colors uppercase tracking-wider">
                      Thay đổi email
                    </button>
                  </div>
                </div>

                {/* OTP Form Card */}
                <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                  <div className="space-y-5">
                    <OTPInput length={6} value={otp} onChange={setOtp} error={otpError} />
                    <div className="text-center text-sm text-gray-500 font-medium">
                      Không nhận được mã? <button className="font-bold text-lime-600 hover:underline uppercase tracking-wider">Gửi lại</button>
                    </div>
                    <button
                      onClick={handleOTPVerify}
                      disabled={isLoading || otp.length !== 6}
                      className="w-full h-14 bg-lime-500 text-[#1A1A1A] font-bold rounded-2xl hover:bg-lime-400 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-lg shadow-lime-500/20"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-[#1A1A1A]/30 border-t-[#1A1A1A] rounded-full animate-spin" />
                          <span className="font-anton uppercase tracking-wider">ĐANG XÁC THỰC...</span>
                        </div>
                      ) : (
                        <span className="font-anton text-base uppercase tracking-wider">XÁC NHẬN</span>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success Step */}
            {currentStep === "success" && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, type: "spring" }}>
                <div className="bg-white rounded-[28px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-6 bg-lime-100 rounded-full flex items-center justify-center border-4 border-lime-200"
                  >
                    <CheckCircle size={48} className="text-lime-600" strokeWidth={2.5} />
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-anton font-bold text-[#1A1A1A] mb-3">
                    THÀNH CÔNG!
                  </motion.h2>
                  <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-sm text-gray-500 font-medium mb-8">
                    Email đã xác thực, tiếp tục hoàn thiện hồ sơ
                  </motion.p>

                  {/* Safety Banner */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[20px] flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-lime-600" />
                    </div>
                    <p className="text-xs text-lime-600 leading-relaxed font-medium text-left">
                      Thông tin của bạn được bảo mật tuyệt đối.
                    </p>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={() => setStepById("personal")}
                    className="w-full h-14 bg-lime-500 text-[#1A1A1A] font-bold rounded-2xl hover:bg-lime-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-lime-500/20"
                  >
                    <span className="font-anton text-base uppercase tracking-wider">TIẾP TỤC HOÀN THIỆN HỒ SƠ</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
