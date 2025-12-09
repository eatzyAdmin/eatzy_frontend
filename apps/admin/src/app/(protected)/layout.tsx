import type { ReactNode } from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-[280px] transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
