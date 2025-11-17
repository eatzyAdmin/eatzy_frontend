"use client";

interface AnimatedBackgroundProps {
  animationComplete: boolean;
}

export default function AnimatedBackground({ animationComplete }: AnimatedBackgroundProps) {
  return (
    <>
      {/* Main Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-lime-100 -z-10"></div>

      {/* Animated decorative elements */}
      <div
        className={`fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${
          animationComplete ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Large floating orbs */}
        <div className="absolute right-1/4 top-1/4 w-32 h-32 md:w-48 md:h-48 bg-[var(--secondary)]/30 rounded-full blur-2xl animate-float-slow"></div>
        <div className="absolute left-1/5 top-1/3 w-28 h-28 md:w-40 md:h-40 bg-[var(--primary)]/25 rounded-full blur-xl animate-float-slow-reverse"></div>

        {/* White cloud-like shapes */}
        <div className="absolute inset-0">
          <div className="absolute left-[5%] bottom-[20%] w-64 h-32 bg-white/70 rounded-full blur-md animate-float-random-1"></div>
          <div className="absolute left-[20%] bottom-[30%] w-72 h-40 bg-white/70 rounded-full blur-md animate-float-random-2"></div>
          <div className="absolute right-[25%] bottom-[22%] w-80 h-36 bg-white/70 rounded-full blur-md animate-float-random-3"></div>
          <div className="absolute right-[10%] bottom-[35%] w-64 h-32 bg-white/70 rounded-full blur-md animate-float-random-4"></div>

          {/* Green accent clouds */}
          <div className="absolute left-[5%] bottom-[91%] w-48 h-28 bg-[var(--primary)]/20 rounded-full blur-md animate-float-random-1"></div>
          <div className="absolute right-[12%] bottom-[15%] w-56 h-32 bg-[var(--secondary)]/20 rounded-full blur-md animate-float-random-2"></div>
          <div className="absolute left-[30%] bottom-[45%] w-40 h-24 bg-[var(--primary)]/15 rounded-full blur-md animate-float-random-3"></div>
          <div className="absolute right-[75%] bottom-[8%] w-52 h-28 bg-[var(--secondary)]/15 rounded-full blur-md animate-float-random-4"></div>
        </div>
      </div>
    </>
  );
}

