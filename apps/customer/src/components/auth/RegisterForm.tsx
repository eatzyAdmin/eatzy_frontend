"use client";

import { useState } from "react";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, ArrowLeft, CheckCircle, User } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";
import OTPInput from "./OTPInput";
import ProgressBar from "./ProgressBar";
import EatzyDatePicker from "./EatzyDatePicker";
import {
  emailVerificationSchema,
  userInfoSchema,
  type EmailVerificationData,
  type UserInfoData,
} from "./schemas/registerSchema";
import AuthInput from "@/features/auth/components/AuthInput";
import { ChevronRight } from "@repo/ui/icons";

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
    <div className="w-full h-full flex flex-col pt-0">
      {/* Header with back button */}
      {/* {currentStep !== "success" && (
        <div className="w-full pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors duration-200 group uppercase font-bold text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 duration-200" />
            <span>Go Back</span>
          </button>
        </div>
      )} */}

      {/* Progress Bar */}
      {currentStep !== "success" && (
        <div className="py-2">
          <ProgressBar currentStep={getStepNumber()} totalSteps={2} steps={["Xác thực Email", "Thông tin cá nhân"]} />
        </div>
      )}

      {/* Main Content - Expanded to fill vertical space */}
      <div className="flex-1 flex flex-col justify-start py-8">
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
                  <p className="text-gray-400 font-medium italic">Enter your Email to begin.</p>
                </div>

                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-6">
                  <AuthInput
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !emailForm.formState.isValid}
                    className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !emailForm.formState.isValid)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span className="text-black font-bold">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-tight text-lg">Continue</span>
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!emailForm.formState.isValid ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
                      </>
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
                  <h2 className="text-4xl font-black text-black tracking-tight mb-2">Verification</h2>
                  <p className="text-gray-400 font-medium italic">
                    Sent to <span className="text-black not-italic font-bold">{email}</span>
                  </p>
                  <button
                    onClick={() => setCurrentStep("email")}
                    className="mt-4 text-xs font-bold text-gray-300 hover:text-black uppercase tracking-widest border-b border-transparent hover:border-black transition-all"
                  >
                    Change Email
                  </button>
                </div>

                <div className="space-y-10">
                  <OTPInput length={6} value={otp} onChange={setOtp} error={otpError} />

                  <div className="text-center text-xs font-bold text-gray-300 uppercase tracking-widest">
                    No code?{" "}
                    <button className="text-black hover:text-lime-600 transition-colors ml-2 font-bold border-b border-black/10 hover:border-lime-600">Resend</button>
                  </div>

                  <button
                    onClick={handleOTPVerify}
                    disabled={isLoading || otp.length !== 6}
                    className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || otp.length !== 6)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span className="text-black font-bold">Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-tight text-lg">Confirm Code</span>
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${otp.length !== 6 ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[8px] font-bold text-gray-200 uppercase tracking-[0.3em]">Demo code is 123456</p>
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
                  <h2 className="text-4xl font-black text-black tracking-tight mb-2">Profile Details</h2>
                  <p className="text-gray-400 font-medium italic">Complete your culinary identity.</p>
                </div>

                <form onSubmit={infoForm.handleSubmit(handleInfoSubmit)} className="space-y-6">
                  <AuthInput
                    label="Full Name"
                    type="text"
                    placeholder="Enter your name"
                    error={infoForm.formState.errors.fullName?.message}
                    {...infoForm.register("fullName")}
                  />

                  <EatzyDatePicker
                    label="Birth Date"
                    value={infoForm.watch("dateOfBirth")}
                    onChange={(date) => infoForm.setValue("dateOfBirth", date, { shouldValidate: true })}
                    error={infoForm.formState.errors.dateOfBirth?.message}
                    placeholder="Chọn ngày sinh"
                  />

                  <AuthInput
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    error={infoForm.formState.errors.phoneNumber?.message}
                    {...infoForm.register("phoneNumber")}
                  />

                  <AuthInput
                    label="Create Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    error={infoForm.formState.errors.password?.message}
                    {...infoForm.register("password")}
                  />

                  <AuthInput
                    label="Verify Password"
                    type="password"
                    placeholder="Repeat password"
                    error={infoForm.formState.errors.confirmPassword?.message}
                    {...infoForm.register("confirmPassword")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !infoForm.formState.isValid}
                    className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] mt-10 ${(isLoading || !infoForm.formState.isValid)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                      : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        <span className="text-black font-bold">Processing...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-tight text-lg">Complete Account</span>
                        <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!infoForm.formState.isValid ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
                      </>
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

                <h2 className="text-6xl font-black text-black tracking-tighter mb-4 leading-none uppercase">WELCOME<br /><span className="text-gray-200">ABOARD</span></h2>

                <p className="text-gray-400 font-medium italic text-lg mb-12">
                  Your journey through the world of Eatzy begins now.
                </p>

                <button
                  onClick={onSuccess}
                  className="w-full h-14 bg-[#1A1A1A] text-white font-bold rounded-[22px] hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl flex items-center justify-center gap-3 px-12"
                >
                  <span className="tracking-tight text-lg">Enter Gateway</span>
                  <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

