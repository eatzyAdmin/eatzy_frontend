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
    <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
        <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center border border-orange-200">
          <Car className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-[#1A1A1A]">Thông tin xe</h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Vehicle Information</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-5">
        <CustomSelect
          label="Loại xe"
          options={["Xe số", "Tay ga", "Xe điện"]}
          value={(w.vehicleType ? (w.vehicleType === 'MANUAL' ? 'Xe số' : w.vehicleType === 'SCOOTER' ? 'Tay ga' : 'Xe điện') : undefined)}
          onChange={(v: string) => {
            const t = (v === 'Xe số' ? 'MANUAL' : v === 'Tay ga' ? 'SCOOTER' : 'ELECTRIC') as VehicleType;
            form.setValue("vehicleType", t, { shouldValidate: true });
            setField("vehicleType", t);
          }}
        />
        <FloatingLabelInput label="Hãng" value={w.brand} error={form.formState.errors.brand?.message} {...form.register("brand", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("brand", e.target.value) })} />
        <FloatingLabelInput label="Model" value={w.model} error={form.formState.errors.model?.message} {...form.register("model", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("model", e.target.value) })} />
        <FloatingLabelInput label="Biển số" value={w.plateNumber} error={form.formState.errors.plateNumber?.message} {...form.register("plateNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("plateNumber", e.target.value) })} />
        <CustomSelect label="Năm sản xuất" options={years} value={w.year || undefined} onChange={(v: string) => { form.setValue("year", v, { shouldValidate: true }); setField("year", v); }} />

        {/* Upload Section */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Upload Documents</p>
          <div className="grid grid-cols-1 gap-4">
            <UploadCard label="Giấy đăng ký xe" value={w.registrationImageUrl} onChange={(u) => { form.setValue("registrationImageUrl", String(u), { shouldValidate: true }); setField("registrationImageUrl", u); }} />
            <UploadCard label="Bảo hiểm" value={w.insuranceImageUrl} onChange={(u) => { form.setValue("insuranceImageUrl", String(u), { shouldValidate: true }); setField("insuranceImageUrl", u); }} />
            <UploadCard label="Ảnh xe & biển số" value={w.vehiclePhotoUrl} onChange={(u) => { form.setValue("vehiclePhotoUrl", String(u), { shouldValidate: true }); setField("vehiclePhotoUrl", u); }} />
          </div>
        </div>
      </div>
    </div>
  );
}
