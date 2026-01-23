import { motion } from "@repo/ui/motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  subValue: string;
  trend: number;
  color: "blue" | "orange" | "purple" | "green";
  icon: LucideIcon;
  delay?: number;
}

export function MetricCard({ label, value, subValue, trend, color, icon: Icon, delay = 0 }: MetricCardProps) {
  const gradients = {
    blue: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
    orange: "linear-gradient(135deg, #FCCF31 0%, #F55555 100%)",
    purple: "linear-gradient(135deg, #9796F0 0%, #FBC7D4 100%)",
    green: "linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)",
  };

  const shadows = {
    blue: "0 10px 20px -5px rgba(0, 13, 255, 0.3)",
    orange: "0 10px 20px -5px rgba(245, 85, 85, 0.3)",
    purple: "0 10px 20px -5px rgba(151, 150, 240, 0.3)",
    green: "0 10px 20px -5px rgba(67, 233, 123, 0.3)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative p-6 rounded-[32px] text-white overflow-hidden h-48 flex flex-col justify-between group cursor-pointer"
      style={{
        background: gradients[color],
        boxShadow: shadows[color],
      }}
    >
      {/* Glass effect bubbles */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-700" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl w-fit">
          <Icon size={24} className="text-white" />
        </div>
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          <span>{trend > 0 ? "+" : ""}{trend}%</span>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-white/80 text-sm font-medium mb-1">{label}</h3>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <p className="text-white/60 text-xs">{subValue}</p>
      </div>
    </motion.div>
  );
}
