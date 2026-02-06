import React from 'react';
import { User, Mail, Bike, Star, ShieldCheck, AlertCircle, X, Info, Lock } from 'lucide-react';
import { DriverProfile, VerificationStatus } from '@repo/types';

interface GetVerificationBadgeProps {
  status?: VerificationStatus;
}

export const getVerificationBadge = (status?: VerificationStatus) => {
  switch (status) {
    case 'APPROVED':
      return <ShieldCheck size={14} className="text-lime-500" />;
    case 'PENDING':
      return <AlertCircle size={14} className="text-amber-500 animate-pulse" />;
    case 'REJECTED':
      return <X size={14} className="text-red-500" />;
    default:
      return <Info size={14} className="text-gray-300" />;
  }
};

export const getDriversColumns = () => {
  return [
    {
      label: 'DRIVER IDENTITY',
      key: 'user.name',
      formatter: (_: any, driver: DriverProfile) => {
        const isAvailable = driver.status === 'AVAILABLE';
        return (
          <div className="flex items-center gap-4 py-2 group/info">
            <div className="relative group/avatar">
              <div className={`w-12 h-12 rounded-2xl ${isAvailable ? 'bg-lime-100 text-lime-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center shadow-lg shadow-black/5 transition-transform group-hover/avatar:scale-105 duration-300`}>
                <User size={20} className="stroke-[2.5]" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm
                ${driver.status === 'AVAILABLE' ? 'bg-lime-500' :
                  driver.status === 'BUSY' ? 'bg-red-500' : 'bg-gray-400'}`}
              />
            </div>
            <div>
              <div className="font-anton text-lg text-[#1A1A1A] uppercase tracking-tight leading-none mb-1 flex items-center gap-2">
                {driver.user.name}
                {getVerificationBadge(driver.profile_photo_status)}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                <Mail size={10} /> {driver.user.email}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      label: 'FLEET & COD',
      key: 'vehicle_license_plate',
      formatter: (_: any, driver: DriverProfile) => (
        <div className="py-2">
          <div className="flex items-center gap-2 mb-1">
            <Bike size={14} className="text-primary" />
            <span className="font-anton text-sm text-gray-900 uppercase">
              {driver.vehicle_license_plate || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {driver.vehicle_brand} {driver.vehicle_model}
            </span>
            <div className="text-[9px] font-bold text-primary uppercase tracking-tight flex items-center gap-1 mt-1 bg-lime-50 px-2 py-0.5 rounded-md w-fit border border-lime-100">
              COD Limit: {new Intl.NumberFormat('vi-VN').format(driver.codLimit || 0)}đ
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'PERFORMANCE',
      key: 'averageRating',
      formatter: (_: any, driver: DriverProfile) => (
        <div className="py-2 flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-anton text-sm text-gray-900">
                {driver.averageRating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100" />

          <div className="flex flex-col">
            <span className="font-anton text-sm text-gray-900 mb-0.5">
              {driver.completedTrips || 0}
            </span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Trips</span>
          </div>
        </div>
      )
    },
    {
      label: 'STATUS',
      key: 'user.isActive',
      formatter: (_: any, driver: DriverProfile) => {
        const isActive = driver.user.isActive ?? true;
        return (
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${isActive
            ? 'bg-lime-100 text-lime-600 border border-lime-100 shadow-sm'
            : 'bg-red-100 text-red-600 border border-red-100 shadow-sm'
            }`}>
            {isActive ? (
              <>
                <ShieldCheck size={12} strokeWidth={3.2} />
                Unlocked
              </>
            ) : (
              <>
                <Lock size={12} strokeWidth={3.2} />
                Locked
              </>
            )}
          </span>
        );
      }
    }
  ];
};
