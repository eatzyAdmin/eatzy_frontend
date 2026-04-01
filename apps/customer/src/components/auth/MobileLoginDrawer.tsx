"use client";

import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { ChevronRight, ShieldCheck, Eye, EyeOff } from "@repo/ui/icons";
import { useZodForm, loginSchema, type LoginFormData } from "@repo/lib";
import { useRouter } from "next/navigation";
import { sileo } from "@/components/DynamicIslandToast";
import { useLoading } from "@repo/ui";

interface MobileLoginDrawerProps {
  onSignUpClick: () => void;
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
}

export default function MobileLoginDrawer({ onSignUpClick, onSubmit, isLoading }: MobileLoginDrawerProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useZodForm<LoginFormData>({
    schema: loginSchema,
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  return (
    <motion.div
      key="login-drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 150, delay: 0.1 }}
      className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto no-scrollbar"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between mb-12">
        <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Eat Eatzy, eat easy!</span>
        <button
          onClick={onSignUpClick}
          className="text-gray-900 font-black text-lg tracking-tighter flex items-center gap-1 active:scale-95 transition-all group"
        >
          <span>Sign up</span>
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.7} />
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Log in</h1>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
        onChange={() => { }}
      >
        {/* Email Capsule */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-2 top-2 bottom-2 p-4 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10">
              <span className="font-extrabold text-sm">@</span>
            </div>
            <input
              type="email"
              placeholder="e-mail address"
              {...form.register("email")}
              className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-4 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
            />
          </div>
          {form.formState.errors.email && <p className="text-[10px] text-red-500 font-bold ml-6 uppercase">{form.formState.errors.email.message}</p>}
        </div>

        {/* Password Capsule */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-2 top-2 bottom-2 p-4 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10">
              <ShieldCheck size={16} strokeWidth={3.0} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              {...form.register("password")}
              className="w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-16 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-black transition-all active:scale-95 z-10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {form.formState.errors.password && <p className="mt-1 text-[10px] text-red-500 font-bold ml-6 uppercase">{form.formState.errors.password.message}</p>}

          <div className="flex justify-end px-4">
            <button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="text-[11px] font-bold text-gray-400 hover:text-black transition-all flex items-center gap-1 uppercase tracking-widest group"
            >
              <span>Forgot password</span>
              <ChevronRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col space-y-8">
          <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs ml-2">
            Eatzy ensures your privacy and personal data remains protected by advanced encryption systems.
          </p>

          <div className="space-y-6">
            <button
              type="submit"
              disabled={isLoading || !form.formState.isValid}
              className={`w-full h-16 rounded-full font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] ${(isLoading || !form.formState.isValid)
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
                }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="text-black/60 text-sm">Authenticating...</span>
                </div>
              ) : (
                <>
                  <span className="tracking-tight">Continue to Explore</span>
                  <ChevronRight size={20} strokeWidth={3} className={!form.formState.isValid ? 'opacity-80' : ''} />
                </>
              )}
            </button>

            <div className="flex items-center justify-center">
              <button
                type="button"
                className="text-[11px] font-bold text-gray-400 border-b border-gray-100 pb-1 hover:text-black transition-colors"
              >
                Click here for more info.
              </button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
