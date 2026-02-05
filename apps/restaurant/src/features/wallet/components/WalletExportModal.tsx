'use client';

import React from 'react';
import {
  Hash, AlignLeft, FileType, LayoutGrid, CreditCard,
  CheckCircle, Calendar
} from 'lucide-react';
import { ExportDataModal, ColumnGroup } from '@repo/ui';

// Define Column Groups Configuration for Wallet
const COLUMN_GROUPS: Record<string, ColumnGroup> = {
  general: {
    label: 'General Info',
    icon: <Hash className="w-4 h-4" />,
    columns: [
      { key: 'id', label: 'Transaction ID', icon: <Hash className="w-3 h-3" /> },
      { key: 'description', label: 'Description', icon: <AlignLeft className="w-3 h-3" /> },
      { key: 'type', label: 'Type', icon: <FileType className="w-3 h-3" /> },
      { key: 'category', label: 'Category', icon: <LayoutGrid className="w-3 h-3" /> }
    ]
  },
  financial: {
    label: 'Financial Details',
    icon: <CreditCard className="w-4 h-4" />,
    columns: [
      { key: 'amount', label: 'Amount', icon: <CreditCard className="w-3 h-3" /> },
      { key: 'status', label: 'Status', icon: <CheckCircle className="w-3 h-3" /> }
    ]
  },
  time: {
    label: 'Time & Date',
    icon: <Calendar className="w-4 h-4" />,
    columns: [
      { key: 'date', label: 'Date & Time', icon: <Calendar className="w-3 h-3" /> }
    ]
  }
};

interface WalletExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => Promise<void>;
  previewData?: Record<string, unknown>[];
}

const WalletExportModal: React.FC<WalletExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  previewData = []
}) => {
  const formatCell = (item: Record<string, unknown>, key: string) => {
    const val = item[key];
    if (key === 'amount' && (typeof val === 'number' || typeof val === 'bigint')) return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    if (key === 'date' && (typeof val === 'string' || typeof val === 'number' || val instanceof Date)) return new Date(val).toLocaleDateString('vi-VN');
    if (key === 'status' && typeof val === 'string') return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${val === 'success' ? 'bg-green-100 text-green-700' :
        val === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
        {val}
      </span>
    );
    if (key === 'type' && typeof val === 'string') return <span className="capitalize">{val}</span>;
    return String(val);
  };

  return (
    <ExportDataModal<Record<string, unknown>>
      isOpen={isOpen}
      onClose={onClose}
      title="EXPORT DATA"
      columnGroups={COLUMN_GROUPS}
      previewData={previewData}
      onExport={onExport}
      formatCell={formatCell}
      scopeLabels={{
        current: { title: 'Current View', desc: 'Export based on current filters' },
        all: { title: 'All Transactions', desc: 'Export complete transaction history' }
      }}
      successMessage="Your transaction data has been exported successfully."
      errorMessage="An error occurred while generating your file."
    />
  );
};

export default WalletExportModal;
