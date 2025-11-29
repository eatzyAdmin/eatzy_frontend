"use client";
import UploadCard from "../components/UploadCard";
import { FloatingLabelInput, CustomSelect, CalendarDatePicker } from "@repo/ui";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { BadgeCheck } from "@repo/ui/icons";
import type { DriverOnboardingData } from "../types";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { licenseSchema, type LicenseData } from "../schemas/forms";
import { useEffect } from "react";

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
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <BadgeCheck className="w-5 h-5 text-[var(--primary)]" />
        <div>Bằng lái xe</div>
      </div>
      <FloatingLabelInput label="Số GPLX" value={w.driverLicenseNumber} error={form.formState.errors.driverLicenseNumber?.message} {...form.register("driverLicenseNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("driverLicenseNumber", e.target.value) })} />
      <CustomSelect label="Hạng" options={["A1","A2"]} value={(w.driverLicenseClass as string) ?? undefined} onChange={(v: string) => { form.setValue("driverLicenseClass", v as "A1" | "A2", { shouldValidate: true }); setField("driverLicenseClass", v as DriverOnboardingData["driverLicenseClass"]); }} />
      <CalendarDatePicker label="Ngày cấp" value={w.driverLicenseIssueDate || null} onChange={(v) => { const val = typeof v === 'string' ? v : (v ? (v as Date).toISOString().slice(0,10) : ''); form.setValue("driverLicenseIssueDate", val, { shouldValidate: true }); setField("driverLicenseIssueDate", val); }} error={form.formState.errors.driverLicenseIssueDate?.message} />
      <UploadCard label="Ảnh bằng lái" value={w.driverLicenseImageUrl} onChange={(u) => { form.setValue("driverLicenseImageUrl", String(u), { shouldValidate: true }); setField("driverLicenseImageUrl", u); }} />
    </div>
  );
}
