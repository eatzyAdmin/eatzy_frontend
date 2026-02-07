'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@repo/ui/motion';
import { useLoading } from '@repo/ui';
import StoreHeader from '@/features/store/components/StoreHeader';
import StoreGeneralInfo from '@/features/store/components/StoreGeneralInfo';
import StoreLocation from '@/features/store/components/StoreLocation';
import StoreSchedule from '@/features/store/components/StoreSchedule';
import StoreGeneralInfoEdit from '@/features/store/components/StoreGeneralInfoEdit';
import StoreLocationEdit from '@/features/store/components/StoreLocationEdit';
import StoreScheduleEdit from '@/features/store/components/StoreScheduleEdit';
import StoreSkeleton from '@/features/store/components/StoreSkeleton';
import { useMyStore, useUpdateStore } from '@/features/store/hooks';

export default function StorePage() {
  const { hide } = useLoading();

  const [activeSection, setActiveSection] = useState<'general' | 'location' | 'schedule' | null>(null);

  // Fetch store data
  const { store, isLoading } = useMyStore();
  const { updateStore, isUpdating } = useUpdateStore();

  // Ensure global loader is hidden
  useEffect(() => {
    hide();
  }, [hide]);

  const handleUpdateStore = async (updates: Record<string, any>) => {
    await updateStore(updates);
    setActiveSection(null);
  };

  if (isLoading || !store) {
    return <StoreSkeleton />;
  }

  return (
    <div className="min-h-screen pb-20 pr-8 pl-4 bg-gray-50/30">
      <StoreHeader store={store} />

      <main className="px-8 -mt-20 relative z-10 w-full max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-8">
          {/* Top Section - General Info takes full width for a more prominent look */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StoreGeneralInfo
              store={store}
              onEdit={() => setActiveSection('general')}
              layoutId="store-card-general"
            />
          </motion.div>

          {/* Bottom Section - Location and Schedule side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <motion.div
              className="lg:col-span-7 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StoreLocation
                store={store}
                onEdit={() => setActiveSection('location')}
                layoutId="store-card-location"
              />
            </motion.div>

            <motion.div
              className="lg:col-span-5 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StoreSchedule
                store={store}
                onEdit={() => setActiveSection('schedule')}
                layoutId="store-card-schedule"
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
      </AnimatePresence>
    </div>
  );
}
