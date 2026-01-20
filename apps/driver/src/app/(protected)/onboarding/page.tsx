"use client";
import { useOnboardingStore, OnboardingProvider } from "../../../features/onboarding/store/useOnboardingStore";
import { ONBOARDING_STEPS } from "../../../features/onboarding/types";
import ProgressStepper from "../../../features/onboarding/components/ProgressStepper";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { useEffect } from "react";
import { useLoading } from "@repo/ui";
import { Button } from "@repo/ui";
import EmailVerificationStep from "../../../features/onboarding/steps/EmailVerificationStep";
import PersonalInfoStep from "../../../features/onboarding/steps/PersonalInfoStep";
import KycStep from "../../../features/onboarding/steps/KycStep";
import LicenseStep from "../../../features/onboarding/steps/LicenseStep";
import VehicleStep from "../../../features/onboarding/steps/VehicleStep";
import CriminalStep from "../../../features/onboarding/steps/CriminalStep";
import BankTaxStep from "../../../features/onboarding/steps/BankTaxStep";
import TermsSubmitStep from "../../../features/onboarding/steps/TermsSubmitStep";

function OnboardingContent() {
  const store = useOnboardingStore();
  const { stepIndex, next, back, setStepById } = store;
  const { hide } = useLoading();
  useEffect(() => {
    const t = setTimeout(() => hide(), 1500);
    return () => clearTimeout(t);
  }, [hide]);

  const renderStep = () => {
    const current = ONBOARDING_STEPS[stepIndex]?.id;
    switch (current) {
      case "welcome":
        return <EmailVerificationStep />;
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
  const isStep2 = stepIndex > otpIdx;

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA]">
      <div className="max-w-md mx-auto p-4 pt-6">
        {isStep2 ? (
          <>
            {/* Progress Stepper */}
            <ProgressStepper
              currentIndex={stepIndex}
              onClickId={(id) => setStepById(id)}
              navHidden={false}
              visibleIds={["personal", "kyc", "license", "vehicle", "criminal", "bank_tax", "terms_submit"]}
            />

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={ONBOARDING_STEPS[stepIndex]?.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="mt-4"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={ONBOARDING_STEPS[stepIndex]?.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom Navigation - Matching OrderCard/OrderDetailsModal style */}
        {isStep2 && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="max-w-md mx-auto flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-2xl h-14 font-bold border-4 border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 text-[#1A1A1A] transition-all duration-300"
                onClick={back}
              >
                <span className="text-sm">Quay lại</span>
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="flex-1 rounded-2xl h-14 font-bold bg-lime-500 hover:bg-lime-400 text-[#1A1A1A] shadow-lg shadow-lime-500/20 transition-all duration-300 disabled:opacity-50"
                disabled={!store.validSteps[ONBOARDING_STEPS[stepIndex]?.id]}
                onClick={next}
              >
                <span className="font-anton text-base uppercase tracking-wider">KẾ TIẾP</span>
              </Button>
            </div>
          </div>
        )}
      </div>
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
