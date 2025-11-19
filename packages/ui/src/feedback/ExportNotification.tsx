import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, X, Check, AlertCircle } from "lucide-react";

export type ExportNotificationProps = {
  isVisible: boolean;
  onClose: () => void;
  format?: 'pdf' | 'excel' | string;
  message?: string;
  autoHideDuration?: number;
  type?: 'success' | 'error';
};

const ExportNotification = ({ isVisible, onClose, format = 'pdf', message = 'Export successful!', autoHideDuration = 5000, type = 'success' }: ExportNotificationProps) => {
  useEffect(() => { let timer: any; if (isVisible && autoHideDuration > 0) { timer = setTimeout(() => { onClose(); }, autoHideDuration); } return () => { if (timer) clearTimeout(timer); }; }, [isVisible, autoHideDuration, onClose]);
  const getFormatIcon = () => { switch (String(format).toLowerCase()) { case 'pdf': return <FileText size={20} className="text-red-500" />; case 'excel': return <FileText size={20} className="text-green-500" />; default: return <FileText size={20} className="text-blue-500" />; } };
  const getFormatText = () => { switch (String(format).toLowerCase()) { case 'pdf': return 'PDF'; case 'excel': return 'Excel'; default: return String(format); } };
  const getNotificationColor = () => type === 'success' ? 'from-green-600 to-emerald-500' : 'from-red-600 to-orange-500';
  const getNotificationShadow = () => type === 'success' ? 'shadow-[0_10px_40px_rgba(34,197,94,0.3)]' : 'shadow-[0_10px_40px_rgba(239,68,68,0.3)]';
  const getNotificationIcon = () => type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />;
  const getNotificationBgColor = () => type === 'success' ? 'from-green-400 to-emerald-500' : 'from-red-400 to-orange-500';
  const containerVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300, duration: 0.4 } }, exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } } };
  const iconVariants = { hidden: { scale: 0, rotate: -180 }, visible: { scale: 1, rotate: 0, transition: { delay: 0.2, type: 'spring', stiffness: 260, damping: 20 } } };
  const formatIconVariants = { hidden: { scale: 0 }, visible: { scale: 1, transition: { delay: 0.3, type: 'spring', stiffness: 260, damping: 20 } } };
  const textVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } } };
  const progressVariants = { hidden: { width: '0%' }, visible: { width: '100%', transition: { duration: autoHideDuration ? autoHideDuration / 1000 : 5, ease: 'linear' } } };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className={`fixed z-[70] md:left-1/2 left-4 right-4 top-4 sm:-translate-x-1/4 pointer-events-none`} initial="hidden" animate="visible" exit="exit" variants={containerVariants} style={{ margin: '0 auto' }}>
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }} className={`relative overflow-hidden rounded-3xl p-[2px] ${getNotificationShadow()} w-full sm:w-[500px] mx-auto pointer-events-auto`}>
            <div className="relative rounded-[calc(1.5rem-2px)] bg-white/60 backdrop-blur-md p-5 flex items-center space-x-4 shadow-inner">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getNotificationBgColor()} flex items-center justify-center shadow-[0_4px_16px_rgba(52,211,153,0.18)]`}>
                <motion.div variants={iconVariants} className="text-white">{getNotificationIcon()}</motion.div>
              </div>
              <div className="flex-1 min-w-0">
                <motion.div variants={textVariants} className="text-base font-bold text-blue-900 truncate">{message}</motion.div>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div variants={formatIconVariants} className="flex items-center">{getFormatIcon()}</motion.div>
                  <span className="text-xs text-blue-600 font-semibold backdrop-blur-sm bg-blue-100/40 rounded-xl px-2 py-0.5 shadow-sm">{getFormatText()}</span>
                </div>
              </div>
              <button onClick={onClose} className="absolute bg-white/50 top-3 right-3 p-2 rounded-full hover:bg-blue-50 transition-colors shadow" aria-label="Đóng thông báo"><X size={20} className="text-blue-400" /></button>
            </div>
            {autoHideDuration > 0 && (<motion.div className={`absolute left-0 bottom-0 h-1 bg-gradient-to-r ${getNotificationBgColor()}`} variants={progressVariants} initial="hidden" animate="visible" />)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExportNotification;