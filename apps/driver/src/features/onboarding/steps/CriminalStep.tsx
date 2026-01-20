"use client";
import UploadCard from "../components/UploadCard";
import { FloatingLabelInput, CalendarDatePicker } from "@repo/ui";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { FileWarning } from "@repo/ui/icons";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { criminalSchema, type CriminalData } from "../schemas/forms";
import { useEffect } from "react";

export default function CriminalStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<CriminalData>({
    resolver: zodResolver(criminalSchema),
    mode: "onChange",
    defaultValues: {
      criminalRecordNumber: data.criminalRecordNumber ?? "",
      criminalRecordIssueDate: data.criminalRecordIssueDate ?? "",
      criminalRecordImageUrl: data.criminalRecordImageUrl ?? "",
    },
  });
  const w = form.watch();
  useEffect(() => {
    setStepValid("criminal", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);

  return (
    <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
        <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center border border-red-200">
          <FileWarning className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="font-bold text-[#1A1A1A]">Lý lịch tư pháp</h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Criminal Record</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-5">
        <FloatingLabelInput
          label="Số LLTP"
          value={w.criminalRecordNumber}
          error={form.formState.errors.criminalRecordNumber?.message}
          {...form.register("criminalRecordNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("criminalRecordNumber", e.target.value) })}
        />
        <CalendarDatePicker
          label="Ngày cấp"
          value={w.criminalRecordIssueDate || null}
          onChange={(v) => {
            const val = typeof v === 'string' ? v : (v ? (v as Date).toISOString().slice(0, 10) : '');
            form.setValue("criminalRecordIssueDate", val, { shouldValidate: true });
            setField("criminalRecordIssueDate", val);
          }}
          error={form.formState.errors.criminalRecordIssueDate?.message}
        />

        {/* Upload Section */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Upload Document</p>
          <UploadCard label="Ảnh/scan LLTP" value={w.criminalRecordImageUrl} onChange={(u) => { form.setValue("criminalRecordImageUrl", String(u), { shouldValidate: true }); setField("criminalRecordImageUrl", u); }} />
        </div>
      </div>
    </div>
  );
}
