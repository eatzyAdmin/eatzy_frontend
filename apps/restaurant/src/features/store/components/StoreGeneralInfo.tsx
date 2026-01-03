import { motion } from "@repo/ui/motion";
import { FileText, Phone, Mail, Edit2, ShieldCheck, Star } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";

interface StoreGeneralInfoProps {
  store: { name: string; imageUrl?: string; commissionRate: number; description: string; phone: string; email: string;[key: string]: unknown };
  onEdit: () => void;
  layoutId?: string;
}

export default function StoreGeneralInfo({ store, onEdit, layoutId }: StoreGeneralInfoProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-gray-200 relative group h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-anton font-bold text-[#1A1A1A] flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          GENERAL INFORMATION
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

      <div className="flex flex-col xl:flex-row gap-8 h-full">
        {/* Left: Profile Card - Airbnb Style */}
        <div className="w-full xl:w-[280px] shrink-0">
          <div className="bg-white rounded-[32px] shadow-[0_0_30px_rgba(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col items-center text-center h-full xl:h-auto">
            {/* Avatar Image */}
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md relative">
                <ImageWithFallback
                  src={store.imageUrl || ''}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-[var(--primary)] text-white p-1.5 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Store Name & Badge */}
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-1 px-2 leading-tight">{store.name}</h3>
            <div className="flex items-center gap-1.5 mb-6">
              <span className="text-xs font-bold text-gray-500">Restaurant Partner</span>
            </div>

            <div className="w-full border-t border-gray-100 mb-6" />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full text-left px-1">
              {/* Reviews */}
              <div>
                <div className="text-xl font-bold text-[#1A1A1A]">882</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Reviews</div>
              </div>

              {/* Rating */}
              <div className="border-l border-gray-100 pl-4">
                <div className="text-xl font-bold text-[#1A1A1A] flex items-center gap-1">
                  4.93 <Star className="w-3 h-3 fill-[#1A1A1A]" />
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Rating</div>
              </div>

              {/* Commission */}
              <div className="mt-2 pt-4 border-t border-gray-100 col-span-2">
                <div className="text-xl font-bold text-[#1A1A1A] flex items-center gap-2">
                  <span>{store.commissionRate}%</span>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0 rounded-xl uppercase tracking-wide shadow-sm">FIXED</span>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Commission Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="flex-1 flex flex-col pt-2">
          {/* Section: About */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-[#1A1A1A] mb-3">About {store.name}</h4>
            <div className="text-base text-gray-600 leading-relaxed">
              {store.description}
            </div>
          </div>

          <div className="w-full border-t border-gray-100 mb-8" />

          {/* Section: Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-[#1A1A1A] mb-4">Contact Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Phone className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">Phone Support</div>
                  <div className="text-xs text-gray-500 mt-0.5">{store.phone}</div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Mail className="w-4 h-4 text-[#1A1A1A]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">Email</div>
                  <div className="text-xs text-gray-500 mt-0.5 break-all">{store.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center gap-3 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>To protect your payment, always communicate through the Eatzy website.</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
