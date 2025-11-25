"use client";
import { motion } from "@repo/ui/motion";
import { FileText } from "@repo/ui/icons";

export default function NotesInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative bg-white rounded-[18px] p-5 border-2 border-dashed border-gray-200 shadow-sm">
      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="absolute -right-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="text-[14px] font-semibold text-[#1A1A1A] mb-3">Ghi chú cho tài xế</div>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 text-gray-500 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            placeholder="Ví dụ: Gọi trước khi đến, không bấm chuông"
            className="w-full bg-transparent outline-none text-[14px] px-0 py-2 border-b-2 border-dashed border-gray-300 focus:border-gray-500"
          />
          <motion.div className="text-[12px] text-[#555] mt-2">Thông tin sẽ hiển thị cho tài xế</motion.div>
        </div>
      </div>
    </div>
  );
}
