import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, User, FileText, Mail, Phone, ChevronDown } from "lucide-react";

export type SearchFieldConfig = { key: string; label: string; icon: React.ComponentType<any>; placeholder?: string };

export type SearchFilterBarProps = {
  searchFields?: Record<string, string>;
  handleSearchChange: (key: string, value: string) => void;
  clearSearchFields: () => void;
  onSearch?: (fields: Record<string, string>) => void;
  searchFieldsConfig?: SearchFieldConfig[];
  className?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

const SearchFilterBar = ({ searchFields = {}, handleSearchChange, clearSearchFields, onSearch, searchFieldsConfig = [{ key: 'fullName', label: 'Họ tên', icon: User, placeholder: 'Tìm theo họ tên...' }, { key: 'idNumber', label: 'Số CMND/CCCD', icon: FileText, placeholder: 'Tìm theo CCCD/CMND...' }, { key: 'email', label: 'Email', icon: Mail, placeholder: 'Tìm theo email...' }, { key: 'phone', label: 'Số điện thoại', icon: Phone, placeholder: 'Tìm theo số điện thoại...' }], className = '', title = 'Tìm kiếm', subtitle = 'Tìm kiếm' }: SearchFilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSearchFields, setLocalSearchFields] = useState<Record<string, string>>({});
  const toggleExpanded = () => { setIsExpanded(!isExpanded); };
  const handleClearAndCollapse = () => { clearSearchFields(); setLocalSearchFields({}); setIsExpanded(false); };
  const handleLocalSearchChange = (key: string, value: string) => { setLocalSearchFields(prev => ({ ...prev, [key]: value })); };
  const handleSearchSubmit = () => { Object.keys(localSearchFields).forEach(key => { handleSearchChange(key, localSearchFields[key] || ''); }); if (onSearch) onSearch(localSearchFields); };
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`relative bg-white rounded-2xl shadow-sm mb-0 border border-gray-200 overflow-hidden ${className}`}>
      <motion.div className="p-6 cursor-pointer relative z-10" onClick={toggleExpanded} whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }} transition={{ duration: 0.15 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div animate={{ scale: [1, 1.15, 1], rotate: isExpanded ? 180 : 0 }} transition={{ scale: { repeat: Infinity, duration: 2, repeatType: "loop" }, rotate: { duration: 0.3 } }} className="bg-primary p-2.5 rounded-xl shadow-md"><Search size={20} className="text-white" /></motion.div>
            <div className={`${isExpanded ? 'hidden md:block' : ''}`}>
              <h3 className="text-base font-semibold text-gray-900">{isExpanded ? title : "Nhấp để tìm kiếm"}</h3>
              <motion.p initial={false} animate={{ opacity: isExpanded ? 1 : 0.7, y: isExpanded ? 0 : 2 }} transition={{ duration: 0.3 }} className="text-sm text-gray-500 mt-0.5">{isExpanded ? subtitle : "Mở rộng để sử dụng bộ lọc tìm kiếm"}</motion.p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {isExpanded && (
              <>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} onClick={(e) => { e.stopPropagation(); handleSearchSubmit(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm font-medium bg-primary text-white hover:brightness-105 px-4 py-2 rounded-xl flex items-center transition-all duration-200 shadow-sm"><Search size={16} className="mr-2" />Tìm kiếm</motion.button>
                <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3, delay: 0.1 }} onClick={(e) => { e.stopPropagation(); handleClearAndCollapse(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm font-medium bg-danger/10 text-danger hover:bg-danger/20 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-danger/20 shadow-sm"><X size={16} className="mr-2" />Xóa</motion.button>
              </>
            )}
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }} className="bg-primary/10 p-2 rounded-full"><ChevronDown size={20} className="text-primary" /></motion.div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], opacity: { duration: 0.3 } }} className="overflow-hidden">
            <div className="px-6 pb-6 relative z-10">
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {searchFieldsConfig.map((field, index) => {
                  const IconComponent = field.icon as any;
                  return (
                    <motion.div key={field.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}>
                      <div className="relative group">
                        <input type="text" placeholder={field.placeholder || ""} value={localSearchFields[field.key] || ""} onChange={(e) => handleLocalSearchChange(field.key, e.target.value)} onKeyPress={(e) => { if (e.key === 'Enter') { handleSearchSubmit(); } }} className="w-full pl-12 pr-4 py-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:shadow-md focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200" />
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 2, repeatType: "loop", delay: index * 0.3 }} className="absolute left-3 top-3 bg-primary/10 p-1.5 rounded-lg text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors duration-200"><IconComponent size={18} /></motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )
        }
      </AnimatePresence >
    </motion.div >
  );
};

export default SearchFilterBar;