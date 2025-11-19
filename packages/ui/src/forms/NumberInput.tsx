import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export type NumberInputProps = {
  value: number | string | null;
  onChange: (v: number | string | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  required?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  allowDecimal?: boolean;
  decimalPlaces?: number;
  className?: string;
  highlightChange?: boolean;
  highlightColor?: "green" | "red" | "blue" | "indigo";
  disableDirectInput?: boolean;
  autoFormat?: boolean;
};

const NumberInput = ({
  value,
  onChange,
  onBlur,
  onKeyPress,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  prefix = "",
  suffix = "",
  required = false,
  label = "",
  placeholder = "",
  error = "",
  allowDecimal = true,
  decimalPlaces = 1,
  className = "",
  highlightChange = false,
  highlightColor = "green",
  disableDirectInput = false,
  autoFormat = false
}: NumberInputProps) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    if (isFocused) return;
    if (value === null || value === undefined || value === "") { setDisplayValue(""); return; }
    const numValue = parseFloat(String(value));
    if (!isNaN(numValue)) {
      const currentNum = parseFloat(displayValue);
      if (isNaN(currentNum) || Math.abs(numValue - currentNum) > 0.001) {
        if (allowDecimal && autoFormat) { setDisplayValue(numValue.toFixed(decimalPlaces)); } else { setDisplayValue(numValue.toString()); }
      }
    }
  }, [value, allowDecimal, decimalPlaces, autoFormat, isFocused, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disableDirectInput) return;
    let inputValue = e.target.value;
    if (inputValue === "") { setDisplayValue(""); onChange(""); return; }
    inputValue = inputValue.replace(",", ".");
    const regex = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
    if (!regex.test(inputValue)) return;
    setDisplayValue(inputValue);
    const numValue = allowDecimal ? parseFloat(inputValue) : parseInt(inputValue);
    if (!isNaN(numValue as any)) { setTimeout(() => { onChange(numValue as number); }, 0); }
    else if (inputValue === "" || inputValue === "-" || (allowDecimal && (inputValue === "." || inputValue.endsWith(".")))) { onChange(""); }
  };

  const handleFocus = () => { setIsFocused(true); };
  const handleBlurInternal = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (displayValue === "" || displayValue === "-") { setDisplayValue(""); onChange(""); if (onBlur) onBlur(e); return; }
    const numValue = allowDecimal ? parseFloat(displayValue) : parseInt(displayValue);
    if (!isNaN(numValue as any)) {
      let finalValue = numValue as number;
      if (finalValue < min) finalValue = min; else if (finalValue > max) finalValue = max;
      if (autoFormat || finalValue !== numValue) { if (allowDecimal && autoFormat) { setDisplayValue(finalValue.toFixed(decimalPlaces)); } else { setDisplayValue(String(finalValue)); } }
      setTimeout(() => { onChange(finalValue); }, 0);
    } else { setDisplayValue(""); onChange(""); }
    if (onBlur) onBlur(e);
  };

  const getHighlightClasses = () => {
    if (!highlightChange) return "";
    const colorMap: Record<string, string> = {
      green: "border-green-300 bg-green-50 focus:ring-green-200",
      red: "border-red-300 bg-red-50 focus:ring-red-200",
      blue: "border-blue-300 bg-blue-50 focus:ring-blue-200",
      indigo: "border-indigo-300 bg-indigo-50 focus:ring-indigo-200"
    };
    return colorMap[highlightColor] || colorMap.green;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <motion.div className="relative flex" initial={highlightChange ? { scale: 1.04, boxShadow: highlightColor === 'red' ? '0 0 0 2px #ef4444' : '0 0 0 2px #22d3ee' } : {}} animate={highlightChange ? { scale: 1, boxShadow: '0 0 0 0px #fff' } : {}} transition={{ duration: 0.5 }}>
        {prefix && (<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold pointer-events-none select-none">{prefix}</span>)}
        <input type="text" inputMode="numeric" className={`w-full px-5 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 text-base font-semibold transition-all duration-200 ${error ? 'border-red-300 focus:ring-red-200 bg-red-50' : getHighlightClasses() || 'border-gray-200 focus:ring-blue-200'} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-16' : 'pr-5'} ${disableDirectInput ? 'bg-gray-100 cursor-not-allowed' : ''} ${highlightChange ? (highlightColor === 'red' ? 'shadow-[0_0_8px_0_rgba(239,68,68,0.15)]' : 'shadow-[0_0_8px_0_rgba(34,211,238,0.15)]') : ''} ${className}`} value={displayValue} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlurInternal} onKeyPress={onKeyPress} placeholder={placeholder} disabled={disableDirectInput} readOnly={disableDirectInput} />
        {suffix && (<span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 font-semibold pointer-events-none select-none">{suffix}</span>)}
      </motion.div>
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-1 text-xs text-red-600 flex items-center">
            <AlertCircle size={12} className="mr-1" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NumberInput;