import { motion } from "@repo/ui/motion";

export default function MagazineLayout8Shimmer() {
  const shimmerVariants = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: 2,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="overflow-hidden shadow-sm mb-16 p-12 bg-[#F5E6D3] opacity-80">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <motion.div
          className="h-3 w-24 bg-gray-300/50 rounded"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background:
              "linear-gradient(90deg, rgba(139, 115, 85, 0.2) 25%, rgba(139, 115, 85, 0.4) 50%, rgba(139, 115, 85, 0.2) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
        <motion.div
          className="h-3 w-24 bg-gray-300/50 rounded"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background:
              "linear-gradient(90deg, rgba(139, 115, 85, 0.2) 25%, rgba(139, 115, 85, 0.4) 50%, rgba(139, 115, 85, 0.2) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Main Title */}
      <div className="flex justify-center mb-10">
        <motion.div
          className="h-12 w-3/4 max-w-lg bg-gray-300/50 rounded"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background:
              "linear-gradient(90deg, rgba(44, 36, 22, 0.1) 25%, rgba(44, 36, 22, 0.2) 50%, rgba(44, 36, 22, 0.1) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="space-y-4">
            {/* Dish Title */}
            <motion.div
              className="h-8 w-1/2 bg-gray-300/50 rounded"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background:
                  "linear-gradient(90deg, rgba(44, 36, 22, 0.1) 25%, rgba(44, 36, 22, 0.2) 50%, rgba(44, 36, 22, 0.1) 75%)",
                backgroundSize: "200% 100%",
              }}
            />

            {/* Stars */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="h-3 w-3 rounded-full bg-[#D4A574]/30" />
              ))}
            </div>

            {/* Image */}
            <motion.div
              className="relative aspect-[4/3] rounded-tr-[64px] rounded-bl-[64px] bg-white shadow-md overflow-hidden"
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.6) 25%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.6) 75%)",
                backgroundSize: "200% 100%",
              }}
            />

            {/* Description */}
            <div className="space-y-2">
              <motion.div
                className="h-3 w-full bg-gray-300/50 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(90, 74, 58, 0.1) 25%, rgba(90, 74, 58, 0.2) 50%, rgba(90, 74, 58, 0.1) 75%)",
                  backgroundSize: "200% 100%",
                }}
              />
              <motion.div
                className="h-3 w-2/3 bg-gray-300/50 rounded"
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(90, 74, 58, 0.1) 25%, rgba(90, 74, 58, 0.2) 50%, rgba(90, 74, 58, 0.1) 75%)",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-[#D4A574]/30 flex justify-center">
        <motion.div
          className="h-3 w-48 bg-gray-300/50 rounded"
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
          style={{
            background:
              "linear-gradient(90deg, rgba(139, 115, 85, 0.2) 25%, rgba(139, 115, 85, 0.4) 50%, rgba(139, 115, 85, 0.2) 75%)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>
    </div>
  );
}
