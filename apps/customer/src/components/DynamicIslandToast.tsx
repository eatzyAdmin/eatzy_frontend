"use client";

import { useEffect } from "react";
import { sileo as originalSileo, Toaster as OriginalToaster, SileoOptions } from "sileo";
import { renderCustomDescription, ExtendedToastOptions } from "./toasts/ToastRenderer";

const WrappedSileo = {
  ...originalSileo,
  success: (opts: ExtendedToastOptions) => {
    let fixedTitle = opts.title;
    if (opts.actionType === "order_cancel") fixedTitle = "Đơn Hàng Đã Được Hủy";
    if (opts.actionType === "order_place") fixedTitle = "Đặt hàng thành công";
    if (opts.actionType === "cart_add") fixedTitle = "Đã thêm vào giỏ hàng";

    return originalSileo.success({
      ...opts,
      title: fixedTitle,
      description: renderCustomDescription(opts) || opts.description,
    });
  },
  warning: (opts: ExtendedToastOptions) => {
    return originalSileo.warning({
      ...opts,
      description: renderCustomDescription(opts) || opts.description,
    });
  },
  error: (opts: ExtendedToastOptions) => {
    return originalSileo.error({
      ...opts,
      description: renderCustomDescription(opts) || opts.description,
    });
  },
  promise: <T,>(
    promise: Promise<T>,
    opts: {
      loading: ExtendedToastOptions;
      success: (data: T) => ExtendedToastOptions;
      error: (error: any) => ExtendedToastOptions;
    }
  ) => {
    return originalSileo.promise(promise, {
      loading: {
        ...opts.loading,
        title: opts.loading.actionType === "order_place" ? "Đang xử lý đơn hàng..." : opts.loading.title,
        description: renderCustomDescription(opts.loading) || opts.loading.description,
      },
      success: (data: T) => {
        const successOpts = opts.success(data);
        return {
          ...successOpts,
          title: successOpts.actionType === "order_place" ? "Đặt hàng thành công" : successOpts.title,
          description: renderCustomDescription(successOpts) || successOpts.description,
        };
      },
      error: (err: any) => {
        const errorOpts = opts.error(err);
        return {
          ...errorOpts,
          description: renderCustomDescription(errorOpts) || errorOpts.description,
        };
      },
    });
  }
};

export const sileo = WrappedSileo;

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
