"use client";

import { useState, useEffect } from "react";
import { motion } from "@repo/ui/motion";
import { Camera, Mail, Phone, Calendar, User, Edit3, MapPin, Home, Check, X, Loader2, ShieldCheck } from "@repo/ui/icons";
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

  const handleUpdate = () => {
    // Check for changes
    const hasChanges =
      formData.name !== profile.name ||
      formData.phone !== profile.phone ||
      formData.gender !== (profile.gender || "") ||
      formData.age !== (profile.age || "") ||
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
        age: formData.age ? Number(formData.age) : undefined,
        address: formData.address
      },
      date_of_birth: formData.dateOfBirth || undefined,
      hometown: formData.hometown
    } as any, {
      onSuccess: () => setIsEditing(false)
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      {/* Header & Avatar Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <User size={12} />
              Hồ sơ cá nhân
            </span>
          </div>
          <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
            BIOGRAPHY
          </h2>
          <p className="text-gray-500 font-medium">Cập nhật và quản lý thông tin tài khoản của bạn</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group/avatar">
            <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-white shadow-xl relative z-10 transition-transform group-hover/avatar:scale-105 duration-500">
              <img src={profile.profilePhoto} alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-lime-500 text-black rounded-2xl border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-20">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-6 py-3 bg-[#1A1A1A] text-white font-anton text-xs uppercase tracking-widest rounded-2xl hover:bg-lime-500 hover:text-black transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 py-4 bg-white border-2 border-slate-100 text-[#1A1A1A] font-anton text-sm uppercase tracking-wider rounded-[24px] hover:border-lime-500 hover:bg-lime-50/30 transition-all shadow-sm active:scale-95 flex items-center gap-3"
              >
                <Edit3 size={16} />
                Chỉnh sửa hồ sơ
              </button>
            )}
            {!isEditing && (
              <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full w-fit">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{profile.membershipTier} Member</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Info Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Họ và tên</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 border-2 border-dashed border-gray-300 focus:border-lime-500 focus:border-solid focus:bg-white text-gray-900 font-semibold outline-none transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all group-hover:bg-slate-100/50">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-semibold">{profile.name}</span>
                </div>
              )}
            </div>

            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Email</span>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100/50 border border-transparent opacity-60">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-900 font-semibold">{profile.email}</span>
                <span className="ml-auto text-[8px] uppercase font-bold text-gray-400">Fixed</span>
              </div>
            </div>

            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Số điện thoại</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 border-2 border-dashed border-gray-300 focus:border-lime-500 focus:border-solid focus:bg-white text-gray-900 font-semibold outline-none transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all group-hover:bg-slate-100/50">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-semibold">{profile.phone || "Chưa cập nhật"}</span>
                </div>
              )}
            </div>

            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Giới tính</span>
              {isEditing ? (
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border-2 border-dashed border-gray-300">
                  {[
                    { label: "Nam", value: "MALE" },
                    { label: "Nữ", value: "FEMALE" },
                    { label: "Khác", value: "OTHER" }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${formData.gender === option.value
                        ? "bg-white text-black shadow-sm ring-1 ring-black/5"
                        : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all group-hover:bg-slate-100/50">
                  <User size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-semibold">{profile.gender === 'MALE' ? 'Nam' : profile.gender === 'FEMALE' ? 'Nữ' : profile.gender === 'OTHER' ? 'Khác' : "Chưa cập nhật"}</span>
                </div>
              )}
            </div>

            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Tuổi</span>
              {isEditing ? (
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 border-2 border-dashed border-gray-300 focus:border-lime-500 focus:border-solid focus:bg-white text-gray-900 font-semibold outline-none transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all group-hover:bg-slate-100/50">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-semibold">{profile.age ? `${profile.age} tuổi` : "Chưa cập nhật"}</span>
                </div>
              )}
            </div>

            <div className="group relative">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Quê quán</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.hometown}
                  onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                  className="w-full p-4 rounded-xl bg-slate-50 border-2 border-dashed border-gray-300 focus:border-lime-500 focus:border-solid focus:bg-white text-gray-900 font-semibold outline-none transition-all"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-transparent shadow-[inset_0_0_15px_rgba(0,0,0,0.02)] transition-all group-hover:bg-slate-100/50">
                  <Home size={16} className="text-gray-400" />
                  <span className="text-gray-900 font-semibold">{profile.hometown || "Chưa cập nhật"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="group relative">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2 px-1">Địa chỉ liên hệ</span>
            {isEditing ? (
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-dashed border-gray-300 focus:border-lime-500 focus:border-solid focus:bg-white text-gray-900 font-semibold outline-none transition-all resize-none"
              />
            ) : (
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-slate-50 border border-transparent transition-all group-hover:bg-slate-100/50">
                <MapPin size={18} className="text-gray-400 mt-1" />
                <span className="text-gray-900 font-semibold leading-relaxed">{profile.address || "Chưa cập nhật địa chỉ liên hệ"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1A1A1A] rounded-[32px] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-3xl -mr-16 -mt-16" />

            <h3 className="text-xs font-anton uppercase tracking-widest text-lime-500 mb-6">Trạng thái tài khoản</h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hạng thành viên</span>
                <span className="text-sm font-anton uppercase">{profile.membershipTier}</span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tích lũy chi tiêu</span>
                  <span className="text-xs font-anton">62%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "62.5%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="h-full bg-lime-500 rounded-full"
                  />
                </div>
                <p className="text-[9px] text-gray-500 italic">Chi tiêu thêm 7,500,000đ để lên hạng Elite</p>
              </div>

              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[8px] font-bold text-gray-500 uppercase block mb-1">Ngày tham gia</span>
                  <span className="text-[10px] font-bold">12/10/2023</span>
                </div>
                <div>
                  <span className="text-[8px] font-bold text-gray-500 uppercase block mb-1">Tổng đơn hàng</span>
                  <span className="text-[10px] font-bold">42 đơn</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={16} className="text-lime-600" />
              </div>
              <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-wider">Xác thực tài khoản</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">Tài khoản của bạn đã được xác thực bảo mật ở mức cao nhất.</p>
            <div className="flex gap-1.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-1 flex-1 bg-lime-500 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
