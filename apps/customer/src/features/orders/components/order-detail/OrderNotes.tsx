import { FileText } from "@repo/ui/icons";

export function OrderNotes({ notes }: { notes: string }) {
  return (
    <div className="bg-[#FFF9E6] p-6 rounded-[40px] border border-[#FFE8A3]/50 shrink-0">
      <div className="flex items-center gap-2.5 mb-3 text-amber-700">
        <FileText className="w-4.5 h-4.5" />
        <h5 className="font-bold uppercase text-[11px] tracking-widest">Ghi chú từ khách hàng</h5>
      </div>
      <p className="text-sm text-amber-900/70 font-medium italic leading-relaxed">
        "{notes}"
      </p>
    </div>
  );
}
