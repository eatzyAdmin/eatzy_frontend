"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";
import { motion } from "@repo/ui/motion";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function OTPInput({ length = 6, value, onChange, error }: OTPInputProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    // Only allow digits
    const digit = val.replace(/[^0-9]/g, "");

    if (digit.length === 0) {
      // Handle delete
      const newValue = value.split("");
      newValue[index] = "";
      onChange(newValue.join(""));
      return;
    }

    if (digit.length === 1) {
      const newValue = value.split("");
      newValue[index] = digit;
      onChange(newValue.join(""));

      // Move to next input
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, length);
    onChange(pastedData);

    // Focus on the next empty input or last input
    const nextEmptyIndex = pastedData.length < length ? pastedData.length : length - 1;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 md:gap-3 justify-center items-center">
        {Array.from({ length }).map((_, index) => {
          const isFilled = !!value[index];
          const isFocused = focusedIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                className={`w-[46px] h-[46px] md:w-16 md:h-16 text-center text-2xl md:text-3xl font-black rounded-[18px] md:rounded-[24px] transition-all duration-300 shadow-[inset_0_0_20px_rgba(0,0,0,0.06)] outline-none ${error
                  ? "bg-red-50 text-red-500 ring-2 ring-red-500/10"
                  : isFocused
                    ? "bg-white ring-[5px] ring-blue-500/20 scale-105"
                    : isFilled
                      ? "bg-white text-black ring-1 ring-gray-100"
                      : "bg-slate-50 text-gray-400 hover:bg-white hover:ring-1 hover:ring-gray-100"
                  }`}
                placeholder="•"
              />
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-[10px] text-red-500 text-center font-bold uppercase tracking-widest"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
