import { useState } from "react";
import { type UseFormReturn } from "@repo/lib/form";
import { type LoginFormData } from "@repo/lib";
import { ShieldCheck, ChevronRight, Eye, EyeOff, Mail } from "@repo/ui/icons";

interface DriverLoginFormProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  isLoading: boolean;
}

export default function DriverLoginForm({
  form,
  onSubmit,
  onForgotPassword,
  onRegister,
  isLoading,
}: DriverLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-[0_15px_50px_rgba(0,0,0,0.02)] border border-gray-100 relative group">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-2">Partner Email</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <Mail size={18} />
            </div>
            <input
              type="email"
              {...form.register("email")}
              placeholder="driver@eatzy.com"
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 font-bold text-black focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all placeholder:text-gray-200"
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-2">Access Key</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <ShieldCheck size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...form.register("password")}
              placeholder="••••••••"
              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-12 font-bold text-black focus:ring-4 focus:ring-lime-500/10 focus:border-lime-500 transition-all placeholder:text-gray-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-[10px] text-red-500 font-bold ml-2 uppercase">{form.formState.errors.password.message}</p>
          )}

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[10px] font-bold text-gray-300 hover:text-black uppercase tracking-widest transition-colors"
            >
              Forgot access?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-black/10 ${isLoading || !form.formState.isValid
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-black text-white hover:bg-zinc-800"
              }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-lg tracking-tight uppercase">Go Online Now</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </div>

        {/* Register Link */}
        <div className="pt-6 border-t border-gray-50 flex items-center justify-center text-center">
          <span className="text-xs text-gray-300 font-medium italic">
            New to the fleet?
            <button
              type="button"
              onClick={onRegister}
              className="text-black font-bold border-b border-black pb-0.5 ml-1 hover:bg-gray-50 transition-all"
            >
              Join the community
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}
