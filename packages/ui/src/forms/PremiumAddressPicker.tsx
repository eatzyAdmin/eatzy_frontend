'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, Search, X, Check } from 'lucide-react';
import { getProvinces, getDistrictsByProvince, Province, District } from '../data/vietnamAdministrative';

interface PremiumAddressPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function PremiumAddressPicker({
  label,
  value,
  onChange,
  placeholder = "Select your hometown...",
  required,
  error,
  disabled
}: PremiumAddressPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'province' | 'district'>('province');
  const [popoverPosition, setPopoverPosition] = useState<'bottom' | 'top'>('bottom');
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  // Parse initial value if possible (format: "District, Province")
  useEffect(() => {
    if (value && !selectedProvince) {
      const parts = value.split(',').map(p => p.trim());
      const provinces = getProvinces();

      if (parts.length >= 1) {
        const provName = parts[parts.length - 1];
        const prov = provinces.find(p => p.name === provName);
        if (prov) {
          setSelectedProvince(prov);
          if (parts.length >= 2) {
            const distName = parts[0];
            const districts = getDistrictsByProvince(prov.code);
            const dist = districts.find(d => d.name === distName);
            if (dist) setSelectedDistrict(dist);
          }
        }
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If space below is less than 400px AND space above is more than space below
      if (spaceBelow < 400 && spaceAbove > spaceBelow) {
        setPopoverPosition('top');
      } else {
        setPopoverPosition('bottom');
      }
    }
  }, [isOpen]);

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setStep('district');
    setSearchQuery('');
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    const finalValue = `${district.name}, ${selectedProvince?.name}`;
    onChange(finalValue);
    setIsOpen(false);
  };

  const provinces = getProvinces();
  const districts = selectedProvince ? getDistrictsByProvince(selectedProvince.code) : [];

  const filteredItems = step === 'province'
    ? provinces.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : districts.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const renderContent = () => {
    return (
      <div className="flex flex-col h-[400px] bg-white">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            {step === 'district' && (
              <button
                onClick={() => setStep('province')}
                className="p-1 hover:bg-white rounded-lg text-gray-400 hover:text-primary transition-all shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              {step === 'province' ? 'Select Province/City' : `District in ${selectedProvince?.name}`}
            </span>
          </div>
          {selectedProvince && (
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">
              Step {step === 'province' ? '1/2' : '2/2'}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={step === 'province' ? "Search province..." : "Search district..."}
              className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-4 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-2">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const isSelected = step === 'province'
                ? selectedProvince?.code === item.code
                : selectedDistrict?.code === item.code;

              return (
                <button
                  key={item.code}
                  onClick={() => step === 'province' ? handleProvinceSelect(item as Province) : handleDistrictSelect(item as District)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group/item
                    ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-gray-50 text-gray-600'}`}
                >
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  {isSelected ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <MapPin size={14} className="text-gray-300 group-hover/item:text-primary transition-colors" />
                  )}
                </button>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="py-10 text-center space-y-2">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <Search size={20} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors z-10 pointer-events-none">
          <MapPin size={18} />
        </div>

        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`
            w-full bg-gray-50 border-2 rounded-[20px] pl-12 pr-6 py-4 text-gray-900 font-bold cursor-pointer
            flex items-center justify-between border-transparent transition-all duration-300
            ${isOpen ? 'bg-white border-primary/30 ring-4 ring-primary/5 shadow-xl shadow-black/5' : 'hover:bg-gray-100/50'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border-red-500/50' : ''}
          `}
        >
          <span className={!value ? 'text-gray-300' : 'text-gray-900'}>
            {value || placeholder}
          </span>

          {value && !disabled && isOpen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProvince(null);
                setSelectedDistrict(null);
                onChange('');
                setStep('province');
              }}
              className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: popoverPosition === 'bottom' ? 10 : -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: popoverPosition === 'bottom' ? 10 : -10, scale: 0.98 }}
              style={{
                [popoverPosition === 'bottom' ? 'top' : 'bottom']: 'calc(100% + 8px)',
                transformOrigin: popoverPosition === 'bottom' ? 'top center' : 'bottom center',
                position: 'absolute'
              }}
              className="left-0 right-0 bg-white rounded-[28px] shadow-2xl shadow-black/10 border border-gray-100 z-50 overflow-hidden"
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-[10px] text-red-500 mt-1 ml-1 font-bold">{error}</p>}
    </div>
  );
}
