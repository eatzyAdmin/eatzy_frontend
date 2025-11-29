"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "@repo/ui/icons";
import { useState, useEffect } from "react";
import type { OnboardingStepId } from "../types";

export default function TermsSubmitStep() {
  const router = useRouter();
  const { show, hide } = useLoading();
  const { data, setField, setStepById, setStepValid } = useOnboardingStore();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const updateAccepted = (v: boolean) => setField("hasAcceptedTerms", v);
  const updateAccuracy = (v: boolean) => setField("hasConfirmedAccuracy", v);
  const allChecked = !!data.hasAcceptedTerms && !!data.hasConfirmedAccuracy;
  useEffect(() => {
    setStepValid("terms_submit", allChecked);
  }, [allChecked, setStepValid]);

  const validateAndSubmit = () => {
    const missing: Array<{ step: string; field: string }> = [];
    const pushMissing = (step: string, field: string, ok: boolean) => { if (!ok) missing.push({ step, field }); };
    pushMissing('otp', 'email', !!data.email);
    pushMissing('personal', 'fullName', !!data.fullName);
    pushMissing('personal', 'dob', !!data.dob);
    pushMissing('personal', 'address', !!data.address);
    pushMissing('personal', 'city', !!data.city);
    pushMissing('kyc', 'idType', !!data.idType);
    pushMissing('kyc', 'idNumber', !!data.idNumber);
    pushMissing('kyc', 'idFrontImageUrl', !!data.idFrontImageUrl);
    pushMissing('kyc', 'idBackImageUrl', !!data.idBackImageUrl);
    pushMissing('license', 'driverLicenseNumber', !!data.driverLicenseNumber);
    pushMissing('license', 'driverLicenseClass', !!data.driverLicenseClass);
    pushMissing('vehicle', 'plateNumber', !!data.plateNumber);
    pushMissing('vehicle', 'registrationImageUrl', !!data.registrationImageUrl);
    pushMissing('vehicle', 'insuranceImageUrl', !!data.insuranceImageUrl);
    pushMissing('bank_tax', 'bankAccountNumber', !!data.bankAccountNumber);

    if (missing.length > 0) {
      const first = missing[0];
      setStepById(first.step as OnboardingStepId);
      setErrorMsg(`Vui lòng điền đầy đủ mục: ${first.step} / ${first.field}`);
      show(`Thiếu thông tin: ${first.field}`);
      setTimeout(() => hide(), 1500);
      return;
    }
    show('Đang gửi hồ sơ...');
    setField('submittedAt', new Date().toISOString());
    setField('applicationStatus', 'PENDING_REVIEW');
    setTimeout(() => { router.push('/pending-review'); }, 300);
  };
  return (
    <div className="p-6 space-y-4">
      <div className="text-lg font-semibold text-gray-900">Đồng ý điều khoản & gửi hồ sơ</div>
      {errorMsg && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">{errorMsg}</div>
      )}
      <div className="rounded-2xl border p-4 text-sm text-gray-700">
        <div className="font-semibold mb-2">Tóm tắt</div>
        <div>Vui lòng kiểm tra lại thông tin trước khi gửi.</div>
      </div>
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input type="checkbox" checked={!!data.hasConfirmedAccuracy} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccuracy(e.target.checked)} className="w-4 h-4" />
        <span>Tôi cam kết thông tin là chính xác</span>
      </label>
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input type="checkbox" checked={!!data.hasAcceptedTerms} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccepted(e.target.checked)} className="w-4 h-4" />
        <span>Tôi đồng ý với Điều khoản & Chính sách của Eatzy Driver</span>
      </label>
      <button disabled={!allChecked} onClick={validateAndSubmit} className={`w-full h-12 rounded-xl text-white flex items-center justify-center gap-2 ${allChecked ? 'bg-[var(--primary)]' : 'bg-gray-300'}`}>
        {allChecked ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        Gửi hồ sơ
      </button>
    </div>
  );
}
