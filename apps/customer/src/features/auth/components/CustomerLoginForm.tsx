import { useState } from "react";
import AuthInput from "./AuthInput";
import { ChevronRight } from "@repo/ui/icons";

type LoginFormData = { email: string; password: string; rememberMe?: boolean };

type Props = {
  onForgotPassword?: () => void;
  onSuccess?: () => void;
  onRegister?: () => void;
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  form: any;
};

export default function CustomerLoginForm({
  onForgotPassword,
  onSuccess,
  onRegister,
  form,
  onSubmit: externalOnSubmit,
  isLoading = false,
  error = null
}: Props) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting, isValid } } = form;

  const handleFormSubmit = async (data: LoginFormData) => {
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

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
        {/* Input Fields - Clean and Modern */}
        <div className="space-y-4">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
          <div className="space-y-3">
            <AuthInput
              label="Password"
              type="password"
              placeholder="Secure your account"
              error={errors.password?.message}
              autoComplete="current-password"
              {...register("password")}
            />
            <div className="flex justify-end px-2">
              <button
                type="button"
                className="text-[11px] font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors uppercase tracking-widest"
                onClick={onForgotPassword}
              >
                Lost your password?
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button - Sleek modern style */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting || !isValid}
          className={`w-full h-14 rounded-[22px] font-bold transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || isSubmitting || !isValid)
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-[#1A1A1A] text-white hover:bg-black hover:scale-[1.01] hover:shadow-xl hover:shadow-black/10 shadow-[0_15px_30px_rgba(0,0,0,0.1)]"
            }`}
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              <span className="text-black font-bold">Authenticating...</span>
            </div>
          ) : (
            <>
              <span className="tracking-tight text-lg">Continue to Eatzy</span>
              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${!isValid ? 'opacity-30' : 'group-hover:translate-x-1'}`} />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative py-2 opacity-50">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#fafafa] px-6 text-xs font-bold text-gray-300">OR</span>
          </div>
        </div>

        {/* Google Login - Minimal Style */}
        <button
          type="button"
          disabled={isLoading}
          className="w-full h-14 bg-white text-gray-700 font-bold rounded-[22px] border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 group"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-all duration-300 group-hover:scale-110">
            <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10V12.0491H15.4364C15.2 13.2909 14.5091 14.3364 13.4727 15.0545V17.5636H16.7818C18.7091 15.8182 19.8 13.2727 19.8 10.2273Z" fill="#4285F4" />
            <path d="M10 20C12.7 20 14.9636 19.1045 16.7818 17.5636L13.4727 15.0545C12.6091 15.6682 11.4818 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H0.963636V14.4909C2.77273 18.0818 6.10909 20 10 20Z" fill="#34A853" />
            <path d="M4.40455 11.9C4.20455 11.2864 4.09091 10.6364 4.09091 9.97273C4.09091 9.30909 4.20455 8.65909 4.40455 8.04546V5.45455H0.963636C0.29091 6.79091 -0.0909119 8.33636 -0.0909119 9.97273C-0.0909119 11.6091 0.29091 13.1545 0.963636 14.4909L4.40455 11.9Z" fill="#FBBC05" />
            <path d="M10 3.90909C11.6182 3.90909 13.0636 4.46818 14.2091 5.54545L17.1545 2.6C14.9545 0.554545 12.6909 -0.5 10 -0.5C6.10909 -0.5 2.77273 1.41818 0.963636 5.00909L4.40455 7.6C5.19091 5.23636 7.39545 3.90909 10 3.90909Z" fill="#EA4335" />
          </svg>
          <span className="tracking-tight text-gray-600">Continue with Google</span>
        </button>
      </form>

      {/* Register Link */}
      {onRegister && (
        <div className="pt-4 mt-4 text-center">
          <p className="text-sm font-semibold text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              onClick={onRegister}
              className="text-[#1A1A1A] hover:text-lime-600 transition-colors border-b border-black font-bold ml-1"
            >
              Sign Up
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
