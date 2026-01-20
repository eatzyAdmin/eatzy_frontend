"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLoading } from "@repo/ui";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, ShieldCheck, FileText } from "@repo/ui/icons";
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
    <div className="space-y-5">
      {/* Header Card */}
      <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
          <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center border border-lime-200">
            <FileText className="w-5 h-5 text-lime-600" />
          </div>
          <div>
            <h3 className="font-bold text-[#1A1A1A]">Điều khoản & Gửi hồ sơ</h3>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Terms & Submit</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-[20px] flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400">Cảnh báo</span>
                <p className="text-amber-700 font-medium text-sm mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Summary Card */}
          <div className="bg-gray-50 rounded-[20px] p-5 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tóm tắt</p>
            <p className="text-sm text-gray-600 font-medium">Vui lòng kiểm tra lại thông tin trước khi gửi.</p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-[20px] border border-gray-100 hover:border-lime-200 hover:bg-lime-50/30 transition-all">
              <input
                type="checkbox"
                checked={!!data.hasConfirmedAccuracy}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccuracy(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-gray-200 text-lime-500 focus:ring-lime-500 focus:ring-2 cursor-pointer mt-0.5"
              />
              <div>
                <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-lime-700 transition-colors">Tôi cam kết thông tin là chính xác</span>
                <p className="text-xs text-gray-400 mt-1">Mọi thông tin tôi cung cấp là trung thực.</p>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group p-4 rounded-[20px] border border-gray-100 hover:border-lime-200 hover:bg-lime-50/30 transition-all">
              <input
                type="checkbox"
                checked={!!data.hasAcceptedTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccepted(e.target.checked)}
                className="w-5 h-5 rounded-lg border-2 border-gray-200 text-lime-500 focus:ring-lime-500 focus:ring-2 cursor-pointer mt-0.5"
              />
              <div>
                <span className="text-sm font-bold text-[#1A1A1A] group-hover:text-lime-700 transition-colors">Tôi đồng ý với Điều khoản & Chính sách của Eatzy Driver</span>
                <p className="text-xs text-gray-400 mt-1">Bao gồm Chính sách Bảo mật và Điều khoản Sử dụng.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-gradient-to-r from-lime-50 to-white border border-lime-100/50 p-4 rounded-[24px] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-lime-100 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-lime-600" />
        </div>
        <p className="text-xs text-lime-600 leading-relaxed font-medium">
          Thông tin của bạn được bảo mật và chỉ dùng cho mục đích xác minh.
        </p>
      </div>

      {/* Submit Button */}
      <button
        disabled={!allChecked}
        onClick={validateAndSubmit}
        className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${allChecked
            ? 'bg-lime-500 text-[#1A1A1A] hover:bg-lime-400 shadow-lg shadow-lime-500/20 active:scale-[0.98]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
      >
        {allChecked ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        <span className="font-anton text-base uppercase tracking-wider">GỬI HỒ SƠ</span>
      </button>
    </div>
  );
}
