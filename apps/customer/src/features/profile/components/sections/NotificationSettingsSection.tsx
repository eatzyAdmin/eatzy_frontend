"use client";

import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { Bell, MessageSquare, Tag, Terminal, ShieldCheck } from "@repo/ui/icons";

export default function NotificationSettingsSection() {
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    offers: true,
    updates: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationTypes = [
    { key: "push", label: "Thông báo đẩy", sub: "Nhận thông báo tức thì trên điện thoại", icon: Bell },
    { key: "email", label: "Email định kỳ", sub: "Bản tin ẩm thực hàng tuần", icon: MessageSquare },
    { key: "offers", label: "Ưu đãi đặc quyền", sub: "Khám phá các voucher mới nhất", icon: Tag },
    { key: "updates", label: "Cập nhật ứng dụng", sub: "Thông tin về các tính năng mới", icon: Terminal },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-lg bg-lime-100 text-lime-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Bell size={12} />
            Thông báo
          </span>
        </div>
        <h2 className="text-[56px] font-bold leading-none text-[#1A1A1A] uppercase" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>
          NOTIFICATIONS
        </h2>
        <p className="text-gray-500 font-medium">Chọn cách bạn muốn nhận thông tin từ Eatzy</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notificationTypes.map((type) => (
          <div
            key={type.key}
            onClick={() => toggle(type.key as keyof typeof settings)}
            className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[32px] hover:border-[var(--primary)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${settings[type.key as keyof typeof settings] ? 'bg-lime-500 text-white shadow-lg shadow-lime-500/20' : 'bg-slate-50 text-gray-400 group-hover:bg-slate-100 group-hover:text-[#1A1A1A]'}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#1A1A1A]" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>{type.label}</h3>
                <p className="text-gray-500 font-medium">{type.sub}</p>
              </div>
            </div>

            <div
              className={`relative w-14 h-8 rounded-full transition-all duration-500 ${settings[type.key as keyof typeof settings] ? 'bg-lime-500' : 'bg-gray-200'}`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-500 ${settings[type.key as keyof typeof settings] ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[32px] bg-[#1A1A1A] text-white flex items-center justify-between overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-lime-400" />
          </div>
          <div>
            <h4 className="font-bold text-lg uppercase tracking-tight" style={{ fontFamily: "var(--font-anton), var(--font-sans)" }}>Quyền riêng tư</h4>
            <p className="text-gray-400 text-sm">Chúng tôi không bao giờ chia sẻ thông tin liên hệ của bạn cho bên thứ ba.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
