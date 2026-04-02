"use client";
import { useOnboardingStore, OnboardingProvider } from "../../../features/onboarding/store/useOnboardingStore";
import { ONBOARDING_STEPS } from "../../../features/onboarding/types";
import ProgressStepper from "../../../features/onboarding/components/ProgressStepper";
import ProgressBar from "../../../features/onboarding/components/ProgressBar";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { ChevronRight, ArrowLeft } from "@repo/ui/icons";
import { useRouter } from "next/navigation";
import EmailVerificationStep from "../../../features/onboarding/steps/EmailVerificationStep";
import PersonalInfoStep from "../../../features/onboarding/steps/PersonalInfoStep";
import KycStep from "../../../features/onboarding/steps/KycStep";
import LicenseStep from "../../../features/onboarding/steps/LicenseStep";
import VehicleStep from "../../../features/onboarding/steps/VehicleStep";
import CriminalStep from "../../../features/onboarding/steps/CriminalStep";
import BankTaxStep from "../../../features/onboarding/steps/BankTaxStep";
import TermsSubmitStep from "../../../features/onboarding/steps/TermsSubmitStep";

function OnboardingContent() {
  const router = useRouter();
  const store = useOnboardingStore();
  const { stepIndex, next, back, setStepById, validSteps, isSubmitting, submitApplication } = store;
  const { hide } = useLoading();
  
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  const renderStep = () => {
    const current = ONBOARDING_STEPS[stepIndex]?.id;
    switch (current) {
      case "welcome":
      case "otp":
        return <EmailVerificationStep />;
      case "personal":
        return <PersonalInfoStep />;
      case "kyc":
        return <KycStep />;
      case "license":
        return <LicenseStep />;
      case "vehicle":
        return <VehicleStep />;
      case "criminal":
        return <CriminalStep />;
      case "bank_tax":
        return <BankTaxStep />;
      case "terms_submit":
        return <TermsSubmitStep />;
      case "pending_review":
        return null;
      default:
        return null;
    }
  };

  const otpIdx = ONBOARDING_STEPS.findIndex((x) => x.id === "otp");
  const isAfterOTP = stepIndex > otpIdx;
  const currentStepId = ONBOARDING_STEPS[stepIndex]?.id;
  const isLastStep = currentStepId === 'terms_submit';

  // Check if we are in the "Success/Access Granted" state of EmailVerificationStep
  const isSecuritySuccess = validSteps['otp'] === true;

  const handleBack = () => {
    if (stepIndex === 0) {
      router.push("/register");
    } else {
      back();
    }
  };

  const handleNextAction = () => {
    if (isLastStep) {
      submitApplication(router);
    } else {
      next();
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] flex flex-col">
      {/* Dynamic Header - Match Image 2 for Stage 1, Focused for Stage 2 */}
      <div className="bg-white px-8 py-6 border-b border-gray-50 flex items-center justify-between shadow-sm sticky top-0 z-50">
        {!isAfterOTP ? (
          <>
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-black transition-all group font-extrabold text-xs uppercase tracking-widest"
            >
              <ArrowLeft size={16} strokeWidth={3} className="transition-transform group-hover:-translate-x-1" />
              <span>{stepIndex === 0 ? "Back to Portal" : "Go Back"}</span>
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Drive Eatzy, Earn Easy!</span>
            <div className="text-gray-900 font-extrabold text-xs uppercase tracking-widest leading-none">Partner Onboarding</div>
          </>
        )}
      </div>

      <div className="flex-1 w-full max-w-2xl mx-auto flex flex-col pt-4">
        {/* Universal Progress Area */}
        <div className="px-8 py-6">
          {!isAfterOTP ? (
            <ProgressBar
              currentStep={isSecuritySuccess ? 2 : 1}
              totalSteps={2}
              steps={["Email Check", "Partner Files"]}
            />
          ) : (
            <ProgressStepper
              currentIndex={stepIndex}
              onClickId={(id) => setStepById(id)}
              navHidden={false}
              visibleIds={["personal", "kyc", "license", "vehicle", "criminal", "bank_tax", "terms_submit"]}
            />
          )}
        </div>

        {/* Dynamic Step Content Area - Deep pb-48 for zero footer overlap */}
        <div className="flex-1 px-8 pb-48">
          <AnimatePresence mode="wait">
            <motion.div
              key={ONBOARDING_STEPS[stepIndex]?.id}
              initial={{ opacity: 0, y: isAfterOTP ? 12 : 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: isAfterOTP ? -8 : -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Synchronized Footer - Premium Drawer Elite Style */}
      {isAfterOTP && (
        <div className="fixed bottom-0 left-0 right-0 p-8 pt-6 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-50 flex justify-center shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
          <div className="w-full max-w-md flex items-center gap-4">
            <button
              onClick={back}
              disabled={isSubmitting}
              className="flex-1 h-16 rounded-full bg-gray-100/80 hover:bg-gray-200/80 text-gray-500 font-black text-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              <ArrowLeft size={18} strokeWidth={3} />
              <span className="tracking-tight">Back</span>
            </button>
            <button
              onClick={handleNextAction}
              disabled={!validSteps[currentStepId] || isSubmitting}
              className={`flex-[2] h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${!validSteps[currentStepId] || isSubmitting
                ? "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"
                : "bg-lime-500 text-black hover:bg-lime-400 shadow-[0_15px_40px_rgba(132,204,22,0.3)]"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="text-black/60 text-sm">Transmitting Portfolio...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-tight">{isLastStep ? "Transmit Application" : "Next Step"}</span>
                  <ChevronRight size={22} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <OnboardingProvider>
      <OnboardingContent />
    </OnboardingProvider>
  );
}
