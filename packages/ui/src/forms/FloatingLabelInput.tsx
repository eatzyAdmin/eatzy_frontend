"use client";

import { useState, useRef, InputHTMLAttributes, forwardRef, useEffect } from "react";
import { Eye, EyeOff } from "../icons";

interface FloatingLabelInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  error?: string;
}

const FloatingLabelInput = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, type = 'text', error, className = '', value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const internalRef = useRef<HTMLInputElement>(null);

    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef;

    useEffect(() => {
      const currentValue = value || inputRef.current?.value || '';
      setHasValue(currentValue.toString().length > 0);
    }, [value, inputRef]);

    const isActive = isFocused || hasValue;
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full group">
        <div className="relative">
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            className={`w-full pt-6 pb-2 px-0 bg-transparent border-0 border-b-2 text-black font-semibold placeholder:opacity-0 ${error
              ? 'border-red-500'
              : isActive
                ? 'border-lime-500'
                : 'border-gray-200 group-hover:border-black'
              } focus:outline-none focus:ring-0 transition-all duration-500 ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />
          <label
            className={`absolute left-0 transition-all duration-500 ease-[0.16,1,0.3,1] pointer-events-none ${isActive
              ? 'top-0 text-[10px] font-anton font-bold uppercase tracking-[0.2em]'
              : 'top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400'
              } ${error
                ? 'text-red-500'
                : isActive
                  ? 'text-lime-600'
                  : ''
              }`}
          >
            {label}
          </label>
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-300 hover:text-black transition-colors duration-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-[10px] font-anton uppercase tracking-widest text-red-500 animate-in fade-in slide-in-from-top-1 duration-300">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;