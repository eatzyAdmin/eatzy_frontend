"use client";
import UploadCard from "../components/UploadCard";
import { Bike, FileText, Calendar, Hash, ShieldCheck } from "@repo/ui/icons";
import { useOnboardingStore } from "../store/useOnboardingStore";
import type { VehicleType } from "../types";
import { useForm, zodResolver } from "@repo/lib/form";
import { vehicleSchema, type VehicleData } from "../schemas/forms";
import { useEffect } from "react";
import AuthInput from "../../auth/components/AuthInput";
import AuthSelect from "../../auth/components/AuthSelect";

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

  const years = Array.from(
    { length: new Date().getFullYear() - 1989 }, 
    (_, i) => String(1990 + i)
  ).reverse();

  return (
    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden outline-none">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-50 flex items-center gap-5 bg-gray-50/20">
        <div className="w-14 h-14 rounded-[22px] bg-orange-100 flex items-center justify-center border-2 border-orange-200 shadow-sm">
          <Bike className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-2xl font-anton font-bold text-gray-900 uppercase tracking-tight">Fleet Asset</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Vehicle Registration</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-7">
        <AuthSelect
          label="Vehicle Configuration"
          placeholder="Select type"
          icon={<Bike size={16} strokeWidth={3} />}
          options={["Manual", "Scooter", "Electric"]}
          value={(w.vehicleType ? (w.vehicleType === 'MANUAL' ? 'Manual' : w.vehicleType === 'SCOOTER' ? 'Scooter' : 'Electric') : undefined)}
          onChange={(v: string) => {
            const t = (v === 'Manual' ? 'MANUAL' : v === 'Scooter' ? 'SCOOTER' : 'ELECTRIC') as VehicleType;
            form.setValue("vehicleType", t, { shouldValidate: true });
            setField("vehicleType", t);
          }}
          error={form.formState.errors.vehicleType?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthInput 
            label="Manufacturer Brand" 
            placeholder="e.g. Honda, Yamaha"
            icon={<FileText size={16} strokeWidth={3} />}
            value={w.brand} 
            error={form.formState.errors.brand?.message} 
            {...form.register("brand", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("brand", e.target.value) })} 
          />
          <AuthInput 
            label="Model Version" 
            placeholder="e.g. AirBlade, Exciter"
            icon={<FileText size={16} strokeWidth={3} />}
            value={w.model} 
            error={form.formState.errors.model?.message} 
            {...form.register("model", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("model", e.target.value) })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthInput 
            label="License Plate" 
            placeholder="e.g. 59-X1 123.45"
            icon={<Hash size={16} strokeWidth={3} />}
            value={w.plateNumber} 
            error={form.formState.errors.plateNumber?.message} 
            {...form.register("plateNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("plateNumber", e.target.value) })} 
          />
          <AuthSelect 
            label="Manufacture Year" 
            options={years} 
            icon={<Calendar size={16} strokeWidth={3} />}
            value={w.year || undefined} 
            onChange={(v: string) => { 
                form.setValue("year", v, { shouldValidate: true }); 
                setField("year", v); 
            }} 
          />
        </div>

        {/* Upload Section */}
        <div className="pt-6 space-y-6">
           <div className="flex items-center gap-4 mb-2">
            <h4 className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Fleet Documentation</h4>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UploadCard 
              label="Vehicle Registration (Blue card)" 
              value={w.registrationImageUrl} 
              onChange={(u) => { 
                form.setValue("registrationImageUrl", String(u), { shouldValidate: true }); 
                setField("registrationImageUrl", u); 
              }} 
            />
            <UploadCard 
              label="Insurance Document" 
              value={w.insuranceImageUrl} 
              onChange={(u) => { 
                form.setValue("insuranceImageUrl", String(u), { shouldValidate: true }); 
                setField("insuranceImageUrl", u); 
              }} 
            />
            <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50 flex flex-col gap-4">
               <UploadCard 
                label="Full Vehicle Photo (incl. Plate)" 
                value={w.vehiclePhotoUrl} 
                onChange={(u) => { 
                  form.setValue("vehiclePhotoUrl", String(u), { shouldValidate: true }); 
                  setField("vehiclePhotoUrl", u); 
                }} 
              />
              <div className="flex items-center gap-3 px-2">
                 <ShieldCheck size={14} className="text-lime-600" />
                 <p className="text-[10px] text-gray-400 font-bold italic uppercase tracking-wider">Visual asset verification required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
