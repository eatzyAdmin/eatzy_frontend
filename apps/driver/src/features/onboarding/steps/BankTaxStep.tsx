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
    <div className="bg-white rounded-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-gray-50/30">
        <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center border border-teal-200">
          <Wallet className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-bold text-[#1A1A1A]">Tài khoản ngân hàng & MST</h3>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Bank Account & Tax</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-5">
        <CustomSelect
          label="Tên ngân hàng"
          options={VN_BANKS}
          value={w.bankName || undefined}
          onChange={(v: string) => {
            form.setValue("bankName", v, { shouldValidate: true });
            setField("bankName", v);
          }}
        />
        <FloatingLabelInput
          label="Chi nhánh"
          value={data.bankBranch ?? ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setField("bankBranch", e.target.value)}
        />
        <FloatingLabelInput
          label="Chủ tài khoản"
          value={w.bankAccountName}
          error={form.formState.errors.bankAccountName?.message}
          {...form.register("bankAccountName", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountName", e.target.value) })}
        />
        <FloatingLabelInput
          label="Số tài khoản"
          value={w.bankAccountNumber}
          error={form.formState.errors.bankAccountNumber?.message}
          {...form.register("bankAccountNumber", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountNumber", e.target.value) })}
        />
        <FloatingLabelInput
          label="Mã số thuế"
          value={w.taxCode}
          error={form.formState.errors.taxCode?.message}
          {...form.register("taxCode", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("taxCode", e.target.value) })}
        />

        {/* Upload Section */}
        <div className="pt-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Upload Document (Optional)</p>
          <UploadCard label="Ảnh đối chiếu (tuỳ chọn)" value={undefined} onChange={() => { }} />
        </div>
      </div>
    </div>
  );
}
