"use client";
import { FloatingLabelInput, CustomSelect } from "@repo/ui";
import UploadCard from "../components/UploadCard";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { Wallet } from "@repo/ui/icons";
import { useForm } from "@repo/lib/form";
import { zodResolver } from "@repo/lib/form";
import { bankTaxSchema, type BankTaxData } from "../schemas/forms";
import { VN_BANKS } from "../data/vn";
import { useEffect } from "react";

export default function BankTaxStep() {
  const { data, setField, setStepValid } = useOnboardingStore();
  const form = useForm<BankTaxData>({
    resolver: zodResolver(bankTaxSchema),
    mode: "onChange",
    defaultValues: {
      bankName: data.bankName ?? "",
      bankAccountName: data.bankAccountName ?? "",
      bankAccountNumber: data.bankAccountNumber ?? "",
      taxCode: data.taxCode ?? "",
    },
  });
  const w = form.watch();
  useEffect(() => {
    setStepValid("bank_tax", !!form.formState.isValid);
  }, [form.formState.isValid, setStepValid]);
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <Wallet className="w-5 h-5 text-[var(--primary)]" />
        <div>Tài khoản ngân hàng & MST</div>
      </div>
      <CustomSelect label="Tên ngân hàng" options={VN_BANKS} value={w.bankName || undefined} onChange={(v: string) => { form.setValue("bankName", v, { shouldValidate: true }); setField("bankName", v); }} />
      <FloatingLabelInput label="Chi nhánh" value={data.bankBranch ?? ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("bankBranch", e.target.value)} />
      <FloatingLabelInput label="Chủ tài khoản" value={w.bankAccountName} error={form.formState.errors.bankAccountName?.message} {...form.register("bankAccountName", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountName", e.target.value) })} />
      <FloatingLabelInput label="Số tài khoản" value={w.bankAccountNumber} error={form.formState.errors.bankAccountNumber?.message} {...form.register("bankAccountNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountNumber", e.target.value) })} />
      <FloatingLabelInput label="Mã số thuế" value={w.taxCode} error={form.formState.errors.taxCode?.message} {...form.register("taxCode", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("taxCode", e.target.value) })} />
      <UploadCard label="Ảnh đối chiếu (tuỳ chọn)" value={undefined} onChange={() => {}} />
    </div>
  );
}
