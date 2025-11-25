"use client";
import { formatVnd } from "@repo/lib";
import { motion } from "@repo/ui/motion";
import { ChefHat } from "@repo/ui/icons";

export default function CheckoutSummary({ subtotal, fee, discount }: { subtotal: number; fee: number; discount: number }) {
  return (
    <div className="relative overflow-hidden rounded-[22px] border-2 border-dashed border-gray-200 shadow-sm">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
    url('/images/HoaTiet_4.png'),
    url('/images/HoaTiet_4.png'),

    repeating-conic-gradient(
      from 0deg at 50% 50%,
      transparent 0deg,
      rgba(120,200,65,0.065) 2deg,
      transparent 4deg,
      rgba(120,200,65,0.052) 6deg,
      transparent 8deg,
      rgba(120,200,65,0.039) 10deg,
      transparent 12deg,
      rgba(120,200,65,0.0455) 14deg,
      transparent 16deg,
      rgba(120,200,65,0.0585) 18deg,
      transparent 20deg,
      rgba(120,200,65,0.052) 22deg,
      transparent 24deg,
      rgba(120,200,65,0.039) 26deg,
      transparent 28deg,
      rgba(120,200,65,0.065) 30deg,
      transparent 32deg,
      rgba(120,200,65,0.0455) 34deg,
      transparent 36deg
    ),

    repeating-conic-gradient(
      from 10deg at 50% 50%,
      transparent 0deg,
      rgba(120,200,65,0.0455) 1.5deg,
      transparent 3deg,
      rgba(120,200,65,0.039) 4.5deg,
      transparent 6deg,
      rgba(120,200,65,0.0585) 7.5deg,
      transparent 9deg,
      rgba(120,200,65,0.052) 10.5deg,
      transparent 12deg,
      rgba(120,200,65,0.039) 13.5deg,
      transparent 15deg,
      rgba(120,200,65,0.065) 16.5deg,
      transparent 18deg
    ),

    url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60,20 Q80,40 60,60 Q40,80 60,100 Q80,80 100,60 Q80,40 60,20 Z' stroke='rgba(120,200,65,0.052)' stroke-width='1' fill='none'/%3E%3Cpath d='M60,30 Q75,45 60,60 Q45,75 60,90 Q75,75 90,60 Q75,45 60,30 Z' stroke='rgba(120,200,65,0.0455)' stroke-width='0.8' fill='none'/%3E%3C/svg%3E"),

    url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40,10 Q60,20 65,40 Q60,60 40,70 Q20,60 15,40 Q20,20 40,10 Z' stroke='rgba(120,200,65,0.052)' stroke-width='0.8' fill='none'/%3E%3Cpath d='M40,20 Q55,30 55,40 Q55,50 40,60 Q25,50 25,40 Q25,30 40,20 Z' stroke='rgba(120,200,65,0.0364)' stroke-width='0.6' fill='none'/%3E%3C/svg%3E"),

    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(120,200,65,0.0255) 2px,
      rgba(120,200,65,0.0225) 2.5px,
      transparent 2.5px,
      transparent 8px
    ),

    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(120,200,65,0.0255) 2px,
      rgba(120,200,65,0.0225) 2.5px,
      transparent 2.5px,
      transparent 8px
    ),

    url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,8 Q45,15 48,30 Q45,45 30,52 Q15,45 12,30 Q15,15 30,8 Z' stroke='rgba(120,200,65,0.052)' stroke-width='0.5' fill='none'/%3E%3Cpath d='M30,15 Q40,20 42,30 Q40,40 30,45 Q20,40 18,30 Q20,20 30,15 Z' stroke='rgba(120,200,65,0.039)' stroke-width='0.4' fill='none'/%3E%3C/svg%3E"),

    url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15,30 C25,10 45,10 55,30 C45,50 25,50 15,30 Z M20,30 C28,15 42,15 50,30 C42,45 28,45 20,30 Z' stroke='rgba(120,200,65,0.058)' stroke-width='0.7' fill='none'/%3E%3C/svg%3E"),

    url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60,20 L80,60 L60,100 L40,60 Z M60,35 L70,60 L60,85 L50,60 Z' stroke='rgba(120,200,65,0.058)' stroke-width='0.9' fill='none'/%3E%3C/svg%3E"),

    repeating-linear-gradient(
      22.5deg,
      transparent,
      transparent 1.5px,
      rgba(120,200,65,0.029) 1.5px,
      rgba(120,200,65,0.029) 2px,
      transparent 2px,
      transparent 6px
    ),

    repeating-linear-gradient(
      67.5deg,
      transparent,
      transparent 1.5px,
      rgba(120,200,65,0.029) 1.5px,
      rgba(120,200,65,0.029) 2px,
      transparent 2px,
      transparent 6px
    )
  `,
          backgroundSize:
            "700px 700px, 600px 600px, 120px 120px, 120px 120px, 120px 120px, 80px 80px, 24px 24px, 24px 24px, 60px 60px, 60px 60px, 120px 120px, 18px 18px, 18px 18px",
          backgroundPosition:
            "calc(50% - 450px) calc(50% - 610px), center center, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0",
          backgroundRepeat:
            "no-repeat, no-repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.18,
          backgroundImage: `radial-gradient(circle at 25% 50%, rgba(0,0,0,0.06) 2px, transparent 2px), radial-gradient(circle at 75% 25%, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "120px 120px, 180px 180px",
        }}
      />
      <motion.div
        className="absolute -top-10 -right-10 opacity-60 z-10"
        animate={{ rotate: [8, 12, 8], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-28 h-28 relative">
          <div className="absolute inset-0 border-4 border-[var(--primary)] rounded-full" />
          <div className="absolute inset-2 border-2 border-[var(--primary)] rounded-full" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
            <path
              id="top-arc"
              d="M 64,64 m -45,0 a 45,45 0 0,1 90,0"
              fill="none"
            />
            <text
              className="font-bold"
              style={{ fontSize: "8px", fill: "var(--primary)" }}
            >
              <textPath href="#top-arc" startOffset="50%" textAnchor="middle">
                · EATZY ·
              </textPath>
            </text>
          </svg>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
            <path
              id="bottom-arc"
              d="M 64,64 m -52,0 a 52,52 0 1,0 104,0"
              fill="none"
            />
            <text
              className="font-bold"
              style={{ fontSize: "8px", fill: "var(--primary)" }}
            >
              <textPath
                href="#bottom-arc"
                startOffset="50%"
                textAnchor="middle"
              >
                EAT EATZY, EAT EASY
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-6 border-2 border-[var(--primary)] rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center text-[var(--primary)]">
            <ChefHat size={24} />
          </div>
        </div>
      </motion.div>
      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="absolute -right-2 top-6 w-4 h-4 bg-[#F7F7F7] rounded-full border border-gray-200" />
      <div className="relative p-5 z-20">
        <div className="text-[14px] font-semibold text-[#1A1A1A] mb-4" style={{ fontFamily: "monospace" }}>
          THANH TOÁN
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[14px]" style={{ fontFamily: "monospace" }}>
            <div>Tạm tính</div>
            <div className="font-medium">{formatVnd(subtotal)}</div>
          </div>
          <div className="flex items-center justify-between text-[14px]" style={{ fontFamily: "monospace" }}>
            <div>Phí áp dụng</div>
            <div className="font-medium">{formatVnd(fee)}</div>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-[14px]" style={{ fontFamily: "monospace" }}>
              <div>Giảm giá</div>
              <div className="font-medium text-green-700">
                - {formatVnd(discount)}
              </div>
            </div>
          )}
        </div>
        <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[var(--secondary)]/6 to-[var(--primary)]/6 p-4"
        >
          <div className="flex flex-col items-center justify-between" style={{ fontFamily: "monospace" }}>
            <div className="text-[13px] text-[#555]">Tổng số tiền</div>
            <div className="text-2xl font-bold text-[var(--primary)]">
              {formatVnd(Math.max(0, subtotal + fee - discount))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
