'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Bike, Phone, Star,
  ShieldCheck, User, FileText, Wallet, ChevronRight, CheckCircle, Trash2
} from 'lucide-react';
import { ImageWithFallback, LoadingSpinner, useNotification } from '@repo/ui';
import { DriverProfile, DriverStatus, VerificationStatus } from '@repo/types';

interface EditDriverModalProps {
  driver: DriverProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<DriverProfile>) => Promise<void>;
}

export default function EditDriverModal({ driver, isOpen, onClose, onSave }: EditDriverModalProps) {
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'VEHICLE' | 'FINANCE' | 'SYSTEM'>('IDENTITY');
  const [formData, setFormData] = useState<Partial<DriverProfile>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (driver && isOpen) {
      setFormData(driver);
    }
  }, [driver, isOpen]);

  if (!mounted) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(formData);
      showNotification({ message: 'Driver dossier updated successfully', type: 'success' });
      onClose();
    } catch (err) {
      showNotification({ message: 'Audit update failed', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateVerification = (field: keyof DriverProfile, status: VerificationStatus, reasonField?: keyof DriverProfile) => {
    const newData = { ...formData, [field]: status };
    if (status === 'APPROVED' && reasonField) {
      (newData as any)[reasonField] = '';
    }
    setFormData(newData);
  };

  const VerificationControl = ({
    label,
    statusField,
    reasonField,
    imageUrl
  }: {
    label: string,
    statusField: keyof DriverProfile,
    reasonField?: keyof DriverProfile,
    imageUrl?: string
  }) => {
    const status = formData[statusField] as VerificationStatus;
    const reason = reasonField ? (formData[reasonField] as string) : '';

    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${status === 'APPROVED' ? 'bg-lime-50 text-lime-600' : status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
              <FileText size={20} />
            </div>
            <div>
              <h5 className="font-anton text-sm uppercase tracking-tight text-gray-900">{label}</h5>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status || 'PENDING VERIFICATION'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateVerification(statusField, 'APPROVED', reasonField)}
              className={`p-2 rounded-xl border-2 transition-all ${status === 'APPROVED' ? 'bg-lime-500 border-lime-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-lime-200 hover:text-lime-500'}`}
            >
              <CheckCircle size={18} />
            </button>
            <button
              onClick={() => updateVerification(statusField, 'REJECTED')}
              className={`p-2 rounded-xl border-2 transition-all ${status === 'REJECTED' ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {imageUrl && (
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 group">
            <ImageWithFallback src={imageUrl} alt={label} fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button className="px-6 py-2 bg-white rounded-full text-[10px] font-black uppercase tracking-widest text-[#1A1A1A] shadow-xl">Inspect Full Resolution</button>
            </div>
          </div>
        )}

        {status === 'REJECTED' && reasonField && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[9px] font-bold text-red-400 uppercase tracking-widest block mb-2 px-1">Reason for Rejection</label>
            <textarea
              value={reason}
              onChange={(e) => setFormData({ ...formData, [reasonField]: e.target.value })}
              className="w-full bg-red-50/50 border-2 border-red-100 rounded-2xl p-4 text-xs font-medium text-red-900 placeholder:text-red-200 outline-none focus:bg-white transition-all min-h-[80px] resize-none"
              placeholder="Please specify why this document was rejected (e.g. blurry, expired, invalid name)..."
            />
          </div>
        )}
      </div>
    );
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all border-2
        ${activeTab === id
          ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-2xl translate-x-2'
          : 'bg-white border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
    >
      <Icon size={18} className={activeTab === id ? 'text-primary' : ''} />
      <span className="text-[11px] font-anton uppercase tracking-widest">{label}</span>
      {activeTab === id && <ChevronRight size={14} className="ml-auto text-primary" />}
    </button>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100]"
          />

          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-6xl h-[92vh] rounded-[50px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] pointer-events-auto flex border border-white/20"
            >
              {/* Sidebar Navigation */}
              <div className="w-[300px] border-r border-gray-200 bg-white flex flex-col p-8">
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    <h3 className="text-2xl font-anton uppercase tracking-tight text-gray-900">Partner Audit</h3>
                  </div>
                  <p className="text-xs font-medium text-gray-400">Verifying compliance for integrity assurance.</p>
                </div>

                <div className="flex-1 flex flex-col gap-3">
                  <TabButton id="IDENTITY" label="Personal Identity" icon={User} />
                  <TabButton id="VEHICLE" label="Fleet Compliance" icon={Bike} />
                  <TabButton id="FINANCE" label="Financial Config" icon={Wallet} />
                  <TabButton id="SYSTEM" label="System Overrides" icon={ShieldCheck} />
                </div>

                <div className="mt-auto space-y-4">
                  <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.status === 'AVAILABLE' ? 'bg-lime-500' : 'bg-gray-400'}`}>
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{formData.status}</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Status Override</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as DriverStatus })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary transition-colors"
                      >
                        <option value="AVAILABLE">Available</option>
                        <option value="BUSY">Busy</option>
                        <option value="OFFLINE">Offline</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-primary text-white rounded-[24px] font-anton text-lg uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <LoadingSpinner size={20} color="white" /> : (
                      <>
                        <span>Save Audit</span>
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main View Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-12 bg-gray-50/50">
                <AnimatePresence mode="wait">
                  {activeTab === 'IDENTITY' && (
                    <motion.div
                      key="identity"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-3xl font-anton uppercase text-gray-900 mb-2">Personal Validation</h4>
                          <p className="text-sm font-medium text-gray-400 italic">Audit core identity documents and profile representation.</p>
                        </div>
                        <div className="w-16 h-16 rounded-[24px] bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                          <User size={32} className="text-primary" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <VerificationControl
                            label="Official Profile Portrait"
                            statusField="profile_photo_status"
                            reasonField="profile_photo_rejection_reason"
                            imageUrl={formData.profile_photo}
                          />
                        </div>
                        <VerificationControl
                          label="National ID Frontage"
                          statusField="national_id_status"
                          reasonField="national_id_rejection_reason"
                          imageUrl={formData.national_id_front}
                        />
                        <VerificationControl
                          label="National ID Rear"
                          statusField="national_id_status"
                          imageUrl={formData.national_id_back}
                        />

                        <div className="col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4">Identity Details Configuration</h5>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Full Legal Name</label>
                              <input
                                type="text"
                                value={formData.user?.name}
                                disabled
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-anton uppercase tracking-tight text-gray-900"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Email Access Point</label>
                              <input
                                type="text"
                                value={formData.user?.email}
                                disabled
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium text-gray-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">National ID Register</label>
                              <input
                                type="text"
                                value={formData.national_id_number}
                                onChange={(e) => setFormData({ ...formData, national_id_number: e.target.value })}
                                className="w-full bg-gray-50 border border-transparent focus:border-primary/20 focus:bg-white rounded-xl px-4 py-3 text-sm font-anton tracking-[0.2em] outline-none transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'VEHICLE' && (
                    <motion.div
                      key="vehicle"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-3xl font-anton uppercase text-gray-900 mb-2">Fleet Integrity</h4>
                          <p className="text-sm font-medium text-gray-400 italic">Verification of vehicle legality and asset protection.</p>
                        </div>
                        <div className="w-16 h-16 rounded-[24px] bg-[#1A1A1A] text-white flex items-center justify-center shadow-2xl">
                          <Bike size={32} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <VerificationControl
                          label="Vehicle Registration Asset"
                          statusField="vehicle_registration_status"
                          reasonField="vehicle_registration_rejection_reason"
                          imageUrl={formData.vehicle_registration_image}
                        />
                        <VerificationControl
                          label="Asset Insurance Certificate"
                          statusField="vehicle_insurance_status"
                          reasonField="vehicle_insurance_rejection_reason"
                          imageUrl={formData.vehicle_insurance_image}
                        />
                        <VerificationControl
                          label="External Vehicle Portrait"
                          statusField="vehicle_photo_status"
                          reasonField="vehicle_photo_rejection_reason"
                          imageUrl={formData.vehicle_photo}
                        />
                        <VerificationControl
                          label="Operator Mobility Permit"
                          statusField="driver_license_status"
                          reasonField="driver_license_rejection_reason"
                          imageUrl={formData.driver_license_image}
                        />

                        <div className="col-span-2 bg-[#1A1A1A] rounded-[40px] p-10 shadow-3xl text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-10 opacity-5">
                            <Bike size={200} />
                          </div>
                          <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-10 border-b border-white/5 pb-6">Asset Specifications Config</h5>
                          <div className="grid grid-cols-3 gap-8 relative z-10">
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">License Registry</label>
                              <input
                                type="text"
                                value={formData.vehicle_license_plate}
                                onChange={(e) => setFormData({ ...formData, vehicle_license_plate: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xl font-anton tracking-[0.3em] outline-none focus:border-primary transition-all text-white uppercase"
                                placeholder="REG-0000"
                              />
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Fleet Classification</label>
                              <select
                                value={formData.vehicle_type}
                                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-anton uppercase tracking-widest outline-none focus:border-primary transition-all text-white appearance-none"
                              >
                                <option value="Motorcycle">Motorcycle</option>
                                <option value="Electric Bike">Electric Bike</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">Asset Core ID</label>
                              <div className="flex gap-4">
                                <input
                                  type="text"
                                  value={formData.vehicle_brand}
                                  onChange={(e) => setFormData({ ...formData, vehicle_brand: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-anton uppercase outline-none focus:border-primary transition-all text-white"
                                  placeholder="Brand"
                                />
                                <input
                                  type="text"
                                  value={formData.vehicle_model}
                                  onChange={(e) => setFormData({ ...formData, vehicle_model: e.target.value })}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-anton uppercase outline-none focus:border-primary transition-all text-white"
                                  placeholder="Model"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'FINANCE' && (
                    <motion.div
                      key="finance"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-3xl font-anton uppercase text-[#1A1A1A] mb-2">Payout Architecture</h4>
                          <p className="text-sm font-medium text-gray-400 italic">Financial channel verification and credit limits.</p>
                        </div>
                        <div className="w-16 h-16 rounded-[24px] bg-lime-500 text-white flex items-center justify-center shadow-xl">
                          <Wallet size={32} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                          <VerificationControl
                            label="Payout Channel Verification"
                            statusField="bank_account_status"
                            reasonField="bank_account_rejection_reason"
                            imageUrl={formData.bank_account_image}
                          />
                        </div>

                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-4">Bank Registry Details</h5>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Institution</label>
                                <input
                                  type="text"
                                  value={formData.bank_name}
                                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-anton uppercase outline-none focus:bg-white transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Branch</label>
                                <input
                                  type="text"
                                  value={formData.bank_branch}
                                  onChange={(e) => setFormData({ ...formData, bank_branch: e.target.value })}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-xs font-anton uppercase outline-none focus:bg-white transition-all"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Account Holder Name</label>
                              <input
                                type="text"
                                value={formData.bank_account_holder}
                                onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-anton uppercase tracking-widest outline-none focus:bg-white transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Account Digits</label>
                              <input
                                type="text"
                                value={formData.bank_account_number}
                                onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-lg font-anton tracking-[0.3em] text-primary outline-none focus:bg-white transition-all"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-6">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-4">Revenue & Operations</h5>
                          <div className="space-y-8">
                            <div className="p-6 bg-lime-50/50 rounded-3xl border border-lime-100">
                              <label className="text-[10px] font-black text-lime-600 uppercase tracking-widest block mb-3">COD Velocity Limit</label>
                              <div className="flex items-center gap-4">
                                <div className="text-3xl font-anton text-[#1A1A1A]">
                                  {new Intl.NumberFormat('vi-VN').format(formData.codLimit || 0)}đ
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="10000000"
                                  step="500000"
                                  value={formData.codLimit || 0}
                                  onChange={(e) => setFormData({ ...formData, codLimit: parseInt(e.target.value) })}
                                  className="flex-1 accent-lime-500 h-2 rounded-full"
                                />
                              </div>
                              <p className="text-[9px] font-medium text-gray-400 mt-4 leading-tight italic">Determines the maximum total amount of Cash on Delivery orders this partner can hold simultaneously.</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1">Taxation Identifier</label>
                              <input
                                type="text"
                                value={formData.tax_code}
                                onChange={(e) => setFormData({ ...formData, tax_code: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-anton tracking-widest outline-none focus:bg-white transition-all"
                                placeholder="MST-000000000"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'SYSTEM' && (
                    <motion.div
                      key="system"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-3xl font-anton uppercase text-gray-900 mb-2">System Overrides</h4>
                          <p className="text-sm font-medium text-gray-400 italic">Advanced administrative control and performance metrics.</p>
                        </div>
                        <div className="w-16 h-16 rounded-[24px] bg-violet-500 text-white flex items-center justify-center shadow-xl">
                          <ShieldCheck size={32} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm col-span-2">
                          <div className="flex items-center gap-3 mb-8 text-violet-600">
                            <ShieldCheck size={20} />
                            <h5 className="font-anton text-lg tracking-tight uppercase">Security & Conduct Audit</h5>
                          </div>
                          <div className="grid grid-cols-2 gap-10">
                            <VerificationControl
                              label="Criminal Record Clearance"
                              statusField="criminal_record_status"
                              reasonField="criminal_record_rejection_reason"
                              imageUrl={formData.criminal_record_image}
                            />
                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Conduct Rating Override</label>
                                <div className="flex items-center gap-4">
                                  <div className="text-4xl font-anton text-amber-500">{formData.averageRating?.toFixed(1) || '0.0'}</div>
                                  <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={formData.averageRating || 0}
                                    onChange={(e) => setFormData({ ...formData, averageRating: parseFloat(e.target.value) })}
                                    className="flex-1 accent-amber-500"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Completed Lifecycle Trips</label>
                                <input
                                  type="number"
                                  value={formData.completedTrips}
                                  onChange={(e) => setFormData({ ...formData, completedTrips: parseInt(e.target.value) })}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-2xl font-anton outline-none focus:bg-white transition-all"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Header Close Button (Absolute) */}
              <button
                onClick={onClose}
                className="absolute top-8 right-10 w-12 h-12 rounded-full bg-black/5 hover:bg-black hover:text-white flex items-center justify-center transition-all z-[120]"
              >
                <X size={20} />
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
