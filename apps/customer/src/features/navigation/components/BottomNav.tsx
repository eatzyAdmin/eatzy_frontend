'use client';

import { motion } from '@repo/ui/motion';
import { Home, History, Heart, User, Truck } from '@repo/ui/icons';
import { usePathname, useRouter } from 'next/navigation';

import { useBottomNav } from '@/features/navigation/context/BottomNavContext';

interface BottomNavProps {
  onCurrentOrdersClick: () => void;
  isOrdersOpen?: boolean;
}

export default function BottomNav({ onCurrentOrdersClick, isOrdersOpen }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isVisible } = useBottomNav();

  const tabs = [
    { name: 'Current Order', icon: Truck, action: onCurrentOrdersClick, id: 'orders', isActiveOverride: isOrdersOpen },
    { name: 'History', icon: History, path: '/order-history', id: 'history' },
    { name: 'Favorites', icon: Heart, path: '/favorites', id: 'favorites' },
    { name: 'Profile', icon: User, path: '/profile', id: 'profile' },
    { name: 'Home', icon: Home, path: '/home', id: 'home' },
  ];

  return (
    <div className="md:hidden fixed bottom-2 left-2 right-2 z-[40] pointer-events-none">
      <motion.div
        className="pointer-events-auto backdrop-blur-xl text-black rounded-[32px] border border-white/40 px-2 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 flex items-center justify-between"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : 200, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
      >
        {tabs.map((tab) => {
          const isActive = tab.isActiveOverride ?? (tab.path ? (pathname?.includes(tab.path) || (tab.path === '/home' && pathname === '/')) : false);

          return (
            <button
              key={tab.id}
              onClick={() => tab.path ? router.push(tab.path) : tab.action?.()}
              className={`flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ${isActive ? 'bg-black text-white shadow-lg scale-110' : 'text-gray-400 hover:bg-gray-200/50'
                }`}
            >
              <tab.icon className="w-6 h-6" strokeWidth={2.5} />
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
