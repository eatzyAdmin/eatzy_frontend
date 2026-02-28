import { motion, AnimatePresence } from "@repo/ui/motion";
import { Star, Send, ShieldCheck, Quote, Store } from "@repo/ui/icons";
import { ImageWithFallback } from "@repo/ui";

interface RestaurantReviewCardProps {
  restaurant: any;
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

export function RestaurantReviewCard({
  restaurant,
  isReviewed,
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  comment,
  setComment,
  onSubmit,
  isSubmitting,
}: RestaurantReviewCardProps) {
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

          <div className="relative h-44 md:h-52 shrink-0 overflow-hidden">
            <ImageWithFallback
              src={restaurant.imageUrl || ""}
              alt={restaurant.name}
              fill
              placeholderMode="horizontal"
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            <div className="relative z-10 h-full p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="px-3 py-1 bg-lime-500/90 backdrop-blur-md rounded-full flex items-center gap-2">
                  <Store className="w-3 h-3 text-black" />
                  <span className="text-[9px] font-anton text-black uppercase tracking-widest">Restaurant</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/50">
                  <Quote className="w-5 h-5" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-anton text-lime-400 uppercase tracking-[0.4em] mb-1 block">Series / Review</span>
                <h3 className="font-anton text-4xl text-white uppercase leading-none truncate">{restaurant.name}</h3>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col relative z-20">
            {!isReviewed ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-px bg-black" />
                    <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.3em]">Crating Flavor</span>
                  </div>
                  <h4 className="font-anton text-2xl text-black uppercase leading-tight mb-2">How was the meal?</h4>
                  <p className="text-[11px] text-gray-400 font-medium italic">Your feedback helps us refine the culinary series.</p>
                </div>

                <div className="flex items-center gap-2 mb-10 p-4 bg-black/5 rounded-[32px] justify-center relative">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.15, rotate: 5 }}
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
                    placeholder="Describe your dining experience..."
                    className="w-full bg-white/60 backdrop-blur-md border border-white/50 rounded-[32px] p-6 text-sm text-black placeholder:text-gray-300 focus:outline-none focus:border-lime-500/50 focus:bg-white/90 transition-all resize-none min-h-[140px] shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
                  />
                  <div className="absolute top-4 right-6 text-[10px] font-anton text-gray-200 uppercase">Text / Feed</div>
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
                    <span className="text-xs font-anton text-black uppercase tracking-widest">VERIFIED REVIEW</span>
                  </div>
                </div>

                <div className="mb-10 text-center md:text-left">
                  <span className="text-[10px] font-anton text-gray-400 uppercase tracking-[0.4em] mb-4 block">Satisfaction Level</span>
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <span className="font-anton text-[80px] text-black leading-none tracking-tighter shadow-sm">{rating}.0</span>
                    <div className="flex flex-col">
                      <div className="flex gap-1.5 mb-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-lime-500 text-lime-500" : "text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-anton text-lime-600 uppercase tracking-widest">Gourmet Series Score</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 flex items-center justify-center text-center px-4">
                  <Quote className="w-16 h-16 text-black/5 absolute top-0 left-0 -translate-x-4 -translate-y-4" />
                  <p className="text-black text-lg font-medium leading-relaxed relative z-10 font-serif italic max-w-sm">
                    &quot;{comment || "An exceptional dining series. Highly recommended."}&quot;
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
