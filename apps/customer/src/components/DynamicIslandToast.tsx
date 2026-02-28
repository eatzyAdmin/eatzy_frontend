"use client";

import { useEffect } from "react";
import { sileo as originalSileo, Toaster as OriginalToaster, SileoOptions } from "sileo";
import { motion } from "@repo/ui/motion";
import { Heart, HeartOff, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

// Mở rộng Options để hỗ trợ Action Type đặc thù
interface ExtendedToastOptions extends SileoOptions {
  actionType?: "favorite_add" | "favorite_remove" | "favorite_error";
}

const WrappedSileo = {
  ...originalSileo,
  success: (opts: ExtendedToastOptions) => {
    return originalSileo.success({
      ...opts,
      description: renderCustomDescription(opts) || opts.description,
    });
  },
  error: (opts: ExtendedToastOptions) => {
    return originalSileo.error({
      ...opts,
      description: renderCustomDescription(opts) || opts.description,
    });
  }
};

export const sileo = WrappedSileo;

function renderCustomDescription(opts: ExtendedToastOptions) {
  if (!opts.actionType) return null;

  switch (opts.actionType) {
    case "favorite_add":
      return (
        <div className="flex items-center justify-between w-full py-1">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-rose-500/20 opacity-20 blur-xl rounded-full" />
              <div className="relative w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-6 h-6 text-black fill-black" />
              </div>
            </motion.div>

            <div className="flex flex-col text-left">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white font-anton font-bold text-[17px] leading-tight uppercase tracking-wide"
              >
                {String(opts.description)}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 0.5, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white text-[12px]"
              >
                {opts.title}
              </motion.span>
            </div>
          </div>
        </div>
      );

    case "favorite_remove":
      return (
        <div className="flex items-center justify-between w-full py-1">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5"
            >
              <HeartOff className="w-5 h-5 text-white/40" />
            </motion.div>

            <div className="flex flex-col text-left">
              <span className="text-white/90 font-anton font-bold text-[17px] leading-tight uppercase tracking-wide">
                {String(opts.description)}
              </span>
              <span className="text-white/40 text-[12px]">
                {opts.title}
              </span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-40">
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      );

    case "favorite_error":
      return (
        <div className="flex items-center gap-4 py-1">
          <motion.div
            animate={{ x: [-4, 4, -4, 4, 0] }}
            transition={{ duration: 0.4 }}
            className="w-10 h-10 bg-[var(--danger)] opacity-20 rounded-2xl flex items-center justify-center"
          >
            <AlertCircle className="w-6 h-6 text-[var(--danger)]" />
          </motion.div>
          <div className="flex flex-col flex-1 text-left">
            <span className="font-bold text-[15px] leading-tight" style={{ color: 'var(--danger)' }}>
              {opts.title}
            </span>
            <span className="text-white/40 text-[12px] line-clamp-1">
              {String(opts.description)}
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function Toaster() {
  useEffect(() => {
    const handleDismissClick = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const target = e.target as HTMLElement;
      const toast = target.closest('[data-sileo-toast]') as HTMLElement;
      if (toast && !toast.classList.contains('is-dismissing')) {
        if (target.closest('[data-sileo-button]')) return;
        if (e.type === "contextmenu") e.preventDefault();
        toast.classList.add('is-dismissing');
        setTimeout(() => originalSileo.clear(), 300);
      }
    };
    document.addEventListener("click", handleDismissClick, true);
    document.addEventListener("contextmenu", handleDismissClick, true);
    return () => {
      document.removeEventListener("click", handleDismissClick, true);
      document.removeEventListener("contextmenu", handleDismissClick, true);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --sileo-duration: 700ms !important;
          --sileo-spring-easing: linear(
            0,
            0.016 1.4%,
            0.063 2.8%,
            0.138 4.3%,
            0.239 5.9%,
            0.36 7.7%,
            0.495 9.5%,
            0.64 11.6%,
            0.778 13.8%,
            0.9 16.2%,
            0.998 19%,
            1.066 22%,
            1.107 25.3%,
            1.121 29.1%,
            1.111 33.3%,
            1.082 38.2%,
            1.043 44.1%,
            1.009 51.5%,
            0.99 61.2%,
            0.993 74.9%,
            1
          ) !important;
          --sileo-width: 380px !important;
        }

        [data-sileo-viewport] {
          z-index: 99999 !important;
        }

        /* 
           Gán màu từ theme vào các biến nội bộ của Sileo 
           để các thông báo mặc định khác cũng tự động đổi màu theo theme.
        */
        [data-sileo-toast][data-sileo-type="success"] [data-sileo-title] {
          color: var(--primary) !important;
        }
        [data-sileo-toast][data-sileo-type="success"] [data-sileo-badge] {
          color: var(--primary) !important;
        }

        [data-sileo-toast][data-sileo-type="error"] [data-sileo-title] {
          color: var(--danger) !important;
        }
        [data-sileo-toast][data-sileo-type="error"] [data-sileo-badge] {
          color: var(--danger) !important;
        }

        [data-sileo-toast][data-sileo-type="warning"] [data-sileo-title] {
          color: var(--warning) !important;
        }
        [data-sileo-toast][data-sileo-type="warning"] [data-sileo-badge] {
          color: var(--warning) !important;
        }

        [data-sileo-title] {
          font-weight: 700 !important;
          font-size: 0.875rem !important;
        }

        [data-sileo-description] {
          font-weight: 500 !important;
          font-size: 0.925rem !important;
          padding: 12px 16px !important;
        }

        [data-sileo-badge] svg {
          stroke-width: 2.8 !important;
        }

        /* Ẩn badge mặc định của sileo khi đang hiển thị UI Custom để tránh bị lặp icon */
        [data-sileo-toast]:has([className*="flex"]) [data-sileo-header] {
           display: none !important;
        }

        @media (min-width: 768px) {
          [data-sileo-toast] {
            cursor: pointer !important;
            transition: transform 0.3s var(--sileo-spring-easing), opacity 0.3s ease, filter 0.3s ease !important;
          }
          [data-sileo-toast]:hover {
            transform: scale(1.02) !important;
            filter: brightness(1.2);
          }
          [data-sileo-toast].is-dismissing {
            pointer-events: none !important;
            opacity: 0 !important;
            transform: scale(0.9) translateY(-10px) !important; 
            filter: blur(4px) !important;
            transition: all 0.3s cubic-bezier(0.5, 0, 0.2, 1) !important;
          }
        }
      `}} />
      <OriginalToaster
        position="top-center"
        theme="light"
      />
    </>
  );
}
