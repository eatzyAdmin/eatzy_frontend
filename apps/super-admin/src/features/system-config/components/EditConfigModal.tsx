'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { X, Save, AlertCircle } from 'lucide-react';
import { SystemParameter } from '@repo/types';
import { Button, InputField, DotsLoader } from '@repo/ui';

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Chỉnh sửa cấu hình</h3>
                <p className="text-sm text-gray-500 mt-1">{config.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Mã cấu hình: <span className="text-primary font-mono">{config.configKey}</span>
                </label>
                <InputField
                  label="Giá trị cấu hình"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Nhập giá trị mới..."
                  className="w-full"
                  autoFocus
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="rounded-xl px-6"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-white flex items-center gap-2 min-w-[140px] justify-center"
              >
                {loading ? (
                  <DotsLoader color="#ffffff" size={6} />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
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
