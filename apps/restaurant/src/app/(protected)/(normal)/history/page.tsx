'use client';

import { useState, useEffect } from 'react';
import OrderHistoryTable from '@/features/history/components/OrderHistoryTable';
import { useLoading } from '@repo/ui';

export default function OrderHistoryPage() {
  const { hide } = useLoading();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hide();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [hide]);

  if (isLoading) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <div className="min-h-screen pb-20 px-6 pt-8 w-full max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-anton font-bold text-[#1A1A1A] mb-2">Order History</h1>
        <p className="text-gray-500 font-medium text-lg">View and manage your past order records.</p>
      </div>



      {/* Main Table Content - Full Width */}
      <div className="mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <OrderHistoryTable />
      </div>
    </div>
  );
}
