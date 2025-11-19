import React, { useState, useEffect } from "react";
import { X, BookOpen, Edit3 } from "lucide-react";

export type ModalHeaderProps = { title: string; editTitle?: string; isEditMode?: boolean; onClose?: () => void; variant?: 'blue' | 'cyan' | 'teal' | 'indigo'; showDecorations?: boolean; className?: string };

const ModalHeader = ({ title, editTitle = '', isEditMode = false, onClose, variant = 'cyan', showDecorations = true, className = '' }: ModalHeaderProps) => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTitle, setDisplayTitle] = useState(isEditMode ? editTitle : title);
  const variants = {
    blue: { gradient: 'from-blue-400 via-indigo-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-blue-50/50 to-indigo-50/50', borderColor: 'border-blue-300', decorations: ['💙', '🔷', '✨', '🌊', '💎', '🔹'] },
    cyan: { gradient: 'from-cyan-400 via-sky-500 to-cyan-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', borderColor: 'border-cyan-300', decorations: ['🔵', '💠', '🌀', '❄️', '🔷', '🐚'] },
    teal: { gradient: 'from-teal-400 via-cyan-500 to-teal-600', bgPattern: 'bg-gradient-to-br from-teal-50/50 to-cyan-50/50', borderColor: 'border-teal-300', decorations: ['🌊', '🐚', '🔹', '💙', '🔷', '✨'] },
    indigo: { gradient: 'from-indigo-400 via-blue-500 to-indigo-600', bgPattern: 'bg-gradient-to-br from-indigo-50/50 to-blue-50/50', borderColor: 'border-indigo-300', decorations: ['🔮', '💜', '🌌', '⭐', '💎', '✨'] }
  } as const;
  const currentVariant = variants[variant] || variants.blue;
  const generateSparkles = () => { const newSparkles = []; for (let i = 0; i < 8; i++) { newSparkles.push({ id: Math.random(), x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 3 + 2, duration: Math.random() * 0.8 + 0.4, delay: Math.random() * 0.3 }); } setSparkles(newSparkles as any); };
  useEffect(() => { const newTitle = isEditMode ? editTitle : title; if (newTitle !== displayTitle) { setIsTransitioning(true); generateSparkles(); setTimeout(() => { setDisplayTitle(newTitle); }, 150); setTimeout(() => { setIsTransitioning(false); setSparkles([]); }, 500); } }, [isEditMode, title, editTitle, displayTitle]);
  const gradientStyle = { background: `linear-gradient(135deg, ${currentVariant.gradient.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').map(color => { const colorMap: Record<string, string> = { 'blue-400': '#60a5fa', 'indigo-500': '#6366f1', 'blue-600': '#2563eb', 'cyan-400': '#22d3ee', 'sky-500': '#0ea5e9', 'cyan-600': '#0891b2', 'teal-400': '#2dd4bf', 'cyan-500': '#06b6d4', 'teal-600': '#0d9488', 'indigo-400': '#818cf8', 'blue-500': '#3b82f6', 'indigo-600': '#4f46e5' }; return colorMap[color] || color; }).join(', ')})`, backgroundSize: '200% 200%', animation: 'gradientShift 6s ease infinite' } as React.CSSProperties;
  return (
    <div className={`relative overflow-hidden backdrop-blur-lg border-x-2 border-t-2 border-white p-4 md:p-6 flex justify-between items-center sticky top-0 z-10 shadow-md rounded-t-2xl ${currentVariant.bgPattern} transition-all duration-400 ease-out ${isTransitioning ? 'transform scale-102 shadow-2xl' : 'transform scale-100'} ${className}`} style={gradientStyle}>
      {sparkles.map((sparkle) => (<div key={sparkle.id} className="absolute pointer-events-none" style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, animation: `sparkleAnimation ${sparkle.duration}s ease-out ${sparkle.delay}s forwards` }}><div className="bg-white rounded-full opacity-0" style={{ width: `${sparkle.size}px`, height: `${sparkle.size}px`, boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)' }} /></div>))}
      {showDecorations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {currentVariant.decorations.slice(0, 4).map((decoration, index) => (<div key={`decoration-${index}`} className={`absolute text-lg text-white/60 transition-all duration-400 ${isTransitioning ? 'animate-bounce scale-125 opacity-70' : 'animate-bounce'}`} style={{ left: `${15 + index * 20}%`, top: `${20 + (index % 2) * 30}%`, animationDelay: `${index * 0.8}s`, animationDuration: '4s' }}>{decoration}</div>))}
          <div className={`absolute top-2 right-16 w-6 h-6 opacity-25 transition-all duration-400 ${isTransitioning ? 'scale-150 opacity-50' : 'scale-100'}`}><div className="w-full h-full bg-white rounded-full animate-pulse" /></div>
          <div className={`absolute bottom-2 left-4 w-4 h-4 opacity-20 transition-all duration-400 ${isTransitioning ? 'scale-125 opacity-40' : 'scale-100'}`}><div className="w-full h-full bg-white rotate-45 animate-pulse" style={{ animationDelay: '1s' }} /></div>
        </div>
      )}
      {isTransitioning && (<div className="absolute inset-0 pointer-events-none"><div className="absolute inset-0 rounded-t-2xl bg-white/15 animate-ping" /><div className="absolute inset-2 rounded-xl bg-white/10 animate-ping" style={{ animationDelay: '0.2s' }} /></div>)}
      <div className={`relative z-10 flex-1 transition-all duration-300 ease-out ${isTransitioning ? 'opacity-0 scale-95 blur-sm transform -translate-y-1' : 'opacity-100 scale-100 blur-0 transform translate-y-0'}`}>
        <div className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 ease-out ${isTransitioning ? 'animate-pulse scale-110 bg-white/30 shadow-lg' : 'hover:bg-white/25 hover:scale-105'}`}>
            {isEditMode ? (<Edit3 size={20} className={`text-white transition-all duration-300 ${isTransitioning ? 'animate-bounce' : ''}`} />) : (<BookOpen size={20} className={`text-white transition-all duration-300 ${isTransitioning ? 'animate-bounce' : ''}`} />)}
          </div>
          <div className="flex-1">
            <h2 className={`text-xl md:text-2xl font-bold text-white transition-all duration-300 ${isTransitioning ? 'animate-pulse' : ''}`} style={{ textShadow: isTransitioning ? '0 0 20px rgba(255, 255, 255, 0.6), 0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)' }}>{displayTitle}</h2>
            <div className={`h-0.5 mt-2 rounded-full bg-white/60 transition-all duration-300 ${isTransitioning ? 'w-24 bg-white animate-pulse' : 'w-16'}`} />
          </div>
        </div>
      </div>
      <div className={`relative z-10 ml-4 transition-all duration-300 ease-out ${isTransitioning ? 'opacity-0 scale-90 blur-sm transform rotate-12' : 'opacity-100 scale-100 blur-0 transform rotate-0'}`}>
        <button onClick={onClose} className={`relative p-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 hover:bg-white/90 hover:scale-110 active:scale-95 transition-all duration-200 shadow-md ${isTransitioning ? 'animate-pulse shadow-xl' : ''}`}>
          <X size={20} className="text-gray-600" />
          <div className={`absolute inset-0 rounded-full blur-md opacity-20 transition-opacity duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-20'}`} style={{ background: (gradientStyle as any).background }} />
          {isTransitioning && (<div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />)}
        </button>
      </div>
      <div className={`absolute inset-0 rounded-t-2xl transition-opacity duration-300 ${isTransitioning ? 'opacity-30' : 'opacity-15'}`} style={{ background: `linear-gradient(45deg, ${(gradientStyle as any).background})`, mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', padding: '2px' }} />
      <style>{`
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes sparkleAnimation { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 20% { opacity: 1; transform: scale(1) rotate(90deg); } 80% { opacity: 1; transform: scale(1.2) rotate(270deg); } 100% { opacity: 0; transform: scale(0) rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 0.5s ease-in-out; }
        .scale-102 { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default ModalHeader;