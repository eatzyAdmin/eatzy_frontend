"use client";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { User, Mail, Calendar, MapPin, Building2 as City } from "@repo/ui/icons";
import { useForm, zodResolver } from "@repo/lib/form";
import { personalSchema, type PersonalData } from "../schemas/forms";
import { VN_PROVINCES } from "../data/vn";
import { useEffect } from "react";
import AuthInput from "../../auth/components/AuthInput";
import AuthSelect from "../../auth/components/AuthSelect";
import AuthDatePicker from "../../auth/components/AuthDatePicker";

export default function PersonalInfoStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<PersonalData>({
    resolver: zodResolver(personalSchema),
    mode: "onChange",
    defaultValues: {
      fullName: data.fullName ?? "",
      dob: data.dob ?? "",
      gender: (data.gender ?? "male") as "male" | "female" | "other",
      address: data.address ?? "",
      city: data.city ?? "",
    },
  });
  
  const watch = form.watch();
  
  useEffect(() => {
    setStepValid("personal", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);

  return (
    <div className="space-y-10 py-6">
      {/* Header - Transparent Integration */}
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-[32px] bg-lime-100 flex items-center justify-center border-2 border-lime-200 shadow-sm mb-2">
          <User className="w-8 h-8 text-lime-600" />
        </div>
        <div>
          <h3 className="text-4xl font-anton font-bold text-gray-900 uppercase tracking-tight leading-none">Personal Profile</h3>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3 italic">Identity Verification Protocol</p>
        </div>
      </div>

      {/* Form Content - Frameless layout */}
      <div className="space-y-8">
        <AuthInput
          label="Full Legal Name"
          placeholder="As shown on ID"
          icon={<User size={16} strokeWidth={3} />}
          error={form.formState.errors.fullName?.message}
          {...form.register("fullName", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("fullName", e.target.value) 
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AuthDatePicker
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            icon={<Calendar size={16} strokeWidth={3} />}
            value={watch.dob}
            onChange={(v) => {
              form.setValue("dob", v, { shouldValidate: true });
              setField("dob", v);
            }}
            error={form.formState.errors.dob?.message}
          />
          
          <AuthSelect
            label="Gender Identity"
            placeholder="Select gender"
            icon={<User size={16} strokeWidth={3} />}
            options={["Nam", "Nữ", "Khác"]}
            value={(watch.gender === 'male' ? 'Nam' : watch.gender === 'female' ? 'Nữ' : 'Khác')}
            onChange={(v: string) => {
              const g = (v === 'Nam' ? 'male' : v === 'Nữ' ? 'female' : 'other') as "male" | "female" | "other";
              form.setValue("gender", g, { shouldValidate: true });
              setField("gender", g);
            }}
          />
        </div>

        <AuthInput
          label="Residential Address"
          placeholder="Street, District"
          icon={<MapPin size={16} strokeWidth={3} />}
          error={form.formState.errors.address?.message}
          {...form.register("address", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("address", e.target.value) 
          })}
        />

        <AuthSelect
          label="Province / City"
          placeholder="Select operation city"
          icon={<City size={16} strokeWidth={3} />}
          options={VN_PROVINCES}
          value={watch.city || undefined}
          onChange={(v: string) => {
            form.setValue("city", v, { shouldValidate: true });
            setField("city", v);
          }}
          error={form.formState.errors.city?.message}
        />
      </div>
    </div>
  );
}
