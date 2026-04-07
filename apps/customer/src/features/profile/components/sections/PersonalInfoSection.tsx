"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Camera, Mail, Phone, Calendar, User, Edit3, MapPin, Home, Check, X, Loader2, ShieldCheck } from "@repo/ui/icons";
import { PremiumDatePicker } from "@repo/ui";
import { ICustomerProfileDisplay } from "@repo/types";
import { useCustomerProfile } from "../../hooks/useCustomerProfile";
import { sileo } from "@/components/DynamicIslandToast";

export default function PersonalInfoSection({ profile }: { profile: ICustomerProfileDisplay }) {
  const { updateProfile, isUpdating } = useCustomerProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone,
    gender: profile.gender || "",
    age: profile.age || "",
    hometown: profile.hometown || "",
    address: profile.address || "",
    dateOfBirth: profile.dateOfBirth || ""
  });

  useEffect(() => {
    setFormData({
      name: profile.name,
      phone: profile.phone,
      gender: profile.gender || "",
      age: profile.age || "",
      hometown: profile.hometown || "",
      address: profile.address || "",
      dateOfBirth: profile.dateOfBirth || ""
    });
  }, [profile]);

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      phone: profile.phone,
      gender: profile.gender || "",
      age: profile.age || "",
      hometown: profile.hometown || "",
      address: profile.address || "",
      dateOfBirth: profile.dateOfBirth || ""
    });
    setIsEditing(false);
  };

  const handleUpdate = () => {
    // Check for changes
    const hasChanges =
      formData.name !== profile.name ||
      formData.phone !== profile.phone ||
      formData.gender !== (profile.gender || "") ||
      formData.dateOfBirth !== (profile.dateOfBirth || "") ||
      formData.hometown !== (profile.hometown || "") ||
      formData.address !== (profile.address || "");

    if (!hasChanges) {
      sileo.warning({
        title: "Không có thay đổi",
        description: "Bạn chưa chỉnh sửa thông tin nào để lưu."
      });
      setIsEditing(false);
      return;
    }

    updateProfile({
      user: {
        name: formData.name,
        phoneNumber: formData.phone,
        gender: formData.gender as any,
        address: formData.address
      },
      date_of_birth: formData.dateOfBirth || undefined,
      hometown: formData.hometown
    } as any, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 md:space-y-12"
      >
        {/* Desktop Header Row - Hidden on mobile entirely to remove layout gap */}
        <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
                <User size={12} />
                Hồ sơ cá nhân
              </span>
            </div>
            <h2 className="text-4xl md:text-[56px] font-bold leading-none text-[#1A1A1A] uppercase font-anton">
              BIOGRAPHY
            </h2>
            <p className="text-gray-500 font-medium">Cập nhật và quản lý thông tin tài khoản của bạn</p>
          </div>

          <div className="flex items-center justify-end gap-3 w-auto relative">
            {isEditing ? (
              <>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-none px-8 py-4 bg-[#1A1A1A] text-white font-bold text-sm uppercase tracking-tight rounded-[24px] hover:bg-lime-500 hover:text-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 min-w-[180px]"
                >
                  {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                  Lưu thay đổi
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="w-14 h-14 bg-white border-2 border-slate-100 text-gray-400 rounded-[24px] hover:bg-gray-50 flex items-center justify-center transition-all shadow-sm shrink-0"
                >
                  <X size={20} />
                </motion.button>
              </>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(true)}
                className="px-8 py-4 bg-white border-2 border-slate-100 text-[#1A1A1A] font-bold text-sm uppercase tracking-tight rounded-[24px] hover:border-lime-500 hover:bg-lime-50/30 transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <Edit3 size={16} strokeWidth={3} />
                Chỉnh sửa hồ sơ
              </motion.button>
            )}
          </div>
        </div>

        {/* Main Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-10 px-1">
          {/* ... existing fields ... */}
          {/* Name Input */}
          <div className="group relative">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Họ và tên</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-name"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <User size={18} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-4 md:py-5 pl-12 md:pl-14 pr-6 bg-slate-50 border-2 border-dashed border-gray-200 focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 rounded-[24px] md:rounded-[28px] text-base md:text-lg font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view-name"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 py-4 md:py-5 px-5 md:px-6 rounded-[24px] md:rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 h-14 md:h-[68px]"
                >
                  <User size={20} className="text-gray-400 shrink-0" />
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg truncate">{profile.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Input */}
          <div className="group relative">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Số điện thoại</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-phone"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Phone size={18} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-4 md:py-5 pl-12 md:pl-14 pr-6 bg-slate-50 border-2 border-dashed border-gray-200 focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 rounded-[24px] md:rounded-[28px] text-base md:text-lg font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view-phone"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 py-4 md:py-5 px-5 md:px-6 rounded-[24px] md:rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 h-14 md:h-[68px]"
                >
                  <Phone size={20} className="text-gray-400 shrink-0" />
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg truncate">{profile.phone || "Chưa cập nhật"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gender Selection */}
          <div className="group relative">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Giới tính</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-gender"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex bg-slate-50 p-1 rounded-[24px] md:rounded-[28px] border-2 border-dashed border-gray-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] h-14 md:h-[68px] items-center relative"
                >
                  {[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                      className={`flex-1 h-full relative z-10 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${formData.gender?.toUpperCase() === option.value ? "text-black" : "text-gray-400 hover:text-gray-500"
                        }`}
                    >
                      {formData.gender?.toUpperCase() === option.value && (
                        <motion.div
                          layoutId="activeGender"
                          className="absolute inset-0 bg-white rounded-xl md:rounded-2xl shadow-sm border border-black/5 z-[-1]"
                          transition={{ type: "spring", bounce: 0.2 }}
                        />
                      )}
                      <span className="relative z-10">{option.label}</span>
                    </button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="view-gender"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 py-4 md:py-5 px-5 md:px-6 rounded-[24px] md:rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 h-14 md:h-[68px]"
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-100">
                    <User size={16} className="text-gray-400" />
                  </div>
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg">
                    {(() => {
                      const g = profile.gender?.toUpperCase();
                      if (g === 'MALE' || g === 'NAM') return 'Nam';
                      if (g === 'FEMALE' || g === 'NỮ') return 'Nữ';
                      if (g === 'OTHER' || g === 'KHÁC') return 'Khác';
                      return "Chưa cập nhật";
                    })()}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date of Birth Input */}
          <div className="group relative">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Ngày sinh</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-dob"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <PremiumDatePicker
                    label=""
                    value={formData.dateOfBirth}
                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                    placeholder="Chọn ngày sinh"
                    triggerClassName="bg-slate-50 border-2 border-dashed border-gray-200 focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 rounded-[24px] md:rounded-[28px] py-4 md:py-5 pl-12 md:pl-14 pr-6 text-base md:text-lg font-bold text-[#1A1A1A] focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view-dob"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 py-4 md:py-5 px-5 md:px-6 rounded-[24px] md:rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 h-14 md:h-[68px]"
                >
                  <Calendar size={20} className="text-gray-400 shrink-0" />
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg truncate">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hometown Input */}
          <div className="group relative md:col-span-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Quê quán</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-hometown"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Home size={18} className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="w-full py-4 md:py-5 pl-12 md:pl-14 pr-6 bg-slate-50 border-2 border-dashed border-gray-200 focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 rounded-[24px] md:rounded-[28px] text-base md:text-lg font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)]"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view-hometown"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-4 py-4 md:py-5 px-5 md:px-6 rounded-[24px] md:rounded-[28px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 h-14 md:h-[68px]"
                >
                  <Home size={20} className="text-gray-400 shrink-0" />
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg truncate">{profile.hometown || "Chưa cập nhật"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Address Textarea */}
          <div className="group relative md:col-span-2">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1 px-1">Địa chỉ liên hệ</span>
            <AnimatePresence mode="popLayout">
              {isEditing ? (
                <motion.div
                  key="edit-address"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <MapPin size={18} className="absolute left-5 md:left-6 top-6 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-dashed border-gray-200 focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 rounded-[28px] md:rounded-[32px] p-5 md:p-6 pl-12 md:pl-14 pt-5 md:pt-6 text-base md:text-lg font-bold text-[#1A1A1A] placeholder:text-gray-300 focus:outline-none transition-all shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] resize-none"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="view-address"
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-4 p-5 md:p-6 rounded-[28px] md:rounded-[32px] bg-slate-50 border-2 border-transparent shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] transition-all group-hover:bg-slate-100/50 min-h-[100px] md:min-h-[120px]"
                >
                  <MapPin size={22} className="text-gray-400 mt-1 shrink-0" />
                  <span className="text-[#1A1A1A] font-bold text-base md:text-lg leading-relaxed">{profile.address || "Chưa cập nhật địa chỉ liên hệ"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Mobile Fixed Action Buttons - Outside motion.div to prevent jump */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] flex items-center justify-center gap-3">
          {isEditing ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 px-6 py-3.5 bg-[#1A1A1A] text-white font-bold text-sm uppercase tracking-tight rounded-[20px] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                Lưu thay đổi
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="w-[52px] h-[52px] bg-white border-2 border-slate-100 text-gray-400 rounded-[20px] flex items-center justify-center shadow-sm shrink-0"
              >
                <X size={20} />
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 text-[#1A1A1A] font-bold text-sm uppercase tracking-tight rounded-[20px] shadow-sm flex items-center justify-center gap-3"
            >
              <Edit3 size={16} strokeWidth={3} />
              Chỉnh sửa hồ sơ
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
}
