"use client";

// Animated food icon that floats
export default function FoodIcon() {
  return (
    <div className="relative w-20 h-20 animate-float-slow">
      {/* Bowl */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-12 bg-gradient-to-br from-white to-gray-100 rounded-b-full shadow-xl border-2 border-[var(--primary)]/30"></div>
      
      {/* Rice/Food content */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-14 h-8 bg-gradient-to-br from-white to-gray-50 rounded-full"></div>
      
      {/* Garnish on top */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[var(--primary)] rounded-full shadow-md"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 translate-x-2 w-3 h-3 bg-[var(--secondary)] rounded-full shadow-md"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-x-2 w-3 h-3 bg-red-400 rounded-full shadow-md"></div>
      
      {/* Steam lines */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-x-3 w-0.5 h-4 bg-gray-300 rounded-full opacity-60 animate-fade-in-up"></div>
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-5 bg-gray-300 rounded-full opacity-60 animate-fade-in-up animation-delay-100"></div>
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 translate-x-3 w-0.5 h-4 bg-gray-300 rounded-full opacity-60 animate-fade-in-up animation-delay-200"></div>
    </div>
  );
}

