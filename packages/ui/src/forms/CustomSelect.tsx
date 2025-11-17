"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  label?: string;
  options: string[];
  value?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
};

export default function CustomSelect({
  label,
  options,
  value = "",
  placeholder = "Chọn...",
  error,
  required,
  disabled,
  onChange,
  onBlur,
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
        onBlur && onBlur();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((o) => !o);
      setIsFocused(true);
    }
  };

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    onBlur && onBlur();
  };

  return (
    <div className={`mb-3 ${className ?? ""}`}>
      {label && (
        <label className="block text-gray-700 font-medium mb-2 pl-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full" ref={dropdownRef}>
        <div
          className={clsx(
            "w-full border p-3 rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all duration-300 ease-in-out",
            disabled ? "bg-gray-100 text-gray-500" : "bg-white",
            isFocused && !disabled ? "ring-2 ring-[var(--primary)]/30 bg-[var(--primary)]/5" : "",
            error ? "border-red-500 bg-red-50" : "",
            className
          )}
          onClick={toggleDropdown}
          tabIndex={disabled ? -1 : 0}
          onFocus={() => !disabled && setIsFocused(true)}
          onBlur={(e) => {
            if (!dropdownRef.current?.contains(e.relatedTarget as Node)) setIsFocused(false);
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          {value ? (
            <span className={`${disabled ? "text-gray-500" : "text-black"}`}>{value}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          {!disabled && (
            <svg
              className="ml-auto w-5 h-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !disabled && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute w-full mt-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg z-50 overflow-hidden"
              >
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    className="w-full p-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <motion.div className="max-h-60 overflow-auto" initial={false} animate={{ height: "auto" }}>
                  {filteredOptions.map((opt) => (
                    <motion.div
                      key={opt}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`px-5 p-3 cursor-pointer hover:bg-gray-100 ${
                        value === opt ? "bg-blue-50 text-black" : "text-gray-700"
                      }`}
                      onClick={() => handleSelect(opt)}
                    >
                      {opt}
                    </motion.div>
                  ))}
                  {filteredOptions.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 text-center text-gray-500">
                      Không tìm thấy kết quả
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      {error && <p className="text-xs text-red-500 px-4 p-1 mt-1">{error}</p>}
    </div>
  );
}