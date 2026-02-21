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
        <div className="bg-white rounded-[40px] shadow-[0_4px_25px_rgba(0,0,0,0.04)] border border-gray-100/50 flex flex-col h-full overflow-hidden" style={{ transform: 'translateZ(0)' }}>
          <div className="relative h-40 md:h-44 shrink-0">
            <ImageWithFallback
              src={restaurant.imageUrl || ""}
              alt={restaurant.name}
              fill
              placeholderMode="vertical"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
            <div className="relative z-10 h-full p-8 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
                  <Store className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] drop-shadow-sm">Đánh giá cửa hàng</span>
              </div>
              <h3 className="font-anton text-2xl text-white uppercase leading-tight drop-shadow-xl">{restaurant.name}</h3>
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {!isReviewed ? (
              <>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-6 text-center">Bạn thấy món ăn thế nào?</p>
                <div className="flex items-center gap-3 mb-8 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="focus:outline-none"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-11 h-11 transition-all duration-300 ${star <= (hoveredRating || rating)
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]"
                          : "text-gray-100"
                          }`}
                        strokeWidth={1.5}
                      />
                    </motion.button>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ cảm nhận của bạn về món ăn..."
                  className="w-full bg-gray-50/50 border-2 border-transparent rounded-[32px] p-6 text-sm text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)]/20 focus:ring-4 focus:ring-[var(--primary)]/5 focus:bg-white transition-all resize-none mb-10 min-h-[120px] shadow-inner"
                />

                <motion.button
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSubmit(rating, comment)}
                  disabled={isSubmitting || rating === 0}
                  className="w-full h-16 rounded-[24px] bg-[var(--primary)] text-white text-xl uppercase font-anton tracking-wider shadow-xl shadow-[var(--primary)]/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group mt-auto"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  {isSubmitting ? "ĐANG GỬI..." : "GỬI ĐÁNH GIÁ"}
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col h-full bg-gray-50/40 rounded-[36px] p-8 border border-gray-100/50 relative">
                <div className="absolute -top-3 left-8 bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                  <ShieldCheck className="w-4 h-4 text-lime-400" />
                  Đã đánh giá
                </div>

                <div className="flex justify-between items-end mb-8 pt-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mức độ hài lòng</span>
                    <div className="flex items-center gap-3">
                      <span className="font-anton text-[48px] text-[#1A1A1A] leading-none">{rating}.0</span>
                      <Star className="w-7 h-7 fill-amber-400 text-amber-400 shadow-amber-400/20" />
                    </div>
                  </div>
                </div>

                <div className="relative flex-1 bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 italic min-h-[100px]">
                  <Quote className="w-10 h-10 text-gray-100 absolute -top-4 -left-2 fill-gray-100/30" />
                  <p className="text-[#1A1A1A] text-sm leading-relaxed z-10 relative">
                    &quot;{comment || "Cảm ơn vì món ăn ngon!"}&quot;
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
