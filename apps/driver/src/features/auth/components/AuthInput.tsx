"use client";

import { useState, InputHTMLAttributes, forwardRef } from "react";
import { Eye, EyeOff } from "@repo/ui/icons";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, type = "text", error, icon, className = "", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="space-y-2 w-full group">
        {label && (
          <div className="flex items-center justify-between px-6">
            <label className="text-[15px] font-extrabold text-gray-400 transition-none uppercase tracking-wider">
              {label}
            </label>
          </div>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-2 top-1.5 bottom-1.5 aspect-square rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 transition-all">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={`w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full ${icon ? "pl-16" : "pl-8"
              } pr-4 text-base font-bold text-gray-900 transition-all focus:ring-[6px] focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic ${className} ${error ? "border-red-300/40 bg-red-50/50" : ""
              }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-black transition-all active:scale-95 z-10"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-[10px] text-red-500 font-bold ml-6 uppercase tracking-wider animate-in fade-in duration-300">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
