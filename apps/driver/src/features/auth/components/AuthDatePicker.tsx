import { useState } from "react";
import { Calendar } from "@repo/ui/icons";

interface Props {
  label?: string;
  value?: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function AuthDatePicker({
  label,
  value = "",
  placeholder = "Select Date",
  error,
  onChange,
  icon,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5 w-full relative">
      {label && (
        <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-6 block">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className={`absolute left-2 top-2 bottom-2 w-11 h-11 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 z-10 transition-all ${
          isFocused ? "text-black border-gray-100 bg-white" : ""
        }`}>
          {icon ?? <Calendar size={16} strokeWidth={3} />}
        </div>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-[64px] bg-gray-100 border border-transparent focus:border-gray-100 focus:bg-white rounded-full pl-16 pr-8 text-base font-bold text-gray-900 transition-all focus:ring-4 focus:ring-gray-100/50 placeholder:text-gray-300 placeholder:italic appearance-none relative ${
            error ? "border-red-500/30 bg-red-50/50" : ""
          }`}
          placeholder={placeholder}
        />
        {!value && (
          <div className="absolute left-16 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 italic font-medium">
            {placeholder}
          </div>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-6 uppercase tracking-wider animate-in fade-in duration-300">
          {error}
        </p>
      )}
      
      {/* Visual Indicator for Platform specific date picker */}
      <style jsx>{`
        input::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </div>
  );
}
