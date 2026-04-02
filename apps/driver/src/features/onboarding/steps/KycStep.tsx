"use client";
import UploadCard from "../components/UploadCard";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { IdCard, ShieldCheck } from "@repo/ui/icons";
import { useForm, zodResolver } from "@repo/lib/form";
import { kycSchema, type KycData } from "../schemas/forms";
import type { IdType } from "../types";
import { useEffect } from "react";
import AuthInput from "../../auth/components/AuthInput";
import AuthSelect from "../../auth/components/AuthSelect";

export default function KycStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<KycData>({
    resolver: zodResolver(kycSchema),
    mode: "onChange",
    defaultValues: {
      idType: (data.idType as IdType) ?? "CCCD",
      idNumber: data.idNumber ?? "",
      idFrontImageUrl: data.idFrontImageUrl ?? "",
      idBackImageUrl: data.idBackImageUrl ?? "",
      selfieImageUrl: data.selfieImageUrl ?? "",
    },
  });
  
  const w = form.watch();
  
  useEffect(() => {
    setStepValid("kyc", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);

  return (
    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden outline-none">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-50 flex items-center gap-5 bg-gray-50/20">
        <div className="w-14 h-14 rounded-[22px] bg-sky-100 flex items-center justify-center border-2 border-sky-200 shadow-sm">
          <IdCard className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h3 className="text-2xl font-anton font-bold text-gray-900 uppercase tracking-tight">Identity Vault</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Government Documents</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-8">
        <AuthSelect
          label="Document Protocol"
          placeholder="Select document type"
          icon={<ShieldCheck size={16} strokeWidth={3} />}
          options={["CCCD", "CMND", "PASSPORT"]}
          value={(w.idType as string) ?? undefined}
          onChange={(v: string) => {
            form.setValue("idType", v as IdType, { shouldValidate: true });
            setField("idType", v as IdType);
          }}
          error={form.formState.errors.idType?.message}
        />
        
        <AuthInput
          label="Identity Number"
          placeholder="Enter document ID"
          icon={<IdCard size={16} strokeWidth={3} />}
          error={form.formState.errors.idNumber?.message}
          {...form.register("idNumber", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("idNumber", e.target.value) 
          })}
        />

        {/* Upload Section - Matching Premium Drawer Aesthetics */}
        <div className="pt-4 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <h4 className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Encrypted Uploads</h4>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UploadCard 
              label="Front of Document" 
              value={w.idFrontImageUrl} 
              onChange={(u) => { 
                form.setValue("idFrontImageUrl", String(u), { shouldValidate: true }); 
                setField("idFrontImageUrl", u); 
              }} 
            />
            <UploadCard 
              label="Back of Document" 
              value={w.idBackImageUrl} 
              onChange={(u) => { 
                form.setValue("idBackImageUrl", String(u), { shouldValidate: true }); 
                setField("idBackImageUrl", u); 
              }} 
            />
            <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
               <UploadCard 
                label="Selfie Verification" 
                value={w.selfieImageUrl} 
                onChange={(u) => { 
                  form.setValue("selfieImageUrl", String(u), { shouldValidate: true }); 
                  setField("selfieImageUrl", u); 
                }} 
              />
              <p className="mt-4 text-[10px] text-gray-400 text-center font-bold italic">Make sure your face is clearly visible with neutral lighting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
