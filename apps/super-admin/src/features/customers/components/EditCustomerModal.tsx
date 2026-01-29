'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { createPortal } from 'react-dom';
import { X, User, MapPin, Calendar, CheckCircle, Save, Phone, Mail } from 'lucide-react';
import { useNotification, useSwipeConfirmation, DotsLoader, Edit, PremiumDatePicker, PremiumAddressPicker } from '@repo/ui';
import { ResCustomerProfileDTO } from '@repo/types';
import { format } from 'date-fns';

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSave: (id: number, userId: number, data: { name: string; hometown: string; dateOfBirth: string }) => Promise<void>;
  customer: ResCustomerProfileDTO | null;
}

export default function EditCustomerModal({
  isOpen,
  onClose,
  onSuccess,
  onSave,
  customer
}: EditCustomerModalProps) {
  const { confirm } = useSwipeConfirmation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    hometown: '',
    dateOfBirth: '',
  });

  const [initialFormData, setInitialFormData] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && customer) {
      const initial = {
        name: customer.user.name || '',
        hometown: customer.hometown || '',
        dateOfBirth: customer.date_of_birth || '',
      };
      setFormData(initial);
      setInitialFormData(JSON.stringify(initial));
    }
  }, [isOpen, customer]);

  const hasChanges = JSON.stringify(formData) !== initialFormData;
  const isValid = formData.name.trim().length > 0;

  const handleSubmit = () => {
    if (!customer) return;

    confirm({
      title: "Cập nhật thông tin?",
      type: 'info',
      description: `Bạn có chắc chắn muốn cập nhật thông tin cho khách hàng ${customer.user.name}?`,
      confirmText: "Slide to Save",
      onConfirm: async () => {
        setIsSubmitting(true);
        try {
          await onSave(customer.id, customer.user.id, formData);
          onSuccess();
          onClose();
        } catch (error) {
          console.error(error);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && customer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[50]"
          />

          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-2xl h-[95vh] rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-lime-50 flex items-center justify-center text-primary border border-lime-100">
                    <Edit size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-anton font-bold text-[#1A1A1A] uppercase tracking-tight">EDIT CUSTOMER</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account ID:</span>
                      <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">#{customer.user.id}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 space-y-8 pb-10">
                  {/* Profile Section */}
                  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">General Information</h4>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Full Name</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors z-10">
                            <User size={18} />
                          </div>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-transparent rounded-[20px] pl-12 pr-6 py-4 text-gray-900 font-bold focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all outline-none shadow-sm focus:shadow-xl focus:shadow-black/5"
                            placeholder="e.g. John Doe"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Phone (Read-only)</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                              <Phone size={18} />
                            </div>
                            <input
                              type="text"
                              value={customer.user.phoneNumber}
                              disabled
                              className="w-full bg-gray-100 border-2 border-transparent rounded-[20px] pl-12 pr-6 py-4 text-gray-400 font-bold outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1 mb-1.5 block">Email (Read-only)</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                              <Mail size={18} />
                            </div>
                            <input
                              type="text"
                              value={customer.user.email || 'N/A'}
                              disabled
                              className="w-full bg-gray-100 border-2 border-transparent rounded-[20px] pl-12 pr-6 py-4 text-gray-400 font-bold outline-none cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Section */}
                  <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Details</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <PremiumAddressPicker
                        label="Hometown"
                        value={formData.hometown}
                        onChange={(value) => setFormData({ ...formData, hometown: value })}
                      />

                      <PremiumDatePicker
                        label="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                        maxDate={new Date()}
                        placeholder="Select your birthday"
                      />
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed px-10">
                    Thay đổi tên sẽ cập nhật hồ sơ người dùng chính. Các trường thông tin Email và Số điện thoại chỉ có thể thay đổi bởi bộ phận kỹ thuật để đảm bảo tính xác thực.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-white border-t border-gray-50">
                <button
                  onClick={handleSubmit}
                  disabled={!isValid || !hasChanges || isSubmitting}
                  className={`w-full py-5 rounded-[24px] font-anton text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-md
                    ${(!isValid || !hasChanges || isSubmitting)
                      ? 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'
                      : 'bg-primary text-white hover:bg-[#1A1A1A] shadow-primary/20 shadow-lg'}`}
                >
                  {isSubmitting ? (
                    <DotsLoader color="currentColor" size={8} />
                  ) : (
                    <>
                      <Save size={22} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
