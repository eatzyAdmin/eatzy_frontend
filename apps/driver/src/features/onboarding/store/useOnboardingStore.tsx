import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { DriverOnboardingData, OnboardingStepId, ONBOARDING_STEPS } from '../types';

type OnboardingState = {
  stepIndex: number;
  data: DriverOnboardingData;
  setField: (key: keyof DriverOnboardingData, value: unknown) => void;
  next: () => void;
  back: () => void;
  setStepById: (id: OnboardingStepId) => void;
  reset: () => void;
  validSteps: Partial<Record<OnboardingStepId, boolean>>;
  setStepValid: (id: OnboardingStepId, valid: boolean) => void;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const initialIdx = Math.max(0, ONBOARDING_STEPS.findIndex((x) => x.id === 'otp'));
  const [stepIndex, setStepIndex] = useState<number>(initialIdx);
  const [data, setData] = useState<DriverOnboardingData>({ driverProfileStatus: 'DRAFT' });
  const [validSteps, setValidSteps] = useState<Partial<Record<OnboardingStepId, boolean>>>({});

  const setField = useCallback((key: keyof DriverOnboardingData, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const next = useCallback(() => setStepIndex((i) => Math.min(i + 1, ONBOARDING_STEPS.length - 1)), []);
  const back = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);
  const setStepById = useCallback((id: OnboardingStepId) => {
    const idx = ONBOARDING_STEPS.findIndex((x) => x.id === id);
    const otpIdx = ONBOARDING_STEPS.findIndex((x) => x.id === 'otp');
    if (id !== 'otp' && !data.isPhoneVerified) {
      setStepIndex(Math.max(0, otpIdx));
      return;
    }
    setStepIndex(Math.max(0, idx));
  }, [data.isPhoneVerified]);
  const setStepValid = useCallback((id: OnboardingStepId, valid: boolean) => {
    setValidSteps((prev) => ({ ...prev, [id]: valid }));
  }, []);
  const reset = useCallback(() => {
    setStepIndex(0);
    setData({ driverProfileStatus: 'DRAFT' });
    setValidSteps({});
  }, []);


  const guardedNext = useCallback(() => {
    const current = ONBOARDING_STEPS[stepIndex]?.id;
    if (current === 'otp' && !data.isPhoneVerified) return;
    if (validSteps[current] !== true) return;
    next();
  }, [stepIndex, data.isPhoneVerified, validSteps, next]);
  const value = useMemo<OnboardingState>(() => ({ stepIndex, data, setField, next: guardedNext, back, setStepById, reset, validSteps, setStepValid }), [stepIndex, data, guardedNext, back, setStepById, reset, setField, validSteps, setStepValid]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboardingStore(): OnboardingState {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboardingStore must be used within OnboardingProvider');
  return ctx;
}
