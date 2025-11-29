"use client";
import { FloatingLabelInput, CustomSelect, CalendarDatePicker } from "@repo/ui";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { User } from "@repo/ui/icons";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { personalSchema, type PersonalData } from "../schemas/forms";
import { VN_PROVINCES } from "../data/vn";
import { useEffect } from "react";

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
    <div className="p-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <User className="w-5 h-5 text-[var(--primary)]" />
        <div>Thông tin cá nhân</div>
      </div>
      <div className="mt-4 space-y-4">
        <FloatingLabelInput label="Họ và tên" value={watch.fullName} error={form.formState.errors.fullName?.message} {...form.register("fullName", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("fullName", e.target.value) })} />
        <CalendarDatePicker label="Ngày sinh" value={watch.dob || null} onChange={(v) => { const val = typeof v === 'string' ? v : (v ? (v as Date).toISOString().slice(0,10) : ''); form.setValue("dob", val, { shouldValidate: true }); setField("dob", val); }} error={form.formState.errors.dob?.message} />
        <CustomSelect label="Giới tính" options={["Nam","Nữ","Khác"]} value={(watch.gender === 'male' ? 'Nam' : watch.gender === 'female' ? 'Nữ' : 'Khác')} onChange={(v: string) => { const g = (v === 'Nam' ? 'male' : v === 'Nữ' ? 'female' : 'other') as "male" | "female" | "other"; form.setValue("gender", g, { shouldValidate: true }); setField("gender", g); }} />
        <FloatingLabelInput label="Địa chỉ" value={watch.address} error={form.formState.errors.address?.message} {...form.register("address", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("address", e.target.value) })} />
        <CustomSelect label="Tỉnh/Thành phố" options={VN_PROVINCES} value={watch.city || undefined} onChange={(v: string) => { form.setValue("city", v, { shouldValidate: true }); setField("city", v); }} />
      </div>
    </div>
  );
}
