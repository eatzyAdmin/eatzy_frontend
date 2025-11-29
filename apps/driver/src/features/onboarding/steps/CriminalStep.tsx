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
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <FileWarning className="w-5 h-5 text-[var(--primary)]" />
        <div>Lý lịch tư pháp</div>
      </div>
      <FloatingLabelInput label="Số LLTP" value={w.criminalRecordNumber} error={form.formState.errors.criminalRecordNumber?.message} {...form.register("criminalRecordNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("criminalRecordNumber", e.target.value) })} />
      <CalendarDatePicker label="Ngày cấp" value={w.criminalRecordIssueDate || null} onChange={(v) => { const val = typeof v === 'string' ? v : (v ? (v as Date).toISOString().slice(0,10) : ''); form.setValue("criminalRecordIssueDate", val, { shouldValidate: true }); setField("criminalRecordIssueDate", val); }} error={form.formState.errors.criminalRecordIssueDate?.message} />
      <UploadCard label="Ảnh/scan LLTP" value={w.criminalRecordImageUrl} onChange={(u) => { form.setValue("criminalRecordImageUrl", String(u), { shouldValidate: true }); setField("criminalRecordImageUrl", u); }} />
    </div>
  );
}
