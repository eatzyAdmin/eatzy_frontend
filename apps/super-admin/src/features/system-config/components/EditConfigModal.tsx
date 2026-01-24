'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, AlertCircle, Info } from 'lucide-react';
import { SystemParameter } from '@repo/types';
import { Button, DotsLoader } from '@repo/ui';
import { CONFIG_METADATA } from '../constants';

interface EditConfigModalProps {
  config: SystemParameter | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: SystemParameter) => Promise<void>;
}

export const EditConfigModal: React.FC<EditConfigModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(config?.configValue || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (config) {
      setValue(config.configValue);
      setError(null);
    }
  }, [config]);

  const handleSave = async () => {
    if (!config) return;

    setLoading(true);
    setError(null);
    try {
      await onSave({ ...config, configValue: value });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && config && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative bg-[#F8F9FA] w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col border border-white/20"
          >
            {/* Header */}
            <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase tracking-tight">EDIT CONFIG</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Key:</span>
                  <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">{config.configKey}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-8 space-y-8">
              {/* Description Info Card */}
              <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Description</div>
                  {config && CONFIG_METADATA[config.configKey] && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      <Info size={12} />
                      Format: {CONFIG_METADATA[config.configKey].type}
                    </div>
                  )}
                </div>
                <p className="text-base text-gray-600 font-medium italic relative z-10 transition-colors group-hover:text-gray-900">
                  "{config.description}"
                </p>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gray-50 rounded-full blur-2xl group-hover:bg-primary/5 transition-colors" />
              </div>

              {/* Input Area */}
              <div className="bg-white rounded-[32px] p-8 shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-gray-100/50 space-y-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                      <Save className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-anton text-2xl text-[#1A1A1A] uppercase tracking-tight">Configure Value</h4>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Nhập giá trị mới..."
                    className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-200 rounded-[28px] text-2xl font-bold text-gray-800 shadow-inner outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-200"
                    autoFocus
                  />
                  {config && CONFIG_METADATA[config.configKey]?.suffix && (
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 font-anton text-3xl text-gray-300">
                      {CONFIG_METADATA[config.configKey].suffix}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400 font-semibold px-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                  Đảm bảo giá trị nhập vào đúng định dạng quy định của hệ thống.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-5 bg-red-50 text-red-600 rounded-[24px] text-sm border border-red-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <p className="font-bold text-base leading-tight">{error}</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-8 bg-white border-t border-gray-100 flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-8 py-4 rounded-2xl text-base font-bold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all duration-300"
              >
                Hủy
              </button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="rounded-[32px] px-10 py-7 bg-primary hover:bg-primary/90 text-white flex items-center gap-3 min-w-[200px] justify-center shadow-xl shadow-primary/25 transition-all text-xl"
              >
                {loading ? (
                  <DotsLoader color="#ffffff" size={8} />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
