import React, { useState, useEffect } from 'react';
import { motion } from '@repo/ui/motion';
import { Search, X, Hash, Type } from '@repo/ui/icons';

interface SearchFieldConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  placeholder: string;
}

interface WalletSearchBarProps {
  searchFields: Record<string, string>;
  handleSearchChange: (key: string, value: string) => void;
  clearSearchFields: () => void;
  isExpanded: boolean;
  toggleExpanded: () => void;
  className?: string;
}

const WalletSearchBar: React.FC<WalletSearchBarProps> = ({
  searchFields,
  handleSearchChange,
  clearSearchFields,
  isExpanded,
  toggleExpanded,
  className = ''
}) => {
  const [localSearchFields, setLocalSearchFields] = useState(searchFields);

  useEffect(() => {
    setLocalSearchFields(searchFields);
  }, [searchFields]);

  const handleClearAndCollapse = () => {
    clearSearchFields();
    setLocalSearchFields({ id: '', description: '', amount: '', status: '' });
    toggleExpanded();
  };

  const handleLocalSearchChange = (key: string, value: string) => {
    setLocalSearchFields((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearchSubmit = () => {
    Object.keys(localSearchFields).forEach(key => {
      handleSearchChange(key, localSearchFields[key]);
    });
  };

  const searchFieldsConfig: SearchFieldConfig[] = [
    { key: 'id', label: 'Transaction ID', icon: Hash, placeholder: 'Find by ID (e.g. 9982)...' },
    { key: 'description', label: 'Description', icon: Type, placeholder: 'Find by description...' },
  ];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
      animate={{
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
        marginBottom: isExpanded ? 24 : 0
      }}
      transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
      className={`relative bg-gradient-to-br from-lime-50/80 to-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-lime-100 overflow-hidden ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-lime-100/30 rounded-full -mr-20 -mt-20 blur-2xl"></div>

      <div className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-lime-500 to-green-600 p-2.5 rounded-xl shadow-md cursor-default">
              <Search size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-800">Search Transactions</h3>
              <p className="text-sm text-lime-700 mt-0.5">Find by ID or Description</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearchSubmit}
              className="text-sm font-medium bg-lime-100 text-lime-700 hover:bg-lime-200 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-lime-200 shadow-sm"
            >
              <Search size={16} className="mr-2" />
              Search
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearAndCollapse}
              className="text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl flex items-center transition-all duration-200 border border-red-200 shadow-sm"
            >
              <X size={16} className="mr-2" />
              Close
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searchFieldsConfig.map((field, index) => {
            const IconComponent = field.icon;
            return (
              <motion.div
                key={field.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={localSearchFields[field.key as keyof typeof localSearchFields] || ""}
                  onChange={(e) => handleLocalSearchChange(field.key, e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="w-full pl-12 pr-4 py-3.5 text-sm bg-white border border-lime-100 rounded-xl shadow-sm focus:shadow-md focus:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:ring-opacity-50 transition-all duration-200"
                />
                <div className="absolute left-3 top-3 bg-lime-50 p-1.5 rounded-lg text-lime-600 group-focus-within:bg-lime-100 transition-colors duration-200">
                  <IconComponent size={18} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default WalletSearchBar;
