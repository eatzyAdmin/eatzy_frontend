"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { AlertTriangle, ShieldCheck, FileText } from "@repo/ui/icons";
import { useEffect } from "react";
import { motion } from "@repo/ui/motion";

export default function TermsSubmitStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  
  const updateAccepted = (v: boolean) => setField("hasAcceptedTerms", v);
  const updateAccuracy = (v: boolean) => setField("hasConfirmedAccuracy", v);
  
  const allChecked = !!data.hasAcceptedTerms && !!data.hasConfirmedAccuracy;
  
  useEffect(() => {
    setStepValid("terms_submit", allChecked);
  }, [allChecked, setStepValid]);

  return (
    <div className="space-y-6 pb-20">
      {/* Header Card */}
      <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden outline-none">
        <div className="px-8 py-8 border-b border-gray-50 flex items-center gap-5 bg-gray-50/20">
          <div className="w-14 h-14 rounded-[22px] bg-lime-100 flex items-center justify-center border-2 border-lime-200 shadow-sm">
            <FileText className="w-6 h-6 text-lime-600" />
          </div>
          <div>
            <h3 className="text-2xl font-anton font-bold text-gray-900 uppercase tracking-tight">Final Protocol</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Affidavit & Submission</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Summary Insights */}
          <div className="bg-gray-50/50 rounded-[32px] p-6 border border-gray-100 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-anton text-gray-400 uppercase tracking-widest">Profile Status</span>
              <span className="text-sm font-bold text-gray-900 mt-0.5 italic">Ready for Fleet Review</span>
            </div>
            <div className="px-4 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-lime-600 uppercase tracking-widest shadow-sm">
               Verified 100%
            </div>
          </div>

          {/* Legal Checkboxes - Premium Styling */}
          <div className="space-y-6">
            <label 
               className={`flex items-start gap-5 cursor-pointer group p-6 rounded-[32px] border transition-all duration-300 ${
                  data.hasConfirmedAccuracy ? 'bg-lime-50/50 border-lime-200' : 'bg-white border-gray-100 hover:border-gray-200'
               }`}
            >
              <div className="relative flex items-center mt-1">
                 <input
                    type="checkbox"
                    checked={!!data.hasConfirmedAccuracy}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccuracy(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-2 border-gray-200 text-lime-500 focus:ring-lime-500/20 focus:ring-4 cursor-pointer transition-all"
                  />
              </div>
              <div className="flex-1">
                <span className="text-base font-bold text-gray-900 group-hover:text-black transition-colors block">Affidavit of Truth</span>
                <p className="text-xs text-gray-400 mt-1 italic font-medium leading-relaxed">I certify that all information provided in this portal is accurate and legally binding.</p>
              </div>
            </label>

            <label 
               className={`flex items-start gap-5 cursor-pointer group p-6 rounded-[32px] border transition-all duration-300 ${
                  data.hasAcceptedTerms ? 'bg-lime-50/50 border-lime-200' : 'bg-white border-gray-100 hover:border-gray-200'
               }`}
            >
              <div className="relative flex items-center mt-1">
                <input
                    type="checkbox"
                    checked={!!data.hasAcceptedTerms}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateAccepted(e.target.checked)}
                    className="w-6 h-6 rounded-lg border-2 border-gray-200 text-lime-500 focus:ring-lime-500/20 focus:ring-4 cursor-pointer transition-all"
                  />
              </div>
              <div className="flex-1">
                <span className="text-base font-bold text-gray-900 group-hover:text-black transition-colors block">Global Partner Terms</span>
                <p className="text-xs text-gray-400 mt-1 italic font-medium leading-relaxed">I have read and agree to Eatzy Fleet&apos;s Privacy Policy and Partner Operating Agreement.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="bg-lime-50/50 border border-lime-100/50 p-6 rounded-[32px] flex items-center gap-5 shadow-[inset_0_0_20px_rgba(120,200,65,0.02)]">
        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-lime-100">
          <ShieldCheck className="w-6 h-6 text-lime-600" />
        </div>
        <p className="text-xs text-lime-700 leading-relaxed font-bold italic">
          Encryption Active: Your partner portfolio is encrypted using AES-256 protocols before being transmitted to our review center.
        </p>
      </div>
    </div>
  );
}
