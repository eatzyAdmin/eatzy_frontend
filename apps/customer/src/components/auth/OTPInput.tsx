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
      <div className="flex gap-2 md:gap-3 justify-center">
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
                className={`w-12 h-16 md:w-16 md:h-20 text-center text-4xl font-anton border-0 border-b-4 transition-all duration-500 ${error
                  ? "border-red-500 text-red-500 bg-red-50/30"
                  : isFocused
                    ? "border-lime-500 bg-lime-50/30 scale-105"
                    : isFilled
                      ? "border-black bg-white"
                      : "border-gray-100 bg-transparent hover:border-gray-300 placeholder:text-gray-200"
                  } focus:outline-none focus:ring-0`}
                placeholder="0"
              />
            </motion.div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-sm text-[var(--danger)] text-center font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

