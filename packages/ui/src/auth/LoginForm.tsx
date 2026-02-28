"use client";

import { useState } from "react";
import FloatingLabelInput from "../forms/FloatingLabelInput";
type LoginFormData = { email: string; password: string; rememberMe?: boolean };
import { Layers } from "../icons";

type Props = {
  onForgotPassword?: () => void;
  onSuccess?: () => void;
  onRegister?: () => void;
  onSubmit?: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
  form: any;
};

export default function LoginForm({
  onForgotPassword,
  onSuccess,
  onRegister,
  form,
  onSubmit: externalOnSubmit,
  isLoading = false,
  error = null
}: Props) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const rememberMeValue = watch("rememberMe");

  const handleFormSubmit = async (data: LoginFormData) => {
    if (externalOnSubmit) {
      externalOnSubmit(data);
    } else {
      console.log("Login data:", data);
      onSuccess?.();
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
  };

  return (
    <div className="w-full">
      {/* Error Message Display - Matching OrderDetailsModal style */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-100 text-red-600 rounded-[20px] text-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 font-bold text-xs">!</span>
          </div>
          <div>
            <span className="font-bold text-xs uppercase tracking-wider text-red-400">Lỗi</span>
            <p className="text-red-600 font-medium mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-6">
        {/* Input Fields - Clean and minimal */}
        <div className="space-y-4">
          <FloatingLabelInput
            label="Email Address"
            type="email"
            value={emailValue}
            error={errors.email?.message}
            autoComplete="email"
            {...register("email")}
          />
          <FloatingLabelInput
            label="Password"
            type="password"
            value={passwordValue}
            error={errors.password?.message}
            autoComplete="current-password"
            {...register("password")}
          />
        </div>

        {/* Remember Me & Forgot Password - Magazine Style */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="text-[10px] font-anton text-gray-400 hover:text-black transition-all duration-300 uppercase tracking-[0.2em] border-b border-transparent hover:border-black"
            onClick={onForgotPassword}
          >
            Lost your password?
          </button>
        </div>

        {/* Submit Button - Bold Editorial Style */}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full h-16 bg-lime-500 text-black font-anton text-base font-bold rounded-2xl hover:bg-lime-400 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_40px_rgba(163,230,53,0.2)] uppercase tracking-[0.2em]"
        >
          {isLoading || isSubmitting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            <span>Sign In</span>
          )}
        </button>

        {/* Divider - Stark Editorial Line */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gray-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-6 text-[9px] font-anton text-gray-300 uppercase tracking-[0.5em]">OR</span>
          </div>
        </div>

        {/* Google Login - Border Style */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-16 bg-white text-black font-anton text-[11px] font-bold rounded-2xl border-4 border-gray-50 hover:border-black hover:bg-white active:scale-[0.98] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 uppercase tracking-widest"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="grayscale group-hover:grayscale-0 transition-all duration-500">
            <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10V12.0491H15.4364C15.2 13.2909 14.5091 14.3364 13.4727 15.0545V17.5636H16.7818C18.7091 15.8182 19.8 13.2727 19.8 10.2273Z" fill="#4285F4" />
            <path d="M10 20C12.7 20 14.9636 19.1045 16.7818 17.5636L13.4727 15.0545C12.6091 15.6682 11.4818 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H0.963636V14.4909C2.77273 18.0818 6.10909 20 10 20Z" fill="#34A853" />
            <path d="M4.40455 11.9C4.20455 11.2864 4.09091 10.6364 4.09091 9.97273C4.09091 9.30909 4.20455 8.65909 4.40455 8.04546V5.45455H0.963636C0.29091 6.79091 -0.0909119 8.33636 -0.0909119 9.97273C-0.0909119 11.6091 0.29091 13.1545 0.963636 14.4909L4.40455 11.9Z" fill="#FBBC05" />
            <path d="M10 3.90909C11.6182 3.90909 13.0636 4.46818 14.2091 5.54545L17.1545 2.6C14.9545 0.554545 12.6909 -0.5 10 -0.5C6.10909 -0.5 2.77273 1.41818 0.963636 5.00909L4.40455 7.6C5.19091 5.23636 7.39545 3.90909 10 3.90909Z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

      {/* Register Link - Magazine Style Footer */}
      {onRegister && (
        <div className="pt-4 border-t border-gray-100/50 text-center">
          <span className="text-[10px] text-gray-300 font-anton uppercase tracking-[0.2em]">New to our series? </span>
          <button
            onClick={onRegister}
            className="text-[10px] font-anton text-black hover:text-lime-600 transition-colors duration-300 uppercase tracking-[0.2em] border-b border-black ml-2"
          >
            Create account
          </button>
        </div>
      )}
    </div>
  );
}