"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "@repo/ui/motion";
import { Home, History, Wallet, User } from "@repo/ui/icons";

import { NormalLoadingProvider, useNormalLoading, NormalLoadingOverlay } from "./context/NormalLoadingContext";

function Navigation() {
  const pathname = usePathname();
  const { startLoading } = useNormalLoading();
  const tabs = [
    { id: "home", label: "Home", href: "/home", Icon: Home },
    { id: "history", label: "History", href: "/history", Icon: History },
    { id: "wallet", label: "Wallet", href: "/wallet", Icon: Wallet },
    { id: "profile", label: "Profile", href: "/profile", Icon: User },
  ];

  return (
    <nav className="pointer-events-auto mx-auto flex w-full items-center gap-2 rounded-full border border-gray-200 bg-white p-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
      {tabs.map(({ id, label, href, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={id}
            href={href}
            onClick={() => pathname !== href && startLoading()}
            className={`group relative flex h-14 items-center justify-center overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${active ? "flex-[2.5]" : "flex-1"
              }`}
          >
            {/* Background pill */}
            <div
              className={`absolute inset-0 transition-colors duration-500 ${active ? "bg-[var(--primary)]" : "bg-transparent group-hover:bg-gray-50"
                }`}
            />

            {/* Content */}
            <div className={`relative z-10 flex items-center justify-center gap-2 px-2 ${active ? "text-white" : "text-gray-400"}`}>
              <Icon size={24} strokeWidth={active ? 2.5 : 2} className="shrink-0" />

              <AnimatePresence mode="wait">
                {active && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="whitespace-nowrap font-bold text-sm overflow-hidden font-anton tracking-wide"
                    style={{ fontFamily: 'var(--font-anton), sans-serif' }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  return (
    <NormalLoadingProvider>
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0">{children}</div>
        <NormalLoadingOverlay />
        <div className="pointer-events-none absolute inset-0 z-50">
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-xl">
            <Navigation />
          </div>
        </div>
      </div>
    </NormalLoadingProvider>
  );
}
