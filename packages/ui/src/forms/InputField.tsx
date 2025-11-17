"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  label: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputField = forwardRef<HTMLInputElement, Props>(function InputField(
  { label, error, required, containerClassName, className, disabled, ...props },
  ref
) {
  return (
    <div className={`mb-3 ${containerClassName ?? ""}`}>
      <label className="block text-gray-700 font-medium mb-2 pl-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        ref={ref}
        disabled={disabled}
        className={`w-full border p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:ring-2 focus:outline-none focus:border-transparent ${
          disabled ? "bg-gray-100 text-gray-500" : "bg-white"
        } ${error ? "border-red-500 bg-red-50 focus:ring-red-200" : "focus:ring-[var(--primary)]/30"} ${className ?? ""}`}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -5, height: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-red-500 px-4 p-1 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

export default InputField;