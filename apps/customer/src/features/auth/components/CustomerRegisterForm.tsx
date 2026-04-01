"use client";

import AuthInput from "./AuthInput";
import { ChevronRight } from "@repo/ui/icons";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

type Props = {
  onLogin?: () => void;
  onSuccess?: () => void;
  onSubmit?: (data: RegisterFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  form: any;
};

export default function CustomerRegisterForm({
  onLogin,
  onSuccess,
  form,
  onSubmit: externalOnSubmit,
  isLoading = false,
  error = null
}: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = form;

  const handleFormSubmit = async (data: RegisterFormData) => {
    if (externalOnSubmit) {
      externalOnSubmit(data);
    } else {
      onSuccess?.();
    }
  };

  return (
    <div className="w-full">
      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100/50 text-red-600 rounded-[24px] text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 font-black text-xs">!</span>
          </div>
          <div className="flex-1">
            <span className="font-bold text-[10px] uppercase tracking-wider text-red-300">Notice</span>
            <p className="font-bold text-red-600 mt-0.5 leading-tight">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
        {/* Input Fields - Clean and Modern */}
        <div className="space-y-4">
          <AuthInput
            label="FULL NAME"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
          />
          <AuthInput
            label="EMAIL ADDRESS"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
          <AuthInput
            label="PASSWORD"
            type="password"
            placeholder="Min. 8 characters"
            error={errors.password?.message}
            autoComplete="new-password"
            {...register("password")}
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
            <button
            type="submit"
            disabled={isLoading || isSubmitting || !isValid}
            className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${
                (isLoading || isSubmitting || !isValid)
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
            }`}
            >
            {isLoading || isSubmitting ? (
                <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="opacity-70">Processing...</span>
                </div>
            ) : (
                <>
                <span className="tracking-tight text-lg">Create Account</span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!isValid ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
                </>
            )}
            </button>
        </div>

        {/* Login Link */}
        <div className="pt-4 text-center">
          <p className="text-sm font-semibold text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLogin}
              className="text-[#1A1A1A] hover:text-lime-600 transition-colors border-b border-black font-bold ml-1"
            >
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
