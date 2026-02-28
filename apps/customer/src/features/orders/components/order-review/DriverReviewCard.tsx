import { motion, AnimatePresence } from "@repo/ui/motion";
import { Star, Send, ShieldCheck, Quote, Bike, User as UserIcon } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";

interface DriverReviewCardProps {
  driver: any;
  isReviewed: boolean;
  rating: number;
  setRating: (rating: number) => void;
  hoveredRating: number;
  setHoveredRating: (rating: number) => void;
  comment: string;
  setComment: (comment: string) => void;
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting: boolean;
}

export function DriverReviewCard({
  driver,
  isReviewed,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  comment,
  setComment,
  onSubmit,
  isSubmitting,
}: DriverReviewCardProps) {
  if (!driver) {
    return (
      <div className="bg-white/40 backdrop-blur-xl rounded-[44px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-full overflow-hidden p-12 items-center justify-center text-center relative min-h-[500px]">
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale mix-blend-multiply">
          <ImageWithFallback src="" alt="Texture" placeholderMode="horizontal" fill className="object-cover" />
        </div>
        <div className="w-24 h-24 rounded-full bg-black/5 flex items-center justify-center mb-8">
          <UserIcon className="w-12 h-12 text-gray-300" />
        </div>
        <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.5em] mb-4">Personnel Information</span>
        <h3 className="font-anton text-3xl uppercase tracking-tighter text-black">Driver details pending</h3>
        <p className="text-xs text-gray-400 mt-4 max-w-[200px] leading-relaxed italic">The logistical personnel for this series has not been assigned.</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isReviewed ? "submitted" : "form"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="h-full"
      >
        <div className={`${isReviewed ? "bg-white/95" : "bg-white/40"} backdrop-blur-xl rounded-[44px] shadow-[0_40px_100px_rgba(0,0,0,0.05)] border border-white/40 flex flex-col h-full overflow-hidden relative group`} style={{ transform: 'translateZ(0)' }}>
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale mix-blend-multiply">
            <ImageWithFallback src="" alt="Texture" placeholderMode="horizontal" fill className="object-cover" />
          </div>

          <div className="relative h-44 md:h-52 shrink-0 overflow-hidden bg-gray-900 group/header">
            {/* Background Texture Image - Brighter and clearer */}
            <ImageWithFallback
              src=""
              alt="Header Texture"
              fill
              placeholderMode="horizontal"
              className="object-cover opacity-60 grayscale contrast-125 scale-110 group-hover/header:scale-100 transition-transform duration-[4s] ease-out"
            />

            <div className="absolute top-0 right-0 w-48 h-48 bg-lime-500/15 rounded-full -mr-24 -mt-24 blur-3xl" />

            <div className="relative z-10 h-full p-8 flex items-center gap-6">
              {/* Circular Avatar - Premium Style */}
              <div className="relative shrink-0 group/avatar">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1.5 bg-gradient-to-tr from-lime-500/50 to-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-all duration-700 group-hover/avatar:rotate-12">
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-900 flex items-center justify-center border border-white/5">
                    {driver.avatarUrl ? (
                      <ImageWithFallback
                        src={driver.avatarUrl}
                        alt={driver.name}
                        fill
                        className="object-cover transition-transform duration-[2s] group-hover/avatar:scale-110"
                      />
                    ) : (
                      <UserIcon className="w-12 h-12 text-gray-600" />
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-lime-500 border-4 border-black flex items-center justify-center text-black shadow-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Driver Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white backdrop-blur-md">
                    <Bike className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-anton text-white/50 uppercase tracking-[0.3em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Logistics Series</span>
                </div>
                <h3 className="font-anton text-4xl text-white uppercase leading-none truncate drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                  {driver.name || "EATZY PARTNER"}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <p className="text-[10px] text-lime-500 font-anton uppercase tracking-[0.2em] border border-lime-500/30 px-3 py-1 rounded-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                    {driver.vehicleLicensePlate || "TR-0000"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col relative z-20">
            {!isReviewed ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-black" />
                    <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Personnel Review</span>
                  </div>
                  <h4 className="font-anton text-2xl text-black uppercase leading-tight mb-2">Was he friendly?</h4>
                  <p className="text-[11px] text-gray-400 font-medium italic">Your rating ensures high-quality logistical standards.</p>
                </div>

                <div className="flex items-center gap-2 mb-10 p-4 bg-black/5 rounded-[32px] justify-center relative">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.15, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="focus:outline-none p-2 relative z-10"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-10 h-10 transition-all duration-500 ease-out ${star <= (hoveredRating || rating)
                          ? "fill-lime-500 text-lime-500 drop-shadow-[0_0_15px_rgba(163,230,53,0.6)]"
                          : "text-white fill-white/20"
                          }`}
                        strokeWidth={2}
                      />
                    </motion.button>
                  ))}
                </div>

                <div className="relative mb-8">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Feedback for the delivery partner..."
                    className="w-full bg-white/60 backdrop-blur-md border border-white/50 rounded-[32px] p-6 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-lime-500/50 focus:bg-white/90 transition-all resize-none min-h-[140px] shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute top-4 right-6 text-[10px] font-anton text-gray-200 uppercase">Input / Log</div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSubmit(rating, comment)}
                  disabled={isSubmitting || rating === 0}
                  className="w-full h-16 rounded-[24px] bg-lime-500 text-black text-base uppercase font-anton font-bold tracking-[0.2em] shadow-2xl shadow-lime-500/20 flex items-center justify-center gap-3 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all duration-500"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "SENDING..." : "SUBMIT REVIEW"}
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col h-full relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />

                <div className="flex items-center gap-3 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-lime-500 shadow-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em] block">Status</span>
                    <span className="text-xs font-anton text-black uppercase tracking-widest">VERIFIED SERVICE</span>
                  </div>
                </div>

                <div className="mb-10 text-center md:text-left">
                  <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.4em] mb-4 block">Service Rating</span>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="font-anton text-[80px] text-black leading-none tracking-tighter shadow-sm">{rating}.0</span>
                    <div className="flex flex-col">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-lime-500 text-lime-500" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-anton text-lime-600 uppercase tracking-widest">Logistics Series Score</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 flex items-center justify-center text-center px-4">
                  <Quote className="w-16 h-16 text-black/5 absolute top-0 left-0 -translate-x-4 -translate-y-4" />
                  <p className="text-black text-lg font-medium leading-relaxed relative z-10 font-serif italic max-w-sm">
                    &quot;{comment || "Prompt logistical delivery. Exceptional service."}&quot;
                  </p>
                  <Quote className="w-16 h-16 text-black/5 absolute bottom-0 right-0 translate-x-4 translate-y-4 rotate-180" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
