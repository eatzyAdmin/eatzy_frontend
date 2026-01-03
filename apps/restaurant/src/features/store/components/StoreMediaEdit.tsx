import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { X, Save, Trash2, Image as ImageIcon, RotateCcw, GripVertical } from "@repo/ui/icons";
import { ImageWithFallback, useNotification, useSwipeConfirmation } from "@repo/ui";

interface StoreMediaEditProps {
  store: { images?: string[];[key: string]: unknown };
  onSave: (updates: { images: string[] }) => void;
  onClose: () => void;
  layoutId?: string;
}

interface MediaItem {
  id: string;
  url: string;
  isDeleted: boolean;
  file?: File;
}

export default function StoreMediaEdit({ store, onSave, onClose, layoutId }: StoreMediaEditProps) {
  const { showNotification } = useNotification();
  const { confirm } = useSwipeConfirmation();
  const objectUrls = useRef<string[]>([]);

  // Initialize Items
  const [items, setItems] = useState<MediaItem[]>(() => {
    return (store.images || []).map((url: string) => ({
      id: Math.random().toString(36).substr(2, 9),
      url,
      isDeleted: false
    }));
  });

  const [dragActive, setDragActive] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const lastSwapTime = useRef(0);

  // Drag & Drop File
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    const newItems: MediaItem[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        objectUrls.current.push(url);
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          url,
          isDeleted: false,
          file
        });
      }
    });

    if (newItems.length > 0) {
      setItems(prev => [...prev, ...newItems]);
      showNotification({
        type: 'success',
        message: `Đã thêm ${newItems.length} ảnh mới`,
        format: 'Đã tải lên một ảnh mới thành công',
        autoHideDuration: 2000
      });
    }
  };

  // Reorder Logic (Swap)
  const handleItemDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    // Needed for HTML5 DnD to work
    e.dataTransfer.effectAllowed = "move";

    // Hide default ghost image
    const emptyImage = new Image();
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  };

  const handleItemDragEnter = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (draggingId === null || draggingId === targetId) return;

    // Throttle: Prevent rapid-fire swaps (jitter) during animation
    const now = Date.now();
    if (now - lastSwapTime.current < 200) return;

    const sourceIndex = items.findIndex(i => i.id === draggingId);
    const targetIndex = items.findIndex(i => i.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const newItems = [...items];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      setItems(newItems);
      lastSwapTime.current = now;
    }
  };

  const handleItemDragEnd = () => {
    setDraggingId(null);
  };

  // Soft Delete
  const toggleDelete = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, isDeleted: !item.isDeleted } : item
    ));
  };

  // Save
  const handleSave = () => {
    const activeItems = items.filter(i => !i.isDeleted);
    const finalUrls = activeItems.map(i => i.url);

    // Check if there are any changes
    const originalUrls = store.images || [];
    const hasChanges =
      finalUrls.length !== originalUrls.length ||
      finalUrls.some((url, index) => url !== originalUrls[index]);

    if (!hasChanges) {
      showNotification({
        type: 'error',
        message: 'Không có thay đổi nào để lưu',
        format: 'Kiểm tra lại dữ liệu và thử lại nhé.',
        autoHideDuration: 3000
      });
      return;
    }

    confirm({
      title: 'Cập nhật thư viện ảnh',
      description: 'Các thay đổi về ảnh sẽ được cập nhật. Ảnh bị xóa sẽ không thể khôi phục sau khi lưu.',
      confirmText: 'Lưu thay đổi',
      type: 'info',
      onConfirm: async () => {
        // Wait for animation
        await new Promise(resolve => setTimeout(resolve, 300));
        onSave({ images: finalUrls });
      }
    });
  };

  // Cleanup ObjectURLs
  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // Mouse Tracking for Custom Drag Overlay
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Get dragging item data
  const draggingItem = items.find(i => i.id === draggingId);

  const activeCount = items.filter(i => !i.isDeleted).length;

  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white w-[1000px] max-w-[95vw] rounded-[32px] p-8 shadow-2xl relative overflow-hidden flex flex-col h-[90vh] border border-gray-100"
      onDragOver={handleGlobalDragOver} // Track mouse globally in modal
    >
      {/* ... Header ... */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-3xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-6 h-6" />
          </div>
          MANAGE GALLERY
          <span className="text-sm font-sans font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full ml-2">
            {activeCount} Photos
          </span>
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="p-4 rounded-full font-bold bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
          </button>

          <button
            onClick={onClose}
            className="p-4 rounded-full font-bold bg-gray-100 text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {/* Drop Zone - Modern Light Style */}
        <div
          className={`relative rounded-3xl border-2 border-dashed transition-all duration-500 mb-8 overflow-hidden group h-48 flex flex-col items-center justify-center cursor-pointer
            ${dragActive
              ? 'border-blue-500 bg-blue-50/50 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] scale-[1.01]'
              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={dragActive ? { y: -10, rotate: 10, scale: 1.1 } : { y: 0, rotate: 0, scale: 1 }}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${dragActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'}`}
            >
              {/* Paperclip Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </motion.div>
            <h3 className={`text-lg font-bold transition-colors ${dragActive ? 'text-blue-500' : 'text-slate-600'}`}>
              {dragActive ? 'Thả tay để upload ngay!' : 'Thả các tệp tại đây'}
            </h3>
            <p className="text-sm font-medium text-slate-400 group-hover:text-slate-500 transition-colors">
              hoặc nhấn để duyệt ảnh từ thiết bị
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-1">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`aspect-square cursor-grab active:cursor-grabbing transition-[padding] duration-300
                  ${item.isDeleted ? 'p-3' : 'p-0'}
                  ${draggingId === item.id ? 'opacity-0' : ''}
                `}
                draggable={!item.isDeleted}
                onDragStart={(e) => handleItemDragStart(e as unknown as React.DragEvent<HTMLDivElement>, item.id)}
                onDragEnter={(e) => handleItemDragEnter(e as unknown as React.DragEvent<HTMLDivElement>, item.id)}
                onDragEnd={handleItemDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className={`relative w-full h-full rounded-[36px] overflow-hidden group bg-white
                   ${item.isDeleted ? 'opacity-80 shadow-none grayscale' : 'hover:shadow-lg shadow-sm'}
                `}>
                  <ImageWithFallback
                    src={item.url}
                    alt="Gallery Item"
                    fill
                    className={`object-cover pointer-events-none select-none ${item.isDeleted ? '' : 'transition-transform duration-500 group-hover:scale-110'}`}
                    draggable={false}
                  />

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 transition-colors duration-300 ${!item.isDeleted && 'group-hover:bg-black/10'}`} />

                  {/* Deleted Overlay - Darker for deleted items */}
                  {item.isDeleted && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10" />
                  )}

                  {/* Controls - Center Position */}
                  <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">

                    {/* Delete / Undo Button */}
                    <button
                      onClick={() => toggleDelete(item.id)}
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 pointer-events-auto
                         ${item.isDeleted
                          ? 'bg-white text-blue-400 hover:scale-110 hover:bg-blue-50 ring-4 ring-white' // Undo State (Pastel Blue)
                          : 'bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 translate-y-4 group-hover:translate-y-0' // Delete State (Destructive)
                        }
                       `}
                      title={item.isDeleted ? "Undo Delete" : "Remove Photo"}
                    >
                      {item.isDeleted ? <RotateCcw className="w-6 h-6" strokeWidth={2.5} /> : <Trash2 className="w-6 h-6" strokeWidth={2} />}
                    </button>

                    {/* Drag Handle - Corner */}
                    {!item.isDeleted && (
                      <div className="absolute top-4 left-4 text-white/90 opacity-0 group-hover:opacity-100 drop-shadow-md transition-opacity duration-300">
                        <GripVertical className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>


      {/* Custom Drag Overlay */}
      {draggingId && draggingItem && (
        <div
          className="fixed pointer-events-none z-[100] w-40 h-40 rounded-[36px] overflow-hidden shadow-2xl ring-4 ring-[var(--primary)] ring-opacity-50 rotate-6"
          style={{
            top: mousePos.y,
            left: mousePos.x,
            transform: 'translate(-50%, -50%)', // Center on mouse
          }}
        >
          <ImageWithFallback src={draggingItem.url} alt="Dragging" fill className="object-cover" />
        </div>
      )}

    </motion.div>
  );
}
