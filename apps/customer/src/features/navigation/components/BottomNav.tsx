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
    { name: 'Orders', icon: Truck, action: onCurrentOrdersClick, id: 'orders', isActiveOverride: isOrdersOpen },
    { name: 'History', icon: History, path: '/order-history', id: 'history' },
    { name: 'Home', icon: Home, path: '/home', id: 'home' },
    { name: 'Favorites', icon: Heart, path: '/favorites', id: 'favorites' },
    { name: 'Profile', icon: User, path: '/profile', id: 'profile' },
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
              onClick={() => tab.path ? router.replace(tab.path) : tab.action?.()}
              className="flex flex-col items-center justify-center flex-1 h-[60px] transition-all duration-300 gap-0"
            >
              <div className={`flex items-center justify-center rounded-full transition-all duration-300 relative z-10
                ${tab.id === 'home'
                  ? (isActive ? 'w-14 h-14 mx-3 bg-black text-white shadow-lg scale-110' : 'w-14 h-14 mx-3 bg-white/20 text-gray-400 scale-110')
                  : (isActive ? 'w-12 h-12 bg-black text-white shadow-md scale-110' : 'w-12 h-12 text-gray-400 active:bg-gray-200/50 active:scale-95')
                }`}
              >
                <tab.icon className={tab.id === 'home' ? "w-7 h-7" : "w-6 h-6"} strokeWidth={2.5} />
              </div>
              {tab.id !== 'home' && (
                <span className={`text-[10px] font-bold whitespace-nowrap text-gray-400 relative z-20 transition-all duration-300 ${isActive ? 'mt-1' : 'mt-[-5px]'}`}>
                  {tab.name}
                </span>
              )}
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
