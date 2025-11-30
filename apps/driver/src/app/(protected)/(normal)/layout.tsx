"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "@repo/ui/motion";
import { Home, History, Wallet, User } from "@repo/ui/icons";

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const tabs = [
    { id: "home", label: "Home", href: "/home", Icon: Home },
    { id: "history", label: "History", href: "/history", Icon: History },
    { id: "wallet", label: "Wallet", href: "/wallet", Icon: Wallet },
    { id: "profile", label: "Profile", href: "/profile", Icon: User },
  ];
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="absolute inset-0">{children}</div>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-xl">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-auto mx-auto flex items-center justify-between gap-1 rounded-3xl border border-white/60 bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl px-1 py-1"
          >
            {tabs.map(({ id, label, href, Icon }) => {
              const active = pathname === href;
              return (
                <Link key={id} href={href} className="flex-1">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex flex-col items-center justify-center rounded-2xl px-2 py-1.5 transition-all ${
                      active
                        ? "bg-white text-[#1A1A1A] shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-[var(--primary)]/40"
                        : "text-[#1A1A1A] hover:bg-white/70"
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-xl ${active ? "text-[var(--primary)]" : "text-gray-600"}`}>
                      <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <span className={`mt-0.5 text-[10px] font-semibold ${active ? "text-[var(--primary)]" : "text-gray-700"}`}>{label}</span>
                  </motion.button>
                </Link>
              );
            })}
          </motion.nav>
        </div>
      </div>
    </div>
  );
}
