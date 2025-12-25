"use client";

import { ImageWithFallback } from "@repo/ui";
import { Star, Award } from "@repo/ui/icons";
import { DriverProfile } from "../data/mockProfileData";

export default function DriverProfileCard({ profile }: { profile: DriverProfile }) {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center">
      {/* Avatar & Badge */}
      <div className="relative w-24 h-24 mb-4">
        <div className="w-full h-full rounded-full overflow-hidden relative z-10 border-4 border-white shadow-lg">
          <ImageWithFallback
            src={profile.profilePhoto}
            alt={profile.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 z-20 bg-[var(--primary)] text-white w-8 h-8 flex items-center justify-center rounded-full border-2 border-white shadow-md">
          <Star className="w-4 h-4 fill-white" />
        </div>
      </div>

      {/* Name & Info */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold font-anton text-[#1A1A1A] mb-1">{profile.name}</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100 mx-auto w-fit">
          <Award className="w-4 h-4" />
          <span>{profile.licensePlate}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="w-full grid grid-cols-3 gap-2 border-t border-gray-100 pt-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xl font-bold text-[#1A1A1A] mb-1">
            {profile.rating} <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Đánh giá</div>
        </div>
        <div className="text-center border-l border-gray-200">
          <div className="text-xl font-bold text-[#1A1A1A] mb-1">{profile.totalTrips}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Chuyến xe</div>
        </div>
        <div className="text-center border-l border-gray-200">
          <div className="text-xl font-bold text-[#1A1A1A] mb-1">{profile.yearsActive}</div>
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Năm h.động</div>
        </div>
      </div>
    </div>
  );
}
