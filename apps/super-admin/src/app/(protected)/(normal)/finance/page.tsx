'use client';

import { useEffect, useState } from 'react';
import { useTransactions } from '@/features/finance/hooks/useTransactions';
import FinanceTable from '@/features/finance/components/FinanceTable';
import { Plus, Download, TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import FinanceExportModal from '@/features/finance/components/FinanceExportModal';

export default function FinancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStr, setFilterStr] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'createdAt',
    direction: 'desc'
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useTransactions({
    searchTerm,
    filter: filterStr,
    sortField: sortConfig.field,
    sortDirection: sortConfig.direction,
    pageSize: 15
  });

  const transactions = data?.pages.flatMap((page) => page.result) || [];

  if (!mounted) return null;

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExport = async (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => {
    // Audit log for simulation - in real app, we'd trigger a backend download or use a lib like xlsx/jspdf
    console.log(`Exporting ${scope} audit as ${format} with columns:`, columns);
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
        <div>
          <h1 className="text-5xl font-anton uppercase tracking-tighter text-gray-900 mb-2">
            Financial <span className="text-primary italic">Ledger</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-md leading-relaxed">
            Real-time audit trail of all platform wallet activities and payment flows.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExportOpen(true)}
            className="group flex items-center gap-4 px-8 py-5 bg-white border border-gray-100 rounded-[28px] shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Export Data</span>
              <span className="text-sm font-anton text-gray-900 group-hover:text-primary transition-colors uppercase">Audit Report</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
              <Download size={20} />
            </div>
          </button>
        </div>
      </div>

      <FinanceTable
        data={transactions}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={fetchNextPage}
        onRefresh={() => refetch()}
        onSearch={(term) => setSearchTerm(term)}
        onFilter={(query) => setFilterStr(query)}
        searchTerm={searchTerm}
        onSort={handleSort}
        sortField={sortConfig.field}
        sortDirection={sortConfig.direction}
      />

      <FinanceExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onExport={handleExport}
        previewData={transactions.slice(0, 10)}
      />
    </div>
  );
}
