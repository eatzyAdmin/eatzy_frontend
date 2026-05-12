"use client";

import { motion } from "@repo/ui/motion";
import { Bike, Calendar, Hash, Award, CheckCircle2, AlertCircle, FileText, ShieldCheck, Camera } from "@repo/ui/icons";
import { DriverProfile } from "@repo/types";

import { EmptyState } from "@/components/ui/EmptyState";

export default function VehicleInfoSection({ profile }: { profile: DriverProfile }) {
  // Empty State Handle
  if (!profile?.vehicle_type && !profile?.vehicle_license_plate && !profile?.vehicle_brand) {
    return (
      <EmptyState
        icon={Bike}
        title="Vehicle Not Registered"
        description="You have not registered a transport vehicle or your vehicle information is being reviewed. Please contact support."
        buttonText="Contact Support"
        onButtonClick={() => window.open('tel:19001234')}
        className="py-12"
      />
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'text-lime-500 bg-lime-50 border-lime-100';
      case 'REJECTED': return 'text-red-500 bg-red-50 border-red-100';
      case 'PENDING': return 'text-orange-500 bg-orange-50 border-orange-100';
      default: return 'text-gray-400 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <AlertCircle size={14} />;
      case 'PENDING': return <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><AlertCircle size={14} /></motion.div>;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 md:space-y-12 pb-20 pt-2"
    >
      {/* Main Vehicle Card */}
      <div className="relative overflow-hidden rounded-[32px] bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] p-5 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Vehicle Image */}
          <div className="w-full md:w-1/3 aspect-[4/3] rounded-[24px] bg-slate-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-3 overflow-hidden group relative transition-all hover:border-blue-200">
            {profile.vehicle_photo ? (
              <img src={profile.vehicle_photo} alt="Vehicle" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 border border-gray-100">
                  <Camera size={24} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No vehicle photo</span>
              </>
            )}

            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl border flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-tight backdrop-blur-md shadow-sm ${getStatusColor(profile.vehicle_photo_status)}`}>
              {getStatusIcon(profile.vehicle_photo_status)}
              {profile.vehicle_photo_status || 'Not verified'}
            </div>
          </div>

          {/* Vehicle Details Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-1 w-full">
            <InfoGridItem icon={<Award size={14} />} label="Vehicle Type" value={profile.vehicle_type} />
            <InfoGridItem icon={<Hash size={14} />} label="License Plate" value={profile.vehicle_license_plate} isMono />
            <InfoGridItem icon={<FileText size={14} />} label="Brand & Model" value={`${profile.vehicle_brand || "Not updated"} ${profile.vehicle_model || ""}`} />
            <InfoGridItem icon={<div className="w-1.5 h-1.5 rounded-full bg-blue-400" />} label="Model & Year" value={`${profile.vehicle_model || "Not updated"} ${profile.vehicle_year ? `(${profile.vehicle_year})` : ""}`} />
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-[0.15em] px-1">Giấy tờ pháp lý</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <DocumentCard
            icon={<FileText size={20} />}
            title="Đăng ký xe (Cà vẹt)"
            status={profile.vehicle_registration_status}
            imageUrl={profile.vehicle_registration_image}
          />
          <DocumentCard
            icon={<ShieldCheck size={20} />}
            title="Bảo hiểm xe"
            status={profile.vehicle_insurance_status}
            imageUrl={profile.vehicle_insurance_image}
            expiry={profile.vehicle_insurance_expiry}
          />
        </div>
      </div>
    </motion.div>
  );
}

function InfoGridItem({ icon, label, value, isMono }: { icon: any, label: string, value?: string, isMono?: boolean }) {
  return (
    <div className="bg-slate-50/50 p-4 rounded-2xl border border-transparent transition-all group hover:bg-slate-50 hover:border-slate-100">
      <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-2 mb-1.5">
        {icon} {label}
      </span>
      <p className={`text-base font-bold text-[#1A1A1A] ${isMono ? 'font-mono tracking-wider' : ''}`}>
        {value || "Chưa cập nhật"}
      </p>
    </div>
  );
}

function DocumentCard({ icon, title, status, imageUrl, expiry }: { icon: any, title: string, status?: string, imageUrl?: string, expiry?: string }) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'text-lime-600 bg-lime-50 border-lime-100';
      case 'REJECTED': return 'text-red-600 bg-red-50 border-red-100';
      case 'PENDING': return 'text-orange-600 bg-orange-50 border-orange-100';
      default: return 'text-gray-400 bg-slate-50 border-slate-100';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Từ chối';
      case 'PENDING': return 'Đang chờ';
      default: return 'Chưa có';
    }
  };

  return (
    <div className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all hover:shadow-md group">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
            {icon}
          </div>
          <p className="font-bold text-[#1A1A1A] text-sm md:text-base">{title}</p>
        </div>
        <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-bold uppercase tracking-tight ${getStatusColor(status)}`}>
          {getStatusText(status)}
        </div>
      </div>

      <div className="aspect-video rounded-2xl bg-slate-50 border-2 border-dashed border-gray-100 overflow-hidden relative flex flex-col items-center justify-center gap-2 group/img transition-all hover:border-blue-100">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" />
        ) : (
          <>
            <Camera size={24} className="text-gray-300" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Xem bản scan</span>
          </>
        )}
      </div>

      {expiry && (
        <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Ngày hết hạn</span>
          <span className="text-xs font-bold text-gray-700">{new Date(expiry).toLocaleDateString('vi-VN')}</span>
        </div>
      )}
    </div>
  );
}
