'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from '@repo/ui/motion';
import {
  X, Building2, MapPin, Phone, Info, Star,
  Image as ImageIcon, ArrowRight, CheckCircle,
  AlertCircle, Percent, Clock, Play, Pause, Lock, ShieldCheck
} from 'lucide-react';
import {
  LoadingSpinner, useNotification, ImageWithFallback
} from '@repo/ui';
import { Restaurant, RestaurantStatus } from '@repo/types';
import { useFileUpload } from '../hooks/useFileUpload';

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: Restaurant;
}

export default function CreateRestaurantModal({
  isOpen,
  onClose,
  onSave,
  initialData
}: CreateRestaurantModalProps) {
  const { showNotification } = useNotification();
  const { uploadFile, isUploading: isGlobalUploading } = useFileUpload();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<any>({
    name: '',
    address: '',
    description: '',
    contactPhone: '',
    status: 'OPEN' as RestaurantStatus,
    commissionRate: 10,
    avatarUrl: '',
    coverImageUrl: '',
    latitude: 10.762622,
    longitude: 106.660172
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Reset file and preview states
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarPreview('');
      setCoverPreview('');

      if (initialData) {
        setFormData({
          ...initialData,
        });
      } else {
        setFormData({
          name: '',
          address: '',
          description: '',
          contactPhone: '',
          status: 'OPEN',
          commissionRate: 10,
          avatarUrl: '',
          coverImageUrl: '',
          latitude: 10.762622,
          longitude: 106.660172
        });
      }
    } else {
      // Clear form data when closed to prevent ghosting
      setFormData({
        name: '',
        address: '',
        description: '',
        contactPhone: '',
        status: 'OPEN' as RestaurantStatus,
        commissionRate: 0.1,
        avatarUrl: '',
        coverImageUrl: '',
        latitude: 10.762622,
        longitude: 106.660172
      });
    }
  }, [initialData, isOpen]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === 'avatar') {
      setAvatarFile(file);
      setAvatarPreview(previewUrl);
    } else {
      setCoverFile(file);
      setCoverPreview(previewUrl);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address) {
      showNotification({ message: 'Please fill in required fields', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      let avatarUrl = formData.avatarUrl;
      let coverImageUrl = formData.coverImageUrl;

      // Only upload if new files are selected
      if (avatarFile) {
        const uploadedAvatar = await uploadFile(avatarFile, 'restaurants');
        if (uploadedAvatar) avatarUrl = uploadedAvatar;
      }

      if (coverFile) {
        const uploadedCover = await uploadFile(coverFile, 'restaurants');
        if (uploadedCover) coverImageUrl = uploadedCover;
      }

      await onSave({
        ...formData,
        avatarUrl,
        coverImageUrl
      });

      showNotification({
        message: initialData ? 'Restaurant updated successfully' : 'Restaurant created successfully',
        type: 'success'
      });
      onClose();
    } catch (error) {
      showNotification({ message: 'Failed to save restaurant', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = formData.name && formData.address && formData.contactPhone;

  if (!mounted) return null;

  const STATUS_CONFIG: Record<RestaurantStatus, any> = {
    OPEN: { icon: Play, color: 'text-lime-500', bg: 'bg-lime-50', border: 'border-lime-200' },
    CLOSED: { icon: Pause, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' },
    LOCKED: { icon: Lock, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
    PENDING: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    REJECTED: { icon: X, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-300' }
  };

  const currentStatus = STATUS_CONFIG[formData.status as RestaurantStatus] || STATUS_CONFIG.CLOSED;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
              key={initialData?.id || 'new-restaurant'}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#F8F9FA] w-full max-w-6xl h-[95vh] rounded-[40px] overflow-hidden shadow-2xl pointer-events-auto flex border border-white/20"
            >
              {/* LEFT PANEL: Form Input (60%) */}
              <div className="w-full md:w-[60%] bg-white border-r border-gray-200 flex flex-col relative z-10">
                {/* Header */}
                <div className="p-8 pb-4 border-b border-gray-100 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-anton font-bold text-[#1A1A1A] mb-1 uppercase tracking-tight">
                      {initialData ? 'Edit Partner' : 'Add New Partner'}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium">Configure restaurant identity and operational rules.</p>
                  </div>
                  {initialData && (
                    <div className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold font-mono text-gray-500 tracking-widest">
                      ID: #{initialData.id}
                    </div>
                  )}
                </div>

                {/* Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

                  {/* Status & Operating Mode */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ShieldCheck size={14} className="text-primary" /> Operating Status
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {(['OPEN', 'CLOSED', 'PENDING', 'LOCKED'] as RestaurantStatus[]).map((status) => {
                        const config = STATUS_CONFIG[status];
                        const Icon = config.icon;
                        const active = formData.status === status;
                        return (
                          <button
                            key={status}
                            onClick={() => setFormData({ ...formData, status })}
                            className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all group
                              ${active
                                ? `${config.bg} ${config.border} ${config.color} shadow-md scale-105`
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                          >
                            <Icon size={20} />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{status}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Building2 size={14} className="text-primary" /> Identity & Contact
                    </label>
                    <div className="bg-white p-1 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
                      <div className="group transition-all">
                        <div className="p-4 bg-gray-50 rounded-2xl group-focus-within:bg-white border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:ring-4 group-focus-within:ring-primary/[0.03] transition-all">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Restaurant Name</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-transparent font-anton text-lg text-gray-900 outline-none placeholder:text-gray-300 uppercase tracking-tight"
                            placeholder="e.g. THE PIZZA COMPANY"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
                        <div className="group transition-all">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Contact Phone</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-primary/[0.03] transition-all">
                            <Phone size={14} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                              type="text"
                              value={formData.contactPhone}
                              onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                              className="w-full bg-transparent font-bold text-gray-900 outline-none placeholder:text-gray-300 text-sm"
                              placeholder="0901234567"
                            />
                          </div>
                        </div>
                        <div className="group transition-all">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Commission Rate</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-primary/[0.03] transition-all">
                            <Percent size={14} className="text-gray-400 group-focus-within:text-primary transition-colors" />
                            <input
                              type="number"
                              step="0.01"
                              value={formData.commissionRate}
                              onChange={e => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) })}
                              className="w-full bg-transparent font-bold text-gray-900 outline-none placeholder:text-gray-300 text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <div className="group transition-all">
                          <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Store Address</label>
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border-2 border-transparent group-focus-within:border-primary/20 group-focus-within:bg-white group-focus-within:ring-4 group-focus-within:ring-primary/[0.03] transition-all">
                            <MapPin size={14} className="text-gray-400 group-focus-within:text-primary transition-colors shrink-0" />
                            <input
                              type="text"
                              value={formData.address}
                              onChange={e => setFormData({ ...formData, address: e.target.value })}
                              className="w-full bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-300"
                              placeholder="Street address, district, city..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Info size={14} className="text-primary" /> Additional Information
                    </label>
                    <div className="group transition-all">
                      <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-50 border-2 border-transparent rounded-[32px] p-6 text-sm font-medium text-gray-900 group-focus-within:bg-white group-focus-within:border-primary/20 group-focus-within:ring-4 group-focus-within:ring-primary/[0.03] transition-all outline-none resize-none min-h-[140px] shadow-sm"
                        placeholder="Tell us more about this restaurant, its specialty, and brand story..."
                      />
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <ImageIcon size={14} className="text-primary" /> Visual Assets
                    </label>

                    <div className="grid grid-cols-2 gap-6">
                      {/* Avatar Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block px-1">Brand Logo / Avatar</label>
                        <div
                          onClick={() => avatarInputRef.current?.click()}
                          className="w-full aspect-square rounded-[32px] border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group shadow-sm bg-gray-50/50"
                        >
                          {(avatarPreview || formData.avatarUrl) ? (
                            <>
                              <img
                                src={avatarPreview || formData.avatarUrl}
                                className="w-full h-full object-cover"
                                alt="Avatar"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-white font-bold text-[10px] uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-white/20 whitespace-nowrap">Change Logo</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                <Building2 size={24} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight">Select<br />Logo</span>
                            </div>
                          )}
                          <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'avatar')} />
                        </div>
                      </div>

                      {/* Cover Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400 block px-1">Cover Promotion Image</label>
                        <div
                          onClick={() => coverInputRef.current?.click()}
                          className="w-full aspect-square rounded-[32px] border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group shadow-sm bg-gray-50/50"
                        >
                          {(coverPreview || formData.coverImageUrl) ? (
                            <>
                              <img
                                src={coverPreview || formData.coverImageUrl}
                                className="w-full h-full object-cover"
                                alt="Cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span className="text-white font-bold text-[10px] uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-white/20 whitespace-nowrap">Change Cover</span>
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400 flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                <ImageIcon size={24} />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4 leading-tight">Select<br />Cover</span>
                            </div>
                          )}
                          <input type="file" ref={coverInputRef} hidden accept="image/*" onChange={(e) => handleImageUpload(e, 'cover')} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: Preview & Action (40%) */}
              <div className="w-[40%] bg-[#F8F9FA] flex flex-col h-full relative z-20 border-l border-white/50 hidden md:flex">
                <div className="flex-1 p-8 custom-scrollbar">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="font-anton text-xl text-gray-900 uppercase tracking-tight">Live Preview</h4>
                    <button onClick={onClose} className="p-4 bg-gray-200 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-300 shadow-sm flex items-center justify-center transition-all">
                      <X size={20} strokeWidth={2.4} />
                    </button>
                  </div>

                  {/* Preview Card */}
                  <div className="w-full rounded-[40px] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 mb-10 group/card">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={coverPreview || formData.coverImageUrl || ''}
                        alt="Cover Preview"
                        fill
                        className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Avatar Overlay */}
                      <div className="absolute -bottom-6 left-6 p-1.5 bg-white rounded-3xl shadow-xl z-20">
                        <div className="relative w-16 h-16 rounded-[22px] overflow-hidden bg-gray-50 border border-gray-100">
                          <ImageWithFallback
                            src={avatarPreview || formData.avatarUrl || ''}
                            alt="Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Status Tag */}
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md border flex items-center gap-1.5 shadow-lg ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current shadow-sm ${formData.status === 'OPEN' ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{formData.status}</span>
                      </div>
                    </div>

                    <div className="p-8 pt-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-anton text-2xl text-gray-900 uppercase tracking-tight line-clamp-1 mb-1">
                            {formData.name || 'NEW PARTNER NAME'}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <MapPin size={12} className="text-gray-300" />
                            <span className="truncate max-w-[180px]">{formData.address || 'Address not set'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Commission</div>
                          <div className="font-anton text-xl text-primary">{formData.commissionRate}%</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 py-4 border-t border-gray-50 mt-4">
                        <div className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={10} className="text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-gray-400">5.0</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">0 Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-gray-200/50 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.02)]">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || isGlobalUploading || !isValid}
                    className={`group w-full py-5 bg-primary text-white rounded-[28px] font-anton text-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-primary/40 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
                      ${(isSubmitting || isGlobalUploading || !isValid)
                        ? 'opacity-30 shadow-none'
                        : 'hover:bg-[#1A1A1A] hover:text-white hover:shadow-black/20'}`}
                  >
                    {(isSubmitting || isGlobalUploading) ? <LoadingSpinner size={24} color="white" /> : (
                      <>
                        <span>{initialData ? 'Save Changes' : 'Launch Restaurant'}</span>
                        <CheckCircle size={26} className={`${(!isValid || isSubmitting) ? '' : 'group-hover:translate-x-1'} transition-transform`} />
                      </>
                    )}
                  </button>
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
