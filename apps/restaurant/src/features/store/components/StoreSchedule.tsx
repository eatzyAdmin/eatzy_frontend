import { motion } from "@repo/ui/motion";
import { Clock, Edit2 } from "@repo/ui/icons";

interface Shift {
  open: string;
  close: string;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  shifts: Shift[];
}

interface StoreScheduleProps {
  store: { openingHours: DaySchedule[] };
  onEdit: () => void;
  layoutId?: string;
}

export default function StoreSchedule({ store, onEdit, layoutId }: StoreScheduleProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-gray-200 relative group"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          OPENING HOURS
        </h2>

        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-gray-100 text-gray-400 font-bold text-sm flex items-center gap-2 hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
        >
          <Edit2 className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="space-y-4">
        {store.openingHours.map((item: DaySchedule) => (
          <div key={item.day} className="flex items-end justify-between py-2 group">
            {/* Day Name */}
            <div className={`text-base font-bold shrink-0 ${item.isOpen ? 'text-[#1A1A1A]' : 'text-gray-300'}`}>
              {item.day}
            </div>

            {/* Dotted Leader Line */}
            <div className="flex-1 mx-4 mb-2 border-b-2 border-dotted border-gray-200" />

            {/* Time / Status */}
            <div className="text-right shrink-0">
              {item.isOpen && item.shifts && item.shifts.length > 0 ? (
                <div className="flex flex-col items-end gap-1">
                  {item.shifts.map((shift: Shift, i: number) => (
                    <span key={i} className="text-sm font-bold text-[#1A1A1A] tracking-wide">
                      {shift.open} - {shift.close}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Closed
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
