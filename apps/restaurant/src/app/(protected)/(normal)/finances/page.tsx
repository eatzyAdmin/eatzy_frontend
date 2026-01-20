'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FinancesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/reports');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
        <p className="text-gray-400 font-medium">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}
