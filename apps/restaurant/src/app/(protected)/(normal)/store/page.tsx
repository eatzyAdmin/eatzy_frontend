'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { useLoading, useNotification } from '@repo/ui';
import StoreHeader from '@/features/store/components/StoreHeader';
import StoreGeneralInfo from '@/features/store/components/StoreGeneralInfo';
import StoreLocation from '@/features/store/components/StoreLocation';
import StoreSchedule from '@/features/store/components/StoreSchedule';
import StoreMedia from '@/features/store/components/StoreMedia';
import StoreGeneralInfoEdit from '@/features/store/components/StoreGeneralInfoEdit';
import StoreLocationEdit from '@/features/store/components/StoreLocationEdit';
import StoreMediaEdit from '@/features/store/components/StoreMediaEdit';
import StoreScheduleEdit from '@/features/store/components/StoreScheduleEdit';
import { mockStore } from '@/features/store/data/mockStore';
import StoreSkeleton from '@/features/store/components/StoreSkeleton';

export default function StorePage() {
  const { hide } = useLoading();
  const { showNotification } = useNotification();

  const [store, setStore] = useState(mockStore);
  const [activeSection, setActiveSection] = useState<'general' | 'location' | 'schedule' | 'media' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure global loader is hidden and simulate local loading
  useEffect(() => {
    hide();
    // Simulate data fetching delay for shimmer effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [hide]);

  const handleUpdateStore = (updates: Partial<typeof mockStore>) => {
    setStore(prev => ({ ...prev, ...updates }));
    setActiveSection(null);
    showNotification({ message: 'Thông tin cửa hàng đã được cập nhật!', type: 'success', format: 'Nếu các thông tin chưa cập nhật ngay, hãy thử tải lại nhé.' });
  };

  if (isLoading) {
    return <StoreSkeleton />;
  }

  return (
    <div className="min-h-screen pb-20 pr-8 pl-4">
      <StoreHeader store={store} />

      <main className="px-8 -mt-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StoreGeneralInfo
                store={store}
                onEdit={() => setActiveSection('general')}
                layoutId="store-card-general"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StoreLocation
                store={store}
                onEdit={() => setActiveSection('location')}
                layoutId="store-card-location"
              />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col gap-8 h-full">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <StoreSchedule
                store={store}
                onEdit={() => setActiveSection('schedule')}
                layoutId="store-card-schedule"
              />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex-1">
              {/* Media currently view-only */}
              <StoreMedia
                store={store}
                onEdit={() => setActiveSection('media')}
                layoutId="store-card-media"
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* MODAL OVERLAYS */}
      <AnimatePresence>
        {activeSection === 'general' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSection(null)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div onClick={e => e.stopPropagation()}>
              <StoreGeneralInfoEdit
                store={store}
                onSave={handleUpdateStore}
                onClose={() => setActiveSection(null)}
                layoutId="store-card-general"
              />
            </div>
          </motion.div>
        )}

        {activeSection === 'location' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSection(null)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div onClick={e => e.stopPropagation()}>
              <StoreLocationEdit
                store={store}
                onSave={handleUpdateStore}
                onClose={() => setActiveSection(null)}
                layoutId="store-card-location"
              />
            </div>
          </motion.div>
        )}

        {activeSection === 'schedule' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSection(null)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div onClick={e => e.stopPropagation()}>
              <StoreScheduleEdit
                store={store}
                onSave={handleUpdateStore}
                onClose={() => setActiveSection(null)}
                layoutId="store-card-schedule"
              />
            </div>
          </motion.div>
        )}

        {activeSection === 'media' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSection(null)}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-8"
          >
            <div onClick={e => e.stopPropagation()}>
              <StoreMediaEdit
                store={store}
                onSave={handleUpdateStore}
                onClose={() => setActiveSection(null)}
                layoutId="store-card-media"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
