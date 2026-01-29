'use client';

import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, User, Phone, Mail, Calendar, MapPin,
  CheckCircle2, XCircle, Clock, ShieldCheck,
  Package, ShoppingBag, Star, CreditCard
} from 'lucide-react';
import { ResCustomerProfileDTO } from '@repo/types';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ImageWithFallback } from '@repo/ui';

interface CustomerDetailsModalProps {
  customer: ResCustomerProfileDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDetailsModal({
  customer,
  isOpen,
  onClose
}: CustomerDetailsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [displayCustomer, setDisplayCustomer] = useState<ResCustomerProfileDTO | null>(customer);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (customer) {
      setDisplayCustomer(customer);
    }
  }, [customer]);

  if (!mounted) return null;

  const activeCustomer = isOpen ? customer : displayCustomer;
  if (!activeCustomer) return null;

  const isActive = activeCustomer.user.isActive;
  const dob = activeCustomer.date_of_birth ? new Date(activeCustomer.date_of_birth) : null;
  const createdAt = activeCustomer.createdAt ? new Date(activeCustomer.createdAt) : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xl z-[800]"
          />

          <div className="fixed inset-0 z-[810] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-[#F8F9FA] w-full max-w-3xl rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col max-h-[92vh] relative border border-white/20"
            >
              {/* Header */}
              <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">

                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] uppercase tracking-tight">CUSTOMER DOSSIER</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-400 uppercase tracking-wider uppercase">Account ID:</span>
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-mono">
                        {activeCustomer.user.id.toString().padStart(6, '0')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm border flex items-center gap-2
                    ${isActive ? 'bg-lime-100 text-lime-700 border-lime-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    {isActive ? 'Active Member' : 'Account Disabled'}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-700 hover:bg-gray-200 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                {/* Profile Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bio Card */}
                  <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col items-center text-center">
                    <div className="relative mb-4 group">
                      <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-gray-50 shadow-inner relative bg-gray-100 transition-transform duration-300 group-hover:scale-105">
                        <ImageWithFallback
                          src={activeCustomer.user.avatar || ''}
                          alt={activeCustomer.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl border-4 border-white flex items-center justify-center shadow-lg
                        ${isActive ? 'bg-lime-500 text-white' : 'bg-gray-400 text-white'}`}>
                        <ShieldCheck size={14} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-anton text-[#1A1A1A] uppercase tracking-tight line-clamp-1">{activeCustomer.user.name}</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Platform Customer</p>

                    <div className="mt-6 w-full pt-6 border-t border-gray-100 space-y-4">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone size={14} className="text-primary" />
                        <span className="text-sm font-bold text-[#1A1A1A]">{activeCustomer.user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Mail size={14} className="text-primary" />
                        <span className="text-sm font-bold text-[#1A1A1A] truncate">{activeCustomer.user.email || 'No email provided'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Info Card */}
                  <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 flex flex-col justify-center">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Birthday</span>
                          <span className="font-bold text-[#1A1A1A] text-base">
                            {dob ? format(dob, 'MMMM d, yyyy') : 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Hometown</span>
                          <span className="font-bold text-[#1A1A1A] text-base line-clamp-1">
                            {activeCustomer.hometown || 'Not specified'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                          <Clock size={20} />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Member Since</span>
                          <span className="font-bold text-[#1A1A1A] text-base">
                            {createdAt ? format(createdAt, 'MMM yyyy') : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics Placeholder (Mock) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform group hover:scale-110">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="text-2xl font-anton text-[#1A1A1A]">--</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</div>
                  </div>
                  <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    <div className="w-10 h-10 rounded-2xl bg-lime-50 text-lime-600 flex items-center justify-center mb-4 transition-transform group hover:scale-110">
                      <CreditCard size={20} />
                    </div>
                    <div className="text-2xl font-anton text-[#1A1A1A]">--</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Spent</div>
                  </div>
                  <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 transition-transform group hover:scale-110">
                      <Star size={20} />
                    </div>
                    <div className="text-2xl font-anton text-[#1A1A1A]">--</div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Review Count</div>
                  </div>
                </div>

                {/* Security Section */}
                <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={20} className="text-primary" />
                    <h4 className="font-anton text-lg tracking-tight uppercase">Security & Privacy</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium mb-0">
                    Hồ sơ khách hàng này được bảo vệ bởi chính sách bảo mật của Eatzy. Các thay đổi về trạng thái tài khoản sẽ được ghi lại trong nhật ký hệ thống.
                  </p>
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
