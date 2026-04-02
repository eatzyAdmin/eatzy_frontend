"use client";
import UploadCard from "../components/UploadCard";
import { BadgeCheck, FileText, Calendar } from "@repo/ui/icons";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm, zodResolver } from "@repo/lib/form";
import { licenseSchema, type LicenseData } from "../schemas/forms";
import type { DriverOnboardingData } from "../types";
import { useEffect } from "react";
import AuthInput from "../../auth/components/AuthInput";
import AuthSelect from "../../auth/components/AuthSelect";
import AuthDatePicker from "../../auth/components/AuthDatePicker";

export default function LicenseStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<LicenseData>({
    resolver: zodResolver(licenseSchema),
    mode: "onChange",
    defaultValues: {
      driverLicenseNumber: data.driverLicenseNumber ?? "",
      driverLicenseClass: (data.driverLicenseClass as "A1" | "A2") ?? "A1",
      driverLicenseIssueDate: data.driverLicenseIssueDate ?? "",
      driverLicenseImageUrl: data.driverLicenseImageUrl ?? "",
    },
  });
  
  const w = form.watch();
  
  useEffect(() => {
    setStepValid("license", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);

  return (
    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden outline-none">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-50 flex items-center gap-5 bg-gray-50/20">
        <div className="w-14 h-14 rounded-[22px] bg-purple-100 flex items-center justify-center border-2 border-purple-200 shadow-sm">
          <BadgeCheck className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-2xl font-anton font-bold text-gray-900 uppercase tracking-tight">Driver Permit</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Licensing Protocol</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-8">
        <AuthInput
          label="License Number"
          placeholder="Enter permit ID"
          icon={<FileText size={16} strokeWidth={3} />}
          error={form.formState.errors.driverLicenseNumber?.message}
          {...form.register("driverLicenseNumber", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("driverLicenseNumber", e.target.value) 
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthSelect
            label="License Category"
            placeholder="Select class"
            icon={<BadgeCheck size={16} strokeWidth={3} />}
            options={["A1", "A2"]}
            value={(w.driverLicenseClass as string) ?? undefined}
            onChange={(v: string) => {
              form.setValue("driverLicenseClass", v as "A1" | "A2", { shouldValidate: true });
              setField("driverLicenseClass", v as DriverOnboardingData["driverLicenseClass"]);
            }}
          />
          
          <AuthDatePicker
            label="Issue Date"
            placeholder="YYYY-MM-DD"
            icon={<Calendar size={16} strokeWidth={3} />}
            value={w.driverLicenseIssueDate}
            onChange={(v) => {
              form.setValue("driverLicenseIssueDate", v, { shouldValidate: true });
              setField("driverLicenseIssueDate", v);
            }}
            error={form.formState.errors.driverLicenseIssueDate?.message}
          />
        </div>

        {/* Upload Section */}
        <div className="pt-4 space-y-6">
           <div className="flex items-center gap-4 mb-2">
            <h4 className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Permit Verification</h4>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
             <UploadCard 
              label="Driver License Scan" 
              value={w.driverLicenseImageUrl} 
              onChange={(u) => { 
                form.setValue("driverLicenseImageUrl", String(u), { shouldValidate: true }); 
                setField("driverLicenseImageUrl", u); 
              }} 
            />
            <p className="mt-4 text-[10px] text-gray-400 text-center font-bold italic px-4 leading-relaxed">Please ensure all text on the license is readable and no flash glares are present.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
