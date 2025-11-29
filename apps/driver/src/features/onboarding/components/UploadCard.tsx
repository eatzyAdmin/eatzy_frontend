"use client";
import { useRef } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@repo/ui';

export default function UploadCard({ label, value, onChange }: { label: string; value?: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file?: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  };

  return (
    <div className="w-full rounded-2xl border border-dashed border-gray-300 p-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Camera size={20} className="text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-700">{label}</div>
        </div>
        <Button variant="primary" size="sm" className="px-3 py-2 text-xs" onClick={() => inputRef.current?.click()}>Tải ảnh lên</Button>
      </div>
      {value && (
        <div className="mt-3">
          <img src={value} alt={label} className="w-full h-40 object-cover rounded-xl border" />
          <div className="mt-2 flex justify-end">
            <Button variant="outline" size="sm" className="text-xs px-3 py-1" onClick={() => inputRef.current?.click()}>Thay ảnh</Button>
          </div>
        </div>
      )}
      <input ref={inputRef} className="hidden" type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}
