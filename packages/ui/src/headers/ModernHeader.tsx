import React, { useState, useEffect } from "react";
import { Home, Wallet, Users, User, Receipt, PiggyBank, LineChart, Settings, Lock } from "lucide-react";

export type ModernHeaderProps = { activeSection: string };

const ModernHeader = ({ activeSection }: ModernHeaderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displaySection, setDisplaySection] = useState(activeSection);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const generateSparkles = () => { const newSparkles = []; for (let i = 0; i < 10; i++) { newSparkles.push({ id: Math.random(), x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 4 + 2, duration: Math.random() * 0.8 + 0.3, delay: Math.random() * 0.3 }); } setSparkles(newSparkles as any); };
  useEffect(() => { if (activeSection !== displaySection) { setIsTransitioning(true); generateSparkles(); setTimeout(() => { setDisplaySection(activeSection); }, 150); setTimeout(() => { setIsTransitioning(false); setSparkles([]); }, 500); } }, [activeSection, displaySection]);
  type PageInfo = { title: string; icon: any; gradient: string; bgPattern: string; decorations: string[] };
  const pageInfo: Record<string, PageInfo> = {
    overview: { title: 'Trang chủ', icon: Home, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['❄️', '💦', '🌟'] },
    deposits: { title: 'Quản lý tiền gửi', icon: Wallet, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['💳', '💎', '💳'] },
    customers: { title: 'Quản lý khách hàng & tiền gửi', icon: Users, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['🌐', '📘', '💼'] },
    employees: { title: 'Quản lý nhân viên', icon: User, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['🧿', '🧊', '⭐'] },
    'deposit-slips': { title: 'Tra cứu phiếu gửi tiền', icon: Receipt, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['📄', '📘', '✍️'] },
    'savings-products': { title: 'Quản lý sản phẩm tiết kiệm', icon: PiggyBank, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['💧', '📘', '🌱'] },
    'sales-reports': { title: 'Báo cáo doanh số', icon: LineChart, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['📈', '🧿', '📉'] },
    settings: { title: 'Cài đặt hệ thống', icon: Settings, gradient: 'from-gray-400 via-slate-500 to-zinc-600', bgPattern: 'bg-gradient-to-br from-gray-50/50 to-slate-50/50', decorations: ['⚙️', '🔧', '🛠️'] },
    permissions: { title: 'Quản lý phân quyền', icon: Lock, gradient: 'from-cyan-400 via-sky-500 to-blue-600', bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50', decorations: ['🧿', '🛡️', '🔐'] }
  };
  const currentPage: PageInfo = pageInfo[displaySection] || pageInfo.overview || {
    title: 'Trang chủ',
    icon: Home,
    gradient: 'from-cyan-400 via-sky-500 to-blue-600',
    bgPattern: 'bg-gradient-to-br from-cyan-50/50 to-sky-50/50',
    decorations: ['❄️', '💦', '🌟']
  };
  const IconComponent = currentPage.icon as any;
  const gradientStyle = {
    background: `linear-gradient(135deg, ${currentPage.gradient.replace('from-', '').replace('via-', '').replace('to-', '').split(' ').map(color => {
      const colorMap: Record<string, string> = { 'emerald-400': '#34d399', 'teal-500': '#14b8a6', 'cyan-600': '#0891b2', 'blue-400': '#60a5fa', 'indigo-500': '#6366f1', 'purple-600': '#9333ea', 'pink-400': '#f472b6', 'rose-500': '#f43f5e', 'red-500': '#ef4444', 'amber-400': '#fbbf24', 'orange-500': '#f97316', 'violet-400': '#a78bfa', 'purple-500': '#a855f7', 'indigo-600': '#7c3aed', 'green-400': '#4ade80', 'emerald-500': '#10b981', 'teal-600': '#0d9488', 'cyan-400': '#22d3ee', 'sky-500': '#0ea5e9', 'blue-600': '#2563eb', 'gray-400': '#9ca3af', 'slate-500': '#64748b', 'zinc-600': '#52525b', 'red-400': '#f87171', 'pink-500': '#ec4899', 'rose-600': '#e11d48' }; return colorMap[color] || color; }).join(', ')})`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 6s ease infinite'
  } as React.CSSProperties;
  return (
    <div className="w-full flex justify-center">
      <header className={`relative overflow-hidden backdrop-blur-lg border-x-4 border-b-4 ${activeSection !== 'settings' ? 'border-blue-300' : 'border-gray-400'} p-3 md:p-3 md:px-6 flex items-center justify-center shadow-lg rounded-xl sticky top-4 rounded-t-lg rounded-b-full max-w-lg w-full ${currentPage.bgPattern} transition-all duration-700 ease-out ${isTransitioning ? 'transform scale-105 shadow-2xl' : 'transform scale-100'}`} style={gradientStyle}>
        {sparkles.map((sparkle) => (<div key={sparkle.id} className="absolute pointer-events-none" style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%`, animation: `sparkleAnimation ${sparkle.duration}s ease-out ${sparkle.delay}s forwards` }}><div className="bg-white rounded-full opacity-0" style={{ width: `${sparkle.size}px`, height: `${sparkle.size}px`, boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)' }}></div></div>))}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {currentPage.decorations.slice(0, 2).map((decoration, index) => (<div key={`${displaySection}-${index}`} className={`absolute text-lg text-white/50 transition-all duration-700 ${isTransitioning ? 'animate-bounce scale-125 opacity-80' : 'animate-bounce'}`} style={{ left: `${20 + index * 60}%`, top: `${30 + index * 20}%`, animationDelay: `${index * 1}s`, animationDuration: `4s` }}>{decoration}</div>))}
          <div className={`absolute top-1 right-2 w-8 h-8 opacity-20 transition-all duration-500 ${isTransitioning ? 'scale-150 opacity-40' : 'scale-100'}`}><div className="w-full h-full bg-white rounded-full animate-pulse"></div></div>
        </div>
        {isTransitioning && (<div className="absolute inset-0 pointer-events-none"><div className="absolute inset-0 rounded-xl bg-white/20 animate-ping"></div><div className="absolute inset-2 rounded-lg bg-white/10 animate-ping" style={{ animationDelay: '0.2s' }}></div></div>)}
        <div className={`relative z-10 flex items-center gap-2 md:gap-3 transition-all duration-500 ease-out ${isTransitioning ? 'opacity-0 scale-90 blur-sm transform rotate-3' : 'opacity-100 scale-100 blur-0 transform rotate-0'}`}>
          <div className={`relative p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md border border-white/40 hover:scale-105 transition-all duration-300 ${isTransitioning ? 'animate-pulse shadow-xl' : ''}`}><IconComponent size={18} className="text-gray-600" /><div className={`absolute inset-0 rounded-lg blur-md opacity-20 transition-opacity duration-300 ${isTransitioning ? 'opacity-60' : 'opacity-20'}`} style={{ background: (gradientStyle as any).background }}></div>{isTransitioning && (<div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>)}</div>
          <div className="text-center"><h1 className={`font-semibold text-lg md:text-xl text-white hover:scale-102 transition-all duration-300 ${isTransitioning ? 'animate-pulse' : ''}`} style={{ textShadow: isTransitioning ? '0 0 20px rgba(255, 255, 255, 0.8), 0 2px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)' }}>{currentPage.title}</h1><div className={`h-0.5 mx-auto mt-1 rounded-full bg-white/70 transition-all duration-500 ${isTransitioning ? 'w-20 bg-white animate-pulse' : 'w-12'}`}></div></div>
        </div>
        <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${isTransitioning ? 'opacity-40' : 'opacity-15'}`} style={{ background: `linear-gradient(45deg, ${(gradientStyle as any).background})`, mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', padding: '1px' }}></div>
      </header>
      <style>{`
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes sparkleAnimation { 0% { opacity: 0; transform: scale(0) rotate(0deg); } 20% { opacity: 1; transform: scale(1) rotate(90deg); } 80% { opacity: 1; transform: scale(1.2) rotate(270deg); } 100% { opacity: 0; transform: scale(0) rotate(360deg); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 0.8s ease-in-out; }
        .hover\\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
};

export default ModernHeader;