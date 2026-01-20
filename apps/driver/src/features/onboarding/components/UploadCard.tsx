"use client";
import { useRef } from 'react';
import Image from "next/image";
import { Camera, Upload } from "@repo/ui/icons";
import { Button } from '@repo/ui';

export default function UploadCard({ label, value, onChange }: { label: string; value?: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div className="w-full rounded-[20px] border-2 border-dashed border-gray-200 p-5 bg-gray-50/50 hover:border-lime-300 hover:bg-lime-50/30 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-lime-100 group-hover:border-lime-200 transition-all">
            <Camera size={22} className="text-gray-400 group-hover:text-lime-600 transition-colors" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#1A1A1A]">{label}</div>
            <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Upload Image</div>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="px-4 py-2.5 text-xs font-bold bg-lime-500 hover:bg-lime-400 text-[#1A1A1A] rounded-xl shadow-lg shadow-lime-500/20 uppercase tracking-wider flex items-center gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          Tải ảnh
        </Button>
      </div>
      {value && (
        <div className="mt-4">
          <div className="relative w-full h-44 rounded-[16px] overflow-hidden border-2 border-gray-100 shadow-sm">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-4 py-2 font-bold border-2 border-gray-100 hover:border-lime-200 rounded-xl uppercase tracking-wider"
              onClick={() => inputRef.current?.click()}
            >
              Thay ảnh
            </Button>
          </div>
        </div>
      )}
      <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}
