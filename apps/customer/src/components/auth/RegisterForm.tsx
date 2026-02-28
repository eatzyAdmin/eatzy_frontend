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
    <div className="w-full h-full flex flex-col pt-4">
      {/* Header with back button */}
      {currentStep !== "success" && (
        <div className="w-full pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-200 group uppercase font-anton text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 duration-200" />
            <span>Quay lại</span>
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {currentStep !== "success" && (
        <div className="py-2">
          <ProgressBar currentStep={getStepNumber()} totalSteps={2} steps={["Xác thực Email", "Thông tin cá nhân"]} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-4">
        <div className="w-full">
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
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-6 bg-lime-500 rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(163,230,53,0.2)]"
                  >
                    <Mail size={32} className="text-black" />
                  </motion.div>
                  <h2 className="text-4xl font-anton text-black uppercase tracking-tight mb-2">Registration</h2>
                  <p className="text-gray-400 font-medium italic">Enter your professional email to begin.</p>
                </div>

                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
                  <FloatingLabelInput
                    label="Business Email"
                    type="email"
                    value={emailForm.watch("email")}
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 bg-black text-white font-anton text-base font-bold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 uppercase tracking-[0.2em]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: OTP Input */}
            {currentStep === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-6 bg-black rounded-[32px] flex items-center justify-center shadow-2xl"
                  >
                    <Mail size={32} className="text-lime-500" />
                  </motion.div>
                  <h2 className="text-4xl font-anton text-black uppercase tracking-tight mb-2">Verification</h2>
                  <p className="text-gray-400 font-medium italic">
                    Sent to <span className="text-black not-italic font-bold">{email}</span>
                  </p>
                  <button
                    onClick={() => setCurrentStep("email")}
                    className="mt-4 text-[10px] font-anton text-gray-300 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black transition-all"
                  >
                    Change Email
                  </button>
                </div>

                <div className="space-y-10">
                  <OTPInput length={6} value={otp} onChange={setOtp} error={otpError} />

                  <div className="text-center text-[10px] font-anton text-gray-300 uppercase tracking-widest">
                    No code?{" "}
                    <button className="text-black hover:text-lime-600 transition-colors ml-2 font-bold">Resend</button>
                  </div>

                  <button
                    onClick={handleOTPVerify}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-16 bg-lime-500 text-black font-anton text-base font-bold rounded-2xl hover:bg-lime-400 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(163,230,53,0.2)]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Confirm Code"
                    )}
                  </button>
                  <p className="text-center text-[8px] font-anton text-gray-200 uppercase tracking-[0.3em]">Demo code is 123456</p>
                </div>
              </motion.div>
            )}

            {/* Step 3: User Info */}
            {currentStep === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 mx-auto mb-6 bg-lime-500 rounded-[32px] flex items-center justify-center shadow-xl"
                  >
                    <User size={32} className="text-black" />
                  </motion.div>
                  <h2 className="text-4xl font-anton text-black uppercase tracking-tight mb-2">Profile Details</h2>
                  <p className="text-gray-400 font-medium italic">Complete your culinary identity.</p>
                </div>

                <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="space-y-6">
                  <FloatingLabelInput
                    label="Full Name"
                    type="text"
                    value={infoForm.watch("fullName")}
                    error={infoForm.formState.errors.fullName?.message}
                    {...infoForm.register("fullName")}
                  />

                  <CalendarDatePicker
                    label="Birth Date"
                    value={infoForm.watch("dateOfBirth")}
                    onChange={(date) => infoForm.setValue("dateOfBirth", date as string, { shouldValidate: true })}
                    error={infoForm.formState.errors.dateOfBirth?.message}
                    placeholder="DD/MM/YYYY"
                    allowFutureDates={false}
                    required
                  />

                  <FloatingLabelInput
                    label="Phone Number"
                    type="tel"
                    value={infoForm.watch("phoneNumber")}
                    error={infoForm.formState.errors.phoneNumber?.message}
                    {...infoForm.register("phoneNumber")}
                  />

                  <FloatingLabelInput
                    label="Create Password"
                    type="password"
                    value={infoForm.watch("password")}
                    error={infoForm.formState.errors.password?.message}
                    {...infoForm.register("password")}
                  />

                  <FloatingLabelInput
                    label="Verify Password"
                    type="password"
                    value={infoForm.watch("confirmPassword")}
                    error={infoForm.formState.errors.confirmPassword?.message}
                    {...infoForm.register("confirmPassword")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 bg-black text-white font-anton text-base font-bold rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 mt-10 uppercase tracking-[0.2em]"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Complete Account"
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Success Screen */}
            {currentStep === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-10"
              >
                <motion.div
                  initial={{ rotate: -45, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-32 h-32 mx-auto mb-10 bg-lime-500 rounded-[48px] flex items-center justify-center shadow-[0_30px_60px_rgba(163,230,53,0.3)]"
                >
                  <CheckCircle size={64} className="text-black" strokeWidth={1.5} />
                </motion.div>

                <h2 className="text-6xl font-anton text-black uppercase tracking-tighter mb-4 leading-none">WELCOME<br /><span className="text-gray-200">ABOARD</span></h2>

                <p className="text-gray-400 font-medium italic text-lg mb-12">
                  Your journey through the world of Eatzy begins now.
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSuccess}
                  className="px-12 h-16 bg-black text-white font-anton text-base font-bold rounded-2xl hover:bg-gray-800 transition-all uppercase tracking-[0.2em] shadow-2xl"
                >
                  Enter Gateway
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

