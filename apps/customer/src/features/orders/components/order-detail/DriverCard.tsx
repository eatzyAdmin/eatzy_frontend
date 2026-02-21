import { motion } from "@repo/ui/motion";
import { User, ShieldCheck, Phone, Star } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";

export function DriverCard({ driver }: { driver: any }) {
  if (!driver) {
    return (
      <div className="bg-white rounded-[36px] md:rounded-[40px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col items-center justify-center min-h-[148px] h-full text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-3 border border-gray-100/50">
          <User className="w-6 h-6" />
        </div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Tài xế</h4>
        <div className="font-anton text-xl text-gray-300 uppercase tracking-wide">CHƯA CÓ TÀI XẾ</div>
        <p className="text-[10px] text-gray-400 font-medium mt-1">Đơn hàng đang chờ điều phối</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[40px] p-5 shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col justify-center min-h-[148px] h-full">
      <div className="flex items-stretch gap-0">
        <div className="w-[78%] flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border border-gray-100 overflow-hidden relative shadow-md">
              <ImageWithFallback src={driver.avatarUrl || ""} alt={driver.name} fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-pink-600 border-2 border-white flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-3 h-3" />
            </div>
          </div>
          <div className="mt-2 text-center">
            <h4 className="font-bold text-[#1A1A1A]">{driver.name.split(' ').pop()}</h4>
            {driver.phoneNumber && (
              <div className="mt-2 text-center flex justify-center">
                <motion.a
                  href={`tel:${driver.phoneNumber}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full bg-lime-50 border border-lime-100 flex items-center justify-center text-lime-600 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                </motion.a>
              </div>
            )}
          </div>
        </div>

        <div className="w-[38%] flex flex-col justify-between py-1">
          <div className="flex flex-col">
            <span className="font-anton text-[22px] text-[#1A1A1A] leading-none mb-0.5">{driver.completedTrips || "0"}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Đánh giá</span>
          </div>
          <div className="h-px w-full bg-gray-100 my-1.5" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1 leading-none mb-0.5">
              <span className="font-anton text-[22px] text-[#1A1A1A]">{parseFloat(driver.averageRating || "5.0").toFixed(2)}</span>
              <Star className="w-3.5 h-3.5 fill-[#1A1A1A] text-[#1A1A1A] -mt-0.5" />
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Xếp hạng</span>
          </div>
          <div className="h-px w-full bg-gray-100 my-1.5" />
          <div className="flex flex-col leading-tight">
            <span className="font-anton text-[18px] text-[#1A1A1A] leading-none tracking-tight">{driver.vehicleLicensePlate || "---"}</span>
            <span className="text-[9px] text-gray-500 font-bold truncate max-w-full">
              {driver.vehicleDetails || "Phương tiện"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
