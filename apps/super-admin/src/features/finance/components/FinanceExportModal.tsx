'use client';

import React from 'react';
import {
  FileText, CheckCircle, Calendar, CreditCard, Hash, User,
  Wallet, Info
} from 'lucide-react';
import { WalletTransactionResponse } from '@repo/types';
import { ExportDataModal, ColumnGroup } from '@repo/ui';

// Define Column Groups Configuration for Finance
const COLUMN_GROUPS: Record<string, ColumnGroup> = {
  general: {
    label: 'Transaction Details',
    icon: <Hash className="w-4 h-4" />,
    columns: [
      { key: 'id', label: 'Reference ID', icon: <Hash className="w-3 h-3" /> },
      { key: 'createdAt', label: 'Process Date', icon: <Calendar className="w-3 h-3" /> },
      { key: 'transactionType', label: 'Entry Type', icon: <Info className="w-3 h-3" /> },
      { key: 'status', label: 'Audit Status', icon: <CheckCircle className="w-3 h-3" /> }
    ]
  },
  account: {
    label: 'Account Identity',
    icon: <User className="w-4 h-4" />,
    columns: [
      { key: 'userName', label: 'Owner Name', icon: <User className="w-3 h-3" /> },
      { key: 'description', label: 'Audit Log', icon: <FileText className="w-3 h-3" /> }
    ]
  },
  financial: {
    label: 'Ledger Impact',
    icon: <CreditCard className="w-4 h-4" />,
    columns: [
      { key: 'amount', label: 'Transferred Amount', icon: <CreditCard className="w-3 h-3" /> },
      { key: 'balanceAfter', label: 'Running Balance', icon: <Wallet className="w-3 h-3" /> }
    ]
  }
};

interface FinanceExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => Promise<void>;
  previewData?: WalletTransactionResponse[];
}

const FinanceExportModal: React.FC<FinanceExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  previewData = []
}) => {
  const formatCell = (item: WalletTransactionResponse, key: string) => {
    if (key === 'id') return `TX-${item.id.toString().padStart(6, '0')}`;
    if (key === 'amount') return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount);
    if (key === 'balanceAfter') return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.balanceAfter);
    if (key === 'createdAt') return new Date(item.createdAt).toLocaleDateString('vi-VN');
    if (key === 'userName') return item.wallet.user.name;
    if (key === 'transactionType') return item.transactionType.replace('_', ' ');
    if (key === 'status') {
      const status = item.status as string;
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status === 'SUCCESS' || status === 'COMPLETED' ? 'bg-lime-100 text-lime-700' :
          status === 'FAILED' || status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
            status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
              'bg-gray-100 text-gray-700'
          }`}>
          {status}
        </span>
      );
    }
    return (item as any)[key];
  };

  return (
    <ExportDataModal<WalletTransactionResponse>
      isOpen={isOpen}
      onClose={onClose}
      title="FINANCE REPORT"
      columnGroups={COLUMN_GROUPS}
      previewData={previewData}
      onExport={onExport}
      formatCell={formatCell}
      scopeLabels={{
        current: { title: 'Current View', desc: 'Export based on current filters' },
        all: { title: 'All History', desc: 'Export platform ledger history' }
      }}
      successMessage="Platform ledger has been exported successfully."
      errorMessage="An error occurred while generating audit report."
    />
  );
};

export default FinanceExportModal;
