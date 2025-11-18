"use client";

import { FeatureCardData } from "../types";
import { Plus } from "@repo/ui/icons";

interface FeatureCardProps extends FeatureCardData {
  index: number;
  parallaxOffset: number;
  className?: string;
}

export default function FeatureCard({
  title,
  subtitle,
  description,
  icon,
  gradient,
  image,
  stats,
  tags,
  index,
  parallaxOffset,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`relative rounded-3xl p-6 shadow-lg overflow-hidden h-full transition-all duration-700 group hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${className}`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: `translateY(-${parallaxOffset * (0.02 + index * 0.006)}px)`,
      }}
    >
      {/* Background gradient overlay */}
      {!image && (
        <div className={`absolute inset-0 ${gradient} transition-all duration-500 group-hover:brightness-105`}></div>
      )}

      {/* Glass effect overlay */}
      <div className="absolute inset-3 rounded-3xl backdrop-blur-md bg-white/15 border border-white/20 transition-all duration-500 group-hover:bg-white/25"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4">
        {stats && (
          <>
            <h3
              className="text-3xl md:text-4xl font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:text-white origin-left"
              style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
            >
              {stats}
            </h3>
            <p
              className="text-sm font-bold text-white/90 mt-1 mb-5 transition-all duration-300 group-hover:text-white"
              style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
            >
              {title}
            </p>
          </>
        )}

        {!stats && (
          <h3
            className="text-xl font-semibold text-white mb-2 transition-all duration-300 group-hover:scale-105 origin-left"
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
          >
            {title}
          </h3>
        )}

        {subtitle && (
          <p
            className="text-sm font-medium text-white/90 mb-3"
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
          >
            {subtitle}
          </p>
        )}

        {description && (
          <p
            className="text-sm text-white/80 transition-all duration-300 group-hover:text-white/90"
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.3)" }}
          >
            {description}
          </p>
        )}

        {/* Icon display */}
        <div className="mt-auto flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:scale-110">
            {icon}
          </div>
          {tags && tags.length > 0 && (
            <div className="flex gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 bg-white/20 rounded-full text-white/90 backdrop-blur-sm"
                  style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Hover button */}
        <button className="absolute bottom-8 right-8 w-12 h-12 bg-white/0 rounded-full flex items-center justify-center text-white transition-all duration-500 group-hover:bg-white/90 group-hover:rotate-180 group-hover:scale-110 group-hover:text-[var(--primary)]">
          <Plus className="transition-all duration-300" />
        </button>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -translate-x-full group-hover:translate-x-full rounded-3xl"></div>
    </div>
  );
}

