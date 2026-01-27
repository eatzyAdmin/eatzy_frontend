'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Bike, MapPin, Phone, Star,
  Info, Clock, ShieldCheck, Mail, Building2,
  ChevronRight, Calendar, User, FileText, Wallet, Play, Pause, AlertCircle, Navigation
} from 'lucide-react';
import { ImageWithFallback } from '@repo/ui';
import { DriverProfile, VerificationStatus } from '@repo/types';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface DriverDetailsModalProps {
  driver: DriverProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DriverDetailsModal({ driver, isOpen, onClose }: DriverDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getStatusColor = (status?: VerificationStatus) => {
    switch (status) {
      case 'APPROVED': return 'text-lime-500 bg-lime-50 border-lime-100';
      case 'PENDING': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'REJECTED': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-gray-400 bg-gray-50 border-gray-100';
    }
  };

  const VerificationBadge = ({ status, label }: { status?: VerificationStatus, label: string }) => (
    <div className={`px-4 py-2 rounded-xl border flex items-center justify-between gap-3 ${getStatusColor(status)}`}>
      <div className="flex items-center gap-2">
        {status === 'APPROVED' ? <ShieldCheck size={14} /> : status === 'PENDING' ? <Clock size={14} /> : status === 'REJECTED' ? <X size={14} /> : <AlertCircle size={14} />}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-[9px] font-black uppercase">{status || 'NOT SUBMITTED'}</span>
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && driver && (
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
              className="bg-[#FDFDFD] w-full max-w-5xl rounded-[50px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] pointer-events-auto flex flex-col max-h-[92vh] border border-white/40 relative"
            >
              {/* Close Button Inside Modal */}
              <div className="absolute top-8 right-10 z-[120]">
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-full bg-black/5 backdrop-blur-md border border-black/5 flex items-center justify-center text-gray-500 hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pb-16">
                {/* Hero Section */}
                <div className="relative h-[240px] w-full group/hero overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A]">
                    {/* Dynamic accent glow */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full" />
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  </div>

                  <div className="absolute inset-0 flex items-center px-12 pt-0">
                    <div className="flex items-center gap-10 w-full">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 flex-shrink-0"
                      >
                        <div className="p-1.5 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl">
                          <div className="w-36 h-36 rounded-[28px] overflow-hidden bg-gray-900 relative">
                            <ImageWithFallback
                              src={driver.profile_photo || ''}
                              alt={driver.user.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-[#1A1A1A] shadow-xl flex items-center justify-center
                          ${driver.status === 'AVAILABLE' ? 'bg-lime-500 shadow-lime-500/20' : driver.status === 'BUSY' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gray-400'}`}>
                          {driver.status === 'AVAILABLE' ? <Play className="w-3 h-3 text-white fill-current" /> : driver.status === 'BUSY' ? <Navigation className="w-3 h-3 text-white" /> : <Pause className="w-3 h-3 text-white fill-current" />}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex-1"
                      >
                        <div className="flex items-center gap-2.5 mb-3">
                          <span className="px-3 py-1 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 text-white/50 text-[9px] font-black uppercase tracking-[0.2em]">
                            {driver.vehicle_type || 'MOTORCYCLE'}
                          </span>
                          <span className="px-3 py-1 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20 text-primary text-[9px] font-black uppercase tracking-[0.2em]">
                            PARTNER ID #{driver.id}
                          </span>
                        </div>

                        <h1 className="text-5xl font-anton text-white uppercase tracking-tight mb-5 drop-shadow-2xl">
                          {driver.user.name}
                        </h1>

                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                            <Mail size={14} className="text-primary/70" />
                            <span className="text-xs font-medium text-white/70 tracking-tight">{driver.user.email}</span>
                          </div>
                          <div className="flex items-center gap-3 bg-amber-400/10 backdrop-blur-md px-4 py-2 rounded-xl border border-amber-400/20">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-anton text-amber-400 mt-0.5">{driver.averageRating?.toFixed(1) || '0.0'}</span>
                            <div className="w-px h-3 bg-amber-400/20 mx-0.5" />
                            <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-widest">{driver.completedTrips || 0} TRIPS</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                  {/* Identification & Compliance */}
                  <div className="md:col-span-2 space-y-6">

                    {/* Verification Status Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                          <ShieldCheck size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Compliance Dossier</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <VerificationBadge status={driver.profile_photo_status} label="Identity Profile" />
                        <VerificationBadge status={driver.national_id_status} label="National Credentials" />
                        <VerificationBadge status={driver.driver_license_status} label="Mobility Permit" />
                        <VerificationBadge status={driver.bank_account_status} label="Financial Channel" />
                        <VerificationBadge status={driver.vehicle_registration_status} label="Vehicle Authority" />
                        <VerificationBadge status={driver.vehicle_insurance_status} label="Asset Protection" />
                      </div>
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 overflow-hidden relative group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Wallet size={80} className="text-primary" />
                      </div>
                      <div className="flex items-center gap-3 mb-6 text-lime-600">
                        <Wallet size={20} />
                        <h4 className="font-anton text-lg tracking-tight uppercase">Financial Capability</h4>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">COD Acceptance Limit</p>
                          <div className="text-3xl font-anton text-[#1A1A1A]">
                            {new Intl.NumberFormat('vi-VN').format(driver.codLimit || 0)}đ
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tax Identification</p>
                          <div className="text-xl font-anton text-gray-900 uppercase tracking-wider">
                            {driver.tax_code || 'UNKWN-00'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bank Information Details */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center shadow-sm">
                          <Building2 size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Payout Information</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Institution</span>
                            <span className="font-anton text-gray-900 uppercase tracking-tight">{driver.bank_name || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Branch Location</span>
                            <span className="font-bold text-gray-700 text-sm italic">{driver.bank_branch || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="space-y-4 font-anton uppercase tracking-tight">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Holder</span>
                            <span className="text-gray-900">{driver.bank_account_holder || 'N/A'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Number</span>
                            <span className="text-primary tracking-widest">{driver.bank_account_number || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Stats (Vehicle & Identity Documents) */}
                  <div className="space-y-6">

                    {/* Fleet Information Card */}
                    <div className="bg-[#1A1A1A] rounded-[32px] p-8 shadow-2xl text-white overflow-hidden relative">
                      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Fleet Info</p>
                          <h4 className="font-anton text-lg tracking-tight uppercase">Assigned Asset</h4>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                          <Bike size={24} className="text-primary" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="text-center py-4 bg-white/5 rounded-2xl border border-white/10">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">License Plate</p>
                          <div className="text-4xl font-anton text-white tracking-[0.2em]">{driver.vehicle_license_plate || '---'}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Brand</span>
                            <span className="font-anton text-gray-200">{driver.vehicle_brand || '---'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Model</span>
                            <span className="font-anton text-gray-200">{driver.vehicle_model || '---'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Year</span>
                            <span className="font-anton text-gray-200">{driver.vehicle_year || '---'}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Type</span>
                            <span className="font-anton text-gray-200 uppercase">{driver.vehicle_type || '---'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Identity Details Card */}
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center shadow-sm">
                          <FileText size={20} />
                        </div>
                        <h4 className="font-anton text-lg tracking-tight text-[#1A1A1A] uppercase">Partner Identity</h4>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">National ID Number</p>
                          <p className="font-anton text-gray-900 tracking-widest text-lg">{driver.national_id_number || '---'}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Driver License Class</p>
                          <p className="font-anton text-primary text-2xl">{driver.driver_license_class || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer Banner */}
                <div className="bg-[#1A1A1A] mx-8 mt-12 p-1 rounded-[40px] shadow-2xl overflow-hidden group">
                  <div className="bg-white/5 rounded-[38px] p-10 flex items-center justify-between backdrop-blur-md">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/20 flex items-center justify-center text-primary">
                        <ShieldCheck size={32} />
                      </div>
                      <div>
                        <h5 className="font-anton text-2xl text-white uppercase tracking-tight mb-2">Partner Integrity Audit</h5>
                        <p className="text-gray-400 text-sm font-medium max-w-lg leading-relaxed">This profile contains sensitive identification. Ensure all documents are cross-verified against official national databases before approval.</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-10 py-5 bg-primary text-white rounded-2xl font-anton text-lg uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 shadow-2xl flex items-center gap-4"
                    >
                      Exit Dossier
                      <ChevronRight size={24} />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
