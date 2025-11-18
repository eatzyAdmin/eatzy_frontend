"use client";

import { useState } from "react";
import FloatingLabelInput from "../forms/FloatingLabelInput";
type LoginFormData = { email: string; password: string; rememberMe?: boolean };
import { Layers } from "../icons";

type Props = {
  onForgotPassword?: () => void;
  onSuccess?: () => void;
  onRegister?: () => void;
  form: any;
};

export default function LoginForm({ onForgotPassword, onSuccess, onRegister, form }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = form;

  const emailValue = watch("email");
  const passwordValue = watch("password");
  const rememberMeValue = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Login data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onSuccess?.();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center p-8 md:p-12 lg:p-16">
      <div className="flex justify-center mb-8">
        <div className="relative w-12 h-12 transform rotate-45 rounded-xl flex items-center justify-center hover:rotate-90 transition-all duration-500">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] shadow-lg"></div>
          <div className="absolute inset-[3px] rounded-xl bg-gradient-to-br from-emerald-200 to-lime-200"></div>
          <div className="absolute inset-[6px] rounded-xl bg-white"></div>
          <Layers className="absolute inset-0 m-auto transform -rotate-45" size={24} strokeWidth={2.5} color="var(--primary)" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h1>
        <p className="text-gray-500 text-sm">Vui lòng nhập thông tin của bạn</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FloatingLabelInput label="Email" type="email" value={emailValue} error={errors.email?.message} autoComplete="email" {...register("email")} />
        <FloatingLabelInput label="Mật khẩu" type="password" value={passwordValue} error={errors.password?.message} autoComplete="current-password" {...register("password")} />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={rememberMeValue} className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] focus:ring-2 cursor-pointer transition-all" {...register("rememberMe")} />
            <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Ghi nhớ trong 30 ngày</span>
          </label>
          <button type="button" className="text-gray-500 hover:text-[var(--primary)] transition-colors duration-200 font-medium" onClick={onForgotPassword}>
            Quên mật khẩu?
          </button>
        </div>

        <button type="submit" disabled={isLoading || isSubmitting} className="w-full h-14 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl">
          {isLoading || isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Đang đăng nhập...</span>
            </div>
          ) : (
            "Đăng nhập"
          )}
        </button>

        <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full h-14 bg-gray-50 text-gray-700 font-semibold rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10V12.0491H15.4364C15.2 13.2909 14.5091 14.3364 13.4727 15.0545V17.5636H16.7818C18.7091 15.8182 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
            <path d="M10 20C12.7 20 14.9636 19.1045 16.7818 17.5636L13.4727 15.0545C12.6091 15.6682 11.4818 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H0.963636V14.4909C2.77273 18.0818 6.10909 20 10 20Z" fill="#34A853"/>
            <path d="M4.40455 11.9C4.20455 11.2864 4.09091 10.6364 4.09091 9.97273C4.09091 9.30909 4.20455 8.65909 4.40455 8.04546V5.45455H0.963636C0.29091 6.79091 -0.0909119 8.33636 -0.0909119 9.97273C-0.0909119 11.6091 0.29091 13.1545 0.963636 14.4909L4.40455 11.9Z" fill="#FBBC05"/>
            <path d="M10 3.90909C11.6182 3.90909 13.0636 4.46818 14.2091 5.54545L17.1545 2.6C14.9545 0.554545 12.6909 -0.5 10 -0.5C6.10909 -0.5 2.77273 1.41818 0.963636 5.00909L4.40455 7.6C5.19091 5.23636 7.39545 3.90909 10 3.90909Z" fill="#EA4335"/>
          </svg>
          Đăng nhập với Google
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <span className="text-gray-500">Chưa có tài khoản? </span>
        <button onClick={onRegister} className="text-gray-900 font-semibold hover:text-[var(--primary)] transition-colors duration-200">
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}