import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "@repo/ui/motion";
import { ChevronDown, Search } from "@repo/ui/icons";

interface Props {
  label?: string;
  options: string[];
  value?: string;
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export default function AuthSelect({
  label,
  options,
  value = "",
  placeholder = "Select Option",
  error,
  onChange,
  icon,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase())),
    [options, searchTerm]
  );

  const handleSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className="space-y-1.5 w-full relative" ref={dropdownRef}>
      {label && (
        <label className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.2em] ml-6 block">
          {label}
        </label>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-[64px] cursor-pointer flex items-center gap-3 px-8 bg-gray-100 border border-transparent rounded-full transition-all group active:scale-[0.99] ${
          isOpen ? "bg-white border-gray-100 ring-4 ring-gray-100/50" : "hover:bg-gray-200/50"
        } ${error ? "border-red-500/30 bg-red-50/50" : ""}`}
      >
        {icon && <div className="text-gray-400">{icon}</div>}
        <span className={`text-base font-bold flex-1 ${value ? "text-gray-900" : "text-gray-300 italic"}`}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] bg-white/90 backdrop-blur-xl rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-50 flex items-center gap-3 px-6">
              <Search size={16} className="text-gray-400" />
              <input
                className="w-full h-10 bg-transparent text-sm font-bold focus:outline-none placeholder:text-gray-300"
                placeholder="Quick search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`px-8 py-4 cursor-pointer text-sm font-bold transition-all ${
                      value === opt ? "bg-gray-50 text-black" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                  No partners found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <p className="text-[10px] text-red-500 font-bold ml-6 uppercase tracking-wider animate-in fade-in duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
