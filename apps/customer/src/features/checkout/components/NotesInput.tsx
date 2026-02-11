"use client";
import { motion } from "@repo/ui/motion";
import { FileText } from "@repo/ui/icons";

export default function NotesInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50">
      <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
        <FileText className="w-5 h-5 text-gray-400" />
        <h4 className="font-bold text-[#1A1A1A]">Driver Notes</h4>
      </div>
      <div className="p-5 pt-0 md:pt-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              placeholder="Ví dụ: Gọi trước khi đến, không bấm chuông"
              className="w-full bg-transparent outline-none text-[14px] font-bold text-[#1A1A1A] placeholder:text-gray-300 placeholder:font-normal px-0 py-2 border-b border-gray-100 focus:border-orange-500 transition-colors resize-none"
            />
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">
              Thông tin sẽ hiển thị cho tài xế
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
