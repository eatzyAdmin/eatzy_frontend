"use client";

import { type LoginFormData, type UseZodFormReturn } from "@repo/lib";
import { motion } from "@repo/ui/motion";
import { Key, ChevronRight } from "@repo/ui/icons";
import AuthInput from "./AuthInput";

interface MobileLoginDrawerProps {
  form: UseZodFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  onGoToRegister: () => void;
  onGoToForgot: () => void;
  isLoading: boolean;
  error?: string | null;
}

export default function MobileLoginDrawer({
  form,
  onSubmit,
  onGoToRegister,
  onGoToForgot,
  isLoading,
  error,
}: MobileLoginDrawerProps) {

  return (
    <motion.div
      key="login-drawer"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 150, delay: 0.1 }}
      className="relative z-10 w-full bg-white rounded-t-[48px] p-10 flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.15)] max-h-[85vh] overflow-y-auto no-scrollbar outline-none"
    >
      <div className="flex items-center justify-between mb-12">
        <span className="text-gray-400 font-bold text-sm tracking-tight opacity-60">Drive with Eatzy, Earn easy!</span>
        <button
          onClick={onGoToRegister}
          className="text-gray-900 font-black text-lg tracking-tighter flex items-center gap-1 active:scale-95 transition-all group"
        >
          <span>Join us</span>
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" strokeWidth={2.7} />
        </button>
      </div>

      <div className="mb-10">
        <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">Log in</h1>
      </div>

      {/* API Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100/50 text-red-600 rounded-[24px] text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
          <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-red-500 font-black text-xs">!</span>
          </div>
          <div className="flex justify-center items-center">
            <p className="font-bold text-red-600 mt-0.5 leading-tight">{error}</p>
          </div>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <AuthInput
          type="email"
          placeholder="driver e-mail address"
          icon={<span className="font-extrabold text-sm">@</span>}
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <div className="space-y-4">
          <AuthInput
            type="password"
            placeholder="security password"
            icon={<Key size={16} strokeWidth={3} />}
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />

          <div className="flex justify-end px-4">
            <button
              type="button"
              onClick={onGoToForgot}
              className="text-[11px] font-bold text-gray-400 hover:text-black transition-all flex items-center gap-1 uppercase tracking-widest group"
            >
              <span>Forgot password?</span>
              <ChevronRight size={12} strokeWidth={3} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col space-y-8">
          <p className="text-[10px] text-gray-300 font-medium leading-relaxed max-w-xs ml-2">
            Drive safely. Your security and data protection is our top priority while you navigate the city.
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
                  <span className="tracking-tight">Start to Driving</span>
                  <ChevronRight size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
