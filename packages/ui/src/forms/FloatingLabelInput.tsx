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
      <div className="relative w-full">
        <div className="relative">
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            className={`w-full pt-6 pb-2 px-0 bg-transparent border-0 border-b-2 ${
              error 
                ? 'border-[var(--danger)]' 
                : isActive 
                  ? 'border-[var(--primary)]' 
                  : 'border-gray-300'
            } focus:outline-none focus:ring-0 transition-all duration-300 ${className}`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />
          <label
            className={`absolute left-0 transition-all duration-300 ease-out pointer-events-none ${
              isActive
                ? 'top-0 text-xs font-medium'
                : 'top-1/2 -translate-y-1/2 text-base'
            } ${
              error
                ? 'text-[var(--danger)]'
                : isActive
                  ? 'text-[var(--primary)]'
                  : 'text-gray-500'
            }`}
          >
            {label}
          </label>
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-[var(--primary)] transition-colors duration-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[var(--danger)] animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export default FloatingLabelInput;