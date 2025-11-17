"use client";

export default function SteamEffect() {
  return (
    <div className="relative w-32 h-40">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-70">
        {/* White steam puffs */}
        <div className="w-8 h-8 bg-white rounded-full blur-md animate-smoke-1"></div>
        <div className="w-10 h-10 bg-white rounded-full blur-md animate-smoke-2"></div>
        <div className="w-6 h-6 bg-white rounded-full blur-md animate-smoke-3"></div>
        <div className="w-12 h-12 bg-white rounded-full blur-md animate-smoke-4"></div>
        <div className="w-9 h-9 bg-white rounded-full blur-md animate-smoke-5"></div>

        {/* Green accent steam */}
        <div className="w-7 h-7 bg-[var(--primary)]/20 rounded-full blur-md animate-smoke-green-1"></div>
        <div className="w-9 h-9 bg-[var(--primary)]/20 rounded-full blur-md animate-smoke-green-2"></div>
        <div className="w-8 h-8 bg-[var(--secondary)]/20 rounded-full blur-md animate-smoke-green-3"></div>
        <div className="w-10 h-10 bg-[var(--primary)]/20 rounded-full blur-md animate-smoke-green-4"></div>
      </div>
    </div>
  );
}

