"use client";
import UploadCard from "../components/UploadCard";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { FloatingLabelInput, CustomSelect } from "@repo/ui";
import type { IdType } from "../types";
import { IdCard } from "@repo/ui/icons";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { kycSchema, type KycData } from "../schemas/forms";
import { useEffect } from "react";

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
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <IdCard className="w-5 h-5 text-[var(--primary)]" />
        <div>Giấy tờ tùy thân & Selfie</div>
      </div>
      <CustomSelect label="Loại giấy tờ" options={["CCCD","CMND","PASSPORT"]} value={(w.idType as string) ?? undefined} onChange={(v: string) => { form.setValue("idType", v as IdType, { shouldValidate: true }); setField("idType", v as IdType); }} />
      <FloatingLabelInput label="Số giấy tờ" value={w.idNumber} error={form.formState.errors.idNumber?.message} {...form.register("idNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("idNumber", e.target.value) })} />
      <div className="grid grid-cols-1 gap-4">
        <UploadCard label="Mặt trước" value={w.idFrontImageUrl} onChange={(u) => { form.setValue("idFrontImageUrl", String(u), { shouldValidate: true }); setField("idFrontImageUrl", u); }} />
        <UploadCard label="Mặt sau" value={w.idBackImageUrl} onChange={(u) => { form.setValue("idBackImageUrl", String(u), { shouldValidate: true }); setField("idBackImageUrl", u); }} />
        <UploadCard label="Selfie" value={w.selfieImageUrl} onChange={(u) => { form.setValue("selfieImageUrl", String(u), { shouldValidate: true }); setField("selfieImageUrl", u); }} />
      </div>
    </div>
  );
}
