"use client";

import { ImageWithFallback } from "@repo/ui";
import { ShieldCheck } from "@repo/ui/icons";
import { DriverProfile } from "@repo/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DriverProfileCard({ profile }: { profile: DriverProfile | null }) {
  const { user } = useAuth();

  const displayName = profile?.user?.name || user?.name || "Not logged in";
  const displayInfo = profile?.vehicle_license_plate || "No license plate";
  const avatarUrl = profile?.profile_photo || "https://i.pravatar.cc/150?img=11";

  return (
    <div className="bg-white rounded-[32px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-gray-100/50 flex items-center gap-5 relative overflow-hidden group">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-[var(--primary)]/10 transition-all duration-700" />

      {/* Avatar & Badge */}
      <div className="relative shrink-0">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-[#F7F7F7] shadow-xl relative transition-transform group-hover:scale-105 duration-500">
          <ImageWithFallback
            src={avatarUrl}
            alt={displayName}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[var(--primary)] text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg">
          <ShieldCheck size={12} strokeWidth={3} />
        </div>
      </div>

      {/* Name & Info */}
      <div className="text-left relative z-10 min-w-0 flex-1">
        <h2 className="text-xl font-anton font-bold text-[#1A1A1A] leading-tight mb-1 truncate">
          {displayName}
        </h2>
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="text-[13px] font-medium truncate opacity-80">
            {displayInfo}
          </span>
        </div>
      </div>
    </div>
  );
}
