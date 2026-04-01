"use client";

import { useState, forwardRef, InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "@repo/ui/icons";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  type?: "text" | "password" | "email" | "tel" | "date";
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type = "text", className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full space-y-2 group animate-in fade-in slide-in-from-top-1 duration-500">
        {/* Professional Label - Static Color as requested (Gray) */}
        <div className="flex items-center justify-between px-1">
          <label className="text-[15px] font-extrabold text-gray-400 transition-none">
            {label}
          </label>
        </div>

        {/* Input Wrapper - High Impact Ring, No focus border, Static Label */}
        <div className={`relative h-[60px] w-full rounded-[24px] transition-all duration-300 flex items-center bg-slate-50 border-2 border-white shadow-[inset_0_0_20px_rgba(0,0,0,0.08)] ${error
            ? "border-red-200/50"
            : "focus-within:ring-[6px] focus-within:ring-blue-500/20 focus-within:bg-white focus-within:-translate-y-0.5"
          } ${className}`}>

          <input
            ref={ref}
            type={type === "password" && showPassword ? "text" : type}
            placeholder={props.placeholder}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 px-6 py-4 text-base font-bold text-gray-900 placeholder:text-gray-300 placeholder:font-medium placeholder:italic transition-all duration-300"
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="mr-3 p-2 hover:bg-gray-100/50 rounded-[14px] transition-all text-gray-300 hover:text-blue-500 active:scale-95"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className="px-2 text-[10px] font-bold text-red-500 leading-tight uppercase tracking-wider">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
