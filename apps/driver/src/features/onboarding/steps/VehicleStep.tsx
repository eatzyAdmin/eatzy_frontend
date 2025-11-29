"use client";
import UploadCard from "../components/UploadCard";
import { FloatingLabelInput, CustomSelect } from "@repo/ui";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { Car } from "@repo/ui/icons";
import type { VehicleType } from "../types";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { vehicleSchema, type VehicleData } from "../schemas/forms";
import { useEffect } from "react";

export default function VehicleStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<VehicleData>({
    resolver: zodResolver(vehicleSchema),
    mode: "onChange",
    defaultValues: {
      vehicleType: (data.vehicleType as VehicleType) ?? "SCOOTER",
      brand: data.brand ?? "",
      model: data.model ?? "",
      plateNumber: data.plateNumber ?? "",
      year: data.year ?? "",
      registrationImageUrl: data.registrationImageUrl ?? "",
      insuranceImageUrl: data.insuranceImageUrl ?? "",
      vehiclePhotoUrl: data.vehiclePhotoUrl ?? "",
    },
  });
  const w = form.watch();
  useEffect(() => {
    setStepValid("vehicle", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);
  const years = Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => String(1900 + i)).reverse();
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Car className="w-5 h-5 text-[var(--primary)]" />
        <div>Thông tin xe</div>
      </div>
      <CustomSelect label="Loại xe" options={["Xe số","Tay ga","Xe điện"]} value={(w.vehicleType ? (w.vehicleType === 'MANUAL' ? 'Xe số' : w.vehicleType === 'SCOOTER' ? 'Tay ga' : 'Xe điện') : undefined)} onChange={(v: string) => { const t = (v === 'Xe số' ? 'MANUAL' : v === 'Tay ga' ? 'SCOOTER' : 'ELECTRIC') as VehicleType; form.setValue("vehicleType", t, { shouldValidate: true }); setField("vehicleType", t); }} />
      <FloatingLabelInput label="Hãng" value={w.brand} error={form.formState.errors.brand?.message} {...form.register("brand", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("brand", e.target.value) })} />
      <FloatingLabelInput label="Model" value={w.model} error={form.formState.errors.model?.message} {...form.register("model", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("model", e.target.value) })} />
      <FloatingLabelInput label="Biển số" value={w.plateNumber} error={form.formState.errors.plateNumber?.message} {...form.register("plateNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("plateNumber", e.target.value) })} />
      <CustomSelect label="Năm sản xuất" options={years} value={w.year || undefined} onChange={(v: string) => { form.setValue("year", v, { shouldValidate: true }); setField("year", v); }} />
      <div className="grid grid-cols-1 gap-4">
        <UploadCard label="Giấy đăng ký xe" value={w.registrationImageUrl} onChange={(u) => { form.setValue("registrationImageUrl", String(u), { shouldValidate: true }); setField("registrationImageUrl", u); }} />
        <UploadCard label="Bảo hiểm" value={w.insuranceImageUrl} onChange={(u) => { form.setValue("insuranceImageUrl", String(u), { shouldValidate: true }); setField("insuranceImageUrl", u); }} />
        <UploadCard label="Ảnh xe & biển số" value={w.vehiclePhotoUrl} onChange={(u) => { form.setValue("vehiclePhotoUrl", String(u), { shouldValidate: true }); setField("vehiclePhotoUrl", u); }} />
      </div>
    </div>
  );
}
