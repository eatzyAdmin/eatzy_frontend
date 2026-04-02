"use client";
import { Wallet, Landmark, User, Hash, FileText } from "@repo/ui/icons";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useForm, zodResolver } from "@repo/lib/form";
import { bankTaxSchema, type BankTaxData } from "../schemas/forms";
import { VN_BANKS } from "../data/vn";
import { useEffect } from "react";
import AuthInput from "../../auth/components/AuthInput";
import AuthSelect from "../../auth/components/AuthSelect";
import UploadCard from "../components/UploadCard";

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
    <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden outline-none">
      {/* Header */}
      <div className="px-8 py-8 border-b border-gray-50 flex items-center gap-5 bg-gray-50/20">
        <div className="w-14 h-14 rounded-[22px] bg-teal-100 flex items-center justify-center border-2 border-teal-200 shadow-sm">
          <Wallet className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h3 className="text-2xl font-anton font-bold text-gray-900 uppercase tracking-tight">Payout Protocol</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-0.5 italic">Financial & Tax Details</p>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8 space-y-7">
        <AuthSelect
          label="Banking Institution"
          placeholder="Select verified bank"
          icon={<Landmark size={16} strokeWidth={3} />}
          options={VN_BANKS}
          value={w.bankName || undefined}
          onChange={(v: string) => {
            form.setValue("bankName", v, { shouldValidate: true });
            setField("bankName", v);
          }}
          error={form.formState.errors.bankName?.message}
        />

        <AuthInput
          label="Account Holder Name"
          placeholder="Match with legal name"
          icon={<User size={16} strokeWidth={3} />}
          value={w.bankAccountName}
          error={form.formState.errors.bankAccountName?.message}
          {...form.register("bankAccountName", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountName", e.target.value) 
          })}
        />

        <AuthInput
          label="Bank Account Number"
          placeholder="Enter IBAN / Account ID"
          icon={<Hash size={16} strokeWidth={3} />}
          value={w.bankAccountNumber}
          error={form.formState.errors.bankAccountNumber?.message}
          {...form.register("bankAccountNumber", { 
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("bankAccountNumber", e.target.value) 
          })}
        />

        <div className="pt-2">
            <AuthInput
                label="Partner Tax Code"
                placeholder="Personal Tax ID (MST)"
                icon={<FileText size={16} strokeWidth={3} />}
                value={w.taxCode}
                error={form.formState.errors.taxCode?.message}
                {...form.register("taxCode", { 
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setField("taxCode", e.target.value) 
                })}
            />
        </div>

        {/* Optional Uploads */}
        <div className="pt-6 space-y-4">
           <div className="flex items-center gap-4 mb-2">
            <h4 className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Supplementary Files</h4>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          
          <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100/50">
             <UploadCard 
                label="Bank Statement / Card Photo (Optional)" 
                value={undefined} 
                onChange={() => { }} 
              />
              <div className="bg-teal-50/50 mt-4 p-4 rounded-[20px] border border-teal-100/50">
                 <p className="text-[10px] text-teal-700 font-bold italic text-center px-2">Verifying your payout account ensures faster earnings distribution.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
