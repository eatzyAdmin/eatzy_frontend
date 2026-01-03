import { useState } from "react";
import { motion } from "@repo/ui/motion";
import { FileText, X, Save, Edit2 } from "@repo/ui/icons";
import { useNotification, useSwipeConfirmation } from "@repo/ui";

interface StoreGeneralInfoEditProps {
  store: { name: string; description: string; phone: string; email: string;[key: string]: unknown };
  onSave: (updates: { name: string; description: string; phone: string; email: string }) => void;
  onClose: () => void;
  layoutId?: string;
}

export default function StoreGeneralInfoEdit({ store, onSave, onClose, layoutId }: StoreGeneralInfoEditProps) {
  const [formData, setFormData] = useState({ ...store });
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const [initialJson] = useState(() => JSON.stringify(store));

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const currentJson = JSON.stringify(formData);
    if (currentJson === initialJson) {
      showNotification({
        type: 'error',
        message: 'Bạn chưa thực hiện thay đổi nào!',
        format: 'Kiểm tra lại các thay đổi và thử lại!',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Cập nhật thông tin',
      description: 'Thông tin chung của cửa hàng sẽ được cập nhật.',
      type: 'info',
      confirmText: 'Lưu thay đổi',
      onConfirm: async () => {
        onSave(formData);
      }
    });
  };

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white w-[600px] max-w-full rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          EDIT GENERAL INFO
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="p-4 rounded-full font-bold bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6 overflow-y-auto flex-1 pr-2">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Store Name</label>
          <div className="relative">
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className="w-full text-lg font-bold p-4 pr-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 focus:border-[var(--primary)] focus:border-solid focus:bg-white outline-none transition-all"
            />
            <Edit2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
          <div className="relative">
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              rows={5}
              className="w-full text-base p-4 pr-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 focus:border-[var(--primary)] focus:border-solid focus:bg-white outline-none transition-all resize-none"
            />
            <Edit2 className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                className="w-full font-medium p-4 pr-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 focus:border-[var(--primary)] focus:border-solid focus:bg-white outline-none transition-all"
              />
              <Edit2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full font-medium p-4 pr-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 focus:border-[var(--primary)] focus:border-solid focus:bg-white outline-none transition-all"
              />
              <Edit2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>


    </motion.div>
  );
}
