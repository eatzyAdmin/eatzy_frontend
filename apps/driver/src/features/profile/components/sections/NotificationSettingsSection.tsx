"use client";

import { useState } from "react";
import { motion } from "@repo/ui/motion";
import {
  Bell, Volume2, Smartphone,
  MessageSquare, AlertTriangle
} from "@repo/ui/icons";

export default function NotificationSettingsSection() {
  const [notifications, setNotifications] = useState({
    push: true,
    sound: true,
    vibration: true,
    orders: true,
    messages: true,
    warnings: true
  });

  const toggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 pb-20"
    >
      {/* Main Channel Settings */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_0_25px_rgba(0,0,0,0.04)]">
        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-anton text-sm uppercase tracking-wider text-gray-400">Kênh thông báo</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ToggleItem
            icon={<Bell size={20} className="text-[var(--primary)]" />}
            title="Thông báo đẩy"
            description="Nhận thông báo khi có thông tin mới từ hệ thống"
            active={notifications.push}
            onToggle={() => toggle('push')}
          />
          <ToggleItem
            icon={<Volume2 size={20} className="text-[var(--primary)]" />}
            title="Âm thanh"
            description="Phát âm thanh khi nhận được thông báo"
            active={notifications.sound}
            onToggle={() => toggle('sound')}
          />
          <ToggleItem
            icon={<Smartphone size={20} className="text-[var(--primary)]" />}
            title="Rung"
            description="Rung điện thoại khi có thông báo quan trọng"
            active={notifications.vibration}
            onToggle={() => toggle('vibration')}
          />
        </div>
      </div>

      {/* Specific Content Settings */}
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_0_25px_rgba(0,0,0,0.04)]">
        <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/30">
          <h3 className="font-anton text-sm uppercase tracking-wider text-gray-400">Nội dung thông báo</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ToggleItem
            icon={<Bell size={20} className="text-[var(--primary)]" />}
            title="Đơn hàng mới"
            description="Thông báo khi có đơn hàng trong khu vực của bạn"
            active={notifications.orders}
            onToggle={() => toggle('orders')}
          />
          <ToggleItem
            icon={<MessageSquare size={20} className="text-[var(--primary)]" />}
            title="Tin nhắn khách hàng"
            description="Thông báo khi khách hàng nhắn tin cho bạn"
            active={notifications.messages}
            onToggle={() => toggle('messages')}
          />
          <ToggleItem
            icon={<AlertTriangle size={20} className="text-[var(--primary)]" />}
            title="Cảnh báo an toàn"
            description="Các thông tin quan trọng về tài khoản và an toàn"
            active={notifications.warnings}
            onToggle={() => toggle('warnings')}
          />
        </div>
      </div>

      <div className="px-6 text-center">
        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
          * Các thiết lập này chỉ áp dụng cho ứng dụng Eatzy Driver trên thiết bị này.
        </p>
      </div>
    </motion.div>
  );
}

function ToggleItem({ icon, title, description, active, onToggle }: { icon: React.ReactNode, title: string, description: string, active: boolean, onToggle: () => void }) {
  return (
    <div className="px-6 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="font-bold text-[#1A1A1A] text-sm">{title}</p>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <Switch active={active} onToggle={onToggle} />
    </div>
  );
}

function Switch({ active, onToggle }: { active: boolean, onToggle: () => void }) {
  return (
    <div
      className={`w-12 h-6 rounded-full cursor-pointer transition-all relative shrink-0 ${active ? 'bg-[var(--primary)]' : 'bg-gray-200'}`}
      onClick={onToggle}
    >
      <motion.div
        animate={{ x: active ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
      />
    </div>
  );
}
