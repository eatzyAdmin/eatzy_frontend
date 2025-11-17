"use client";

export default function DeliveryScooter() {
  return (
    <div className="relative w-32 h-32">
      {/* Delivery box on back */}
      <div className="absolute top-8 left-16 w-12 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-lg shadow-lg">
        <div className="absolute inset-1 bg-white/20 rounded-md"></div>
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/40 rounded-full"></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-white/40 rounded-full"></div>
      </div>

      {/* Scooter body */}
      <div className="absolute top-14 left-8 w-16 h-8 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-md"></div>
      
      {/* Handle bar */}
      <div className="absolute top-8 left-8 w-2 h-8 bg-gray-400 rounded-t-full"></div>
      <div className="absolute top-7 left-6 w-6 h-2 bg-gray-400 rounded-full"></div>
      
      {/* Headlight */}
      <div className="absolute top-12 left-6 w-3 h-3 bg-yellow-300 rounded-full shadow-lg animate-pulse"></div>
      
      {/* Wheels */}
      <div className="absolute bottom-2 left-6 w-8 h-8 bg-gray-800 rounded-full shadow-lg">
        <div className="absolute inset-1 bg-gray-600 rounded-full"></div>
        <div className="absolute inset-2 bg-gray-800 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 right-6 w-8 h-8 bg-gray-800 rounded-full shadow-lg">
        <div className="absolute inset-1 bg-gray-600 rounded-full"></div>
        <div className="absolute inset-2 bg-gray-800 rounded-full"></div>
      </div>

      {/* Rider (simple) */}
      <div className="absolute top-6 left-10 w-6 h-6 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full shadow-md"></div>
      <div className="absolute top-12 left-11 w-4 h-6 bg-gray-700 rounded-lg"></div>
    </div>
  );
}

