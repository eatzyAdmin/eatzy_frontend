"use client";

export default function LoadingSpinner({ size = 48, color = "#3B82F6" }: { size?: number; color?: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative animate-spin"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {/* Main spinning ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg, ${color} 270deg, transparent 360deg)`,
          }}
        />

        {/* Inner white circle to create ring effect */}
        <div
          className="absolute bg-white rounded-full"
          style={{
            top: '6px',
            left: '6px',
            right: '6px',
            bottom: '6px',
          }}
        />

        {/* Glowing effect */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-sm"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 90deg, transparent 180deg, ${color} 270deg, transparent 360deg)`,
          }}
        />

        {/* Small dots with keyframe pulsing */}
        <div
          className="absolute w-2 h-2 rounded-full animate-pulse"
          style={{
            backgroundColor: color,
            top: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        <div
          className="absolute w-1.5 h-1.5 rounded-full opacity-60 animate-pulse"
          style={{
            backgroundColor: color,
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            animationDelay: '0.75s',
          }}
        />
      </div>
    </div>
  );
}
