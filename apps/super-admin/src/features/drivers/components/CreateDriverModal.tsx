'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, User, Search, Bike as BikeIcon, CheckCircle, ChevronRight,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { LoadingSpinner, useNotification } from '@repo/ui';
import { userApi } from '@repo/api';

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export default function CreateDriverModal({
  isOpen,
  onClose,
  onSave
}: CreateDriverModalProps) {
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // User selection state
  const [userSearch, setUserSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    vehicleType: 'Motorcycle',
    vehicleLicensePlate: '',
    status: 'OFFLINE',
    codLimit: 5000000
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedUser(null);
      setUserSearch('');
      setFormData({
        vehicleType: 'Motorcycle',
        vehicleLicensePlate: '',
        status: 'OFFLINE',
        codLimit: 5000000
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userSearch.length >= 2) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [userSearch]);

  const searchUsers = async () => {
    setIsSearchingUsers(true);
    try {
      const res = await userApi.getAllUsers({
        filter: `name ~ '%${userSearch}%' or email ~ '%${userSearch}%'`,
        size: 5
      });
      if (res.data?.result) {
        setUsers(res.data.result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingUsers(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await onSave({
        user: { id: selectedUser.id },
        ...formData
      });
      showNotification({ message: 'Driver onboarded successfully', type: 'success' });
      onClose();
    } catch (err) {
      showNotification({ message: 'Failed to onboard driver', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[500]"
          />

          <div className="fixed inset-0 z-[510] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] border border-gray-100"
            >
              {/* Header */}
              <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                    <BikeIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-anton uppercase tracking-tight text-[#1A1A1A]">Onboard New Partner</h3>
                    <p className="text-xs font-medium text-gray-400">Step {step} of 2: {step === 1 ? 'Select Individual' : 'Fleet Details'}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:shadow-md transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                {step === 1 ? (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Find Existing User Account</label>
                      <div className="relative group/search">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within/search:text-primary transition-colors">
                          {isSearchingUsers ? <LoadingSpinner size={18} /> : <Search size={18} />}
                        </div>
                        <input
                          type="text"
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          placeholder="Search by name or email address..."
                          className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[24px] text-sm font-medium focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/[0.03] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      {users.length > 0 ? (
                        users.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-6 rounded-[28px] border-2 transition-all flex items-center gap-5 group
                                        ${selectedUser?.id === user.id
                                ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5'
                                : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'}`}
                          >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-anton uppercase
                                        ${selectedUser?.id === user.id ? 'bg-primary' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                              {user.name.charAt(0)}
                            </div>
                            <div className="text-left flex-1">
                              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1">{user.name}</div>
                              <div className="text-xs font-medium text-gray-400">{user.email}</div>
                            </div>
                            {selectedUser?.id === user.id && (
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                                <CheckCircle size={18} />
                              </div>
                            )}
                          </button>
                        ))
                      ) : userSearch.length >= 2 ? (
                        <div className="py-12 text-center">
                          <AlertCircle size={40} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-sm font-medium text-gray-400">No matching users found.</p>
                        </div>
                      ) : (
                        <div className="py-12 text-center rounded-[32px] border-2 border-dashed border-gray-100 bg-gray-50/30">
                          <User size={40} className="mx-auto text-gray-100 mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Enter at least 2 characters to search</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-6 p-6 rounded-[32px] bg-gray-900 text-white mb-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-primary">
                        <User size={32} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assigning Partner</p>
                        <h4 className="text-2xl font-anton uppercase tracking-tight">{selectedUser?.name}</h4>
                        <p className="text-xs font-medium text-white/40">{selectedUser?.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Fleet Classification</label>
                        <select
                          value={formData.vehicleType}
                          onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-anton uppercase tracking-widest outline-none focus:bg-white focus:border-primary/20 transition-all appearance-none"
                        >
                          <option value="Motorcycle">Motorcycle</option>
                          <option value="Electric Bike">Electric Bike</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Registry Plate</label>
                        <input
                          type="text"
                          value={formData.vehicleLicensePlate}
                          onChange={(e) => setFormData({ ...formData, vehicleLicensePlate: e.target.value })}
                          placeholder="e.g. 59-X1 123.45"
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-anton uppercase tracking-[0.2em] outline-none focus:bg-white focus:border-primary/20 transition-all"
                        />
                      </div>

                      <div className="col-span-2 p-8 bg-lime-50 rounded-[32px] border border-lime-100">
                        <div className="flex justify-between items-center mb-6">
                          <div>
                            <label className="text-[10px] font-black text-lime-600 uppercase tracking-widest block mb-1">COD Liability Limit</label>
                            <span className="text-3xl font-anton text-[#1A1A1A]">{new Intl.NumberFormat('vi-VN').format(formData.codLimit)}đ</span>
                          </div>
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-lime-500 shadow-sm border border-lime-100">
                            <ShieldCheck size={24} />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="10000000"
                          step="500000"
                          value={formData.codLimit}
                          onChange={(e) => setFormData({ ...formData, codLimit: parseInt(e.target.value) })}
                          className="w-full accent-lime-500 h-2 bg-white rounded-full appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center gap-6">
                {step === 1 ? (
                  <>
                    <div className="text-gray-400 text-xs font-medium">Please select a user to continue to fleet configuration.</div>
                    <button
                      disabled={!selectedUser}
                      onClick={() => setStep(2)}
                      className="px-10 py-5 bg-[#1A1A1A] text-white rounded-[24px] font-anton text-lg uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl disabled:opacity-30 flex items-center gap-3"
                    >
                      Next Phase
                      <ChevronRight size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-5 text-[#1A1A1A] font-anton text-lg uppercase tracking-widest hover:text-primary transition-all"
                    >
                      Back
                    </button>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="px-10 py-5 bg-primary text-white rounded-[24px] font-anton text-lg uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-primary/20 flex items-center gap-3"
                    >
                      {isSubmitting ? <LoadingSpinner size={20} color="white" /> : (
                        <>
                          Complete Onboarding
                          <CheckCircle size={20} />
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
