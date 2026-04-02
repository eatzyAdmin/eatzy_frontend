"use client";

import { useState } from "react";
import { useForm, zodResolver } from "@repo/lib/form";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Mail, CheckCircle, ShieldCheck, ChevronRight } from "@repo/ui/icons";
import AuthInput from "../../auth/components/AuthInput";
import OTPInput from "../../auth/components/OTPInput";
import { emailVerificationSchema, type EmailVerificationData } from "../schemas/onboardingSchema";
import { useOnboardingStore } from "../store/useOnboardingStore";

type SubStep = "email" | "otp" | "success";

export default function EmailVerificationStep() {
  const { setField, setStepValid, setStepById } = useOnboardingStore();
  const [currentStep, setCurrentStep] = useState<SubStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpError, setOtpError] = useState("");

  const emailForm = useForm<EmailVerificationData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: "onChange"
  });

  const handleEmailSubmit = async (data: EmailVerificationData) => {
    setIsLoading(true);
    setEmail(data.email);
    setField("email", data.email);
    await new Promise((resolve) => setTimeout(resolve, 1200));
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
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Success simulation
    setField("otpCode", otp);
    setField("isPhoneVerified", true);
    setStepValid("otp", true);
    setIsLoading(false);
    setCurrentStep("success");
  };

  return (
    <div className="w-full flex items-center justify-center pt-10">
      <div className="w-full">
        <AnimatePresence mode="wait">
          {/* EMAIL INPUT STEP */}
          {currentStep === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[32px] bg-lime-100 flex items-center justify-center mb-6 border-2 border-lime-200 shadow-sm">
                  <Mail size={32} className="text-lime-600" />
                </div>
                <h2 className="text-4xl font-anton font-bold text-gray-900 uppercase tracking-tight leading-none">Fleet Access</h2>
                <p className="text-sm text-gray-400 font-medium mt-3 italic px-4 leading-relaxed">
                  Enter your professional email to begin the partner validation protocol.
                </p>
              </div>

              <div className="w-full">
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
                  <AuthInput
                    label="Partner Email Address"
                    placeholder="e.g. driver@eatzy.com"
                    type="email"
                    icon={<span className="font-extrabold text-sm">@</span>}
                    error={emailForm.formState.errors.email?.message}
                    {...emailForm.register("email")}
                  />

                  <button
                    type="submit"
                    disabled={isLoading || !emailForm.formState.isValid}
                    className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${isLoading
                      ? "bg-gray-100 text-black cursor-not-allowed"
                      : !emailForm.formState.isValid
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                        : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/10"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span className="text-black/60 text-sm">Transmitting...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-tight text-lg">Initialize</span>
                        <ChevronRight size={22} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* OTP VERIFICATION STEP */}
          {currentStep === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              <div className="text-center flex flex-col items-center">

                <p className="text-sm text-gray-400 font-medium mt-3 italic px-2 leading-relaxed">
                  Verification pulse sent to <span className="font-bold text-lime-600 not-italic">{email}</span>
                </p>
                <button
                  onClick={() => setCurrentStep("email")}
                  className="mt-6 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em] border-b border-gray-100 pb-1"
                >
                  Modify Access Email
                </button>
              </div>

              <div className="w-full">
                <div className="space-y-8">
                  <OTPInput value={otp} onChange={setOtp} error={otpError} />

                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-medium italic mb-2">Didn&apos;t receive the pulse?</p>
                    <button className="text-[11px] font-bold text-lime-600 hover:text-lime-700 transition-all tracking-tight border-b border-lime-200/50">Resend Code</button>
                  </div>

                  <button
                    onClick={handleOTPVerify}
                    disabled={isLoading || otp.length !== 6}
                    className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${isLoading
                      ? "bg-gray-100 text-black cursor-not-allowed"
                      : otp.length !== 6
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                        : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/10"
                      }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span className="text-black/60 text-sm">Verifying...</span>
                      </div>
                    ) : (
                      <>
                        <span className="tracking-tight text-lg">Validate Partner</span>
                        <ChevronRight size={22} strokeWidth={3} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SUCCESS CONFIRMATION STEP */}
          {currentStep === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="text-center relative overflow-hidden flex flex-col items-center">
                {/* Decorative Background Icon */}
                <CheckCircle size={200} className="absolute -right-20 -top-20 text-lime-50/50 -rotate-12 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-lime-500 rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-lime-500/30">
                    <CheckCircle size={48} className="text-white" strokeWidth={3} />
                  </div>

                  <h2 className="text-5xl font-anton font-bold text-gray-900 uppercase tracking-tight mb-4 leading-none">ACCESS GRANTED</h2>
                  <p className="text-gray-500 font-medium italic mb-10 px-6 leading-relaxed">
                    Your identity has been verified. You are now authorized to continue with the partner onboarding.
                  </p>

                  <button
                    onClick={() => setStepById("personal")}
                    className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/15`}
                  >
                    <span className="tracking-tight text-lg">Proceed to Profile</span>
                    <ChevronRight size={22} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
