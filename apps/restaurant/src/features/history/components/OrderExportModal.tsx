'use client';

import React from 'react';
import {
  Hash, Calendar, CheckCircle, ShoppingBag, User,
  Phone, MapPin, CreditCard, LayoutGrid
} from 'lucide-react';
import { OrderHistoryItem } from '@repo/types';
import { ExportDataModal, ColumnGroup } from '@repo/ui';

// Define Column Groups Configuration for Orders
const COLUMN_GROUPS: Record<string, ColumnGroup> = {
  general: {
    label: 'Order Details',
    icon: <Hash className="w-4 h-4" />,
    columns: [
      { key: 'id', label: 'Order ID', icon: <Hash className="w-3 h-3" /> },
      { key: 'createdAt', label: 'Date', icon: <Calendar className="w-3 h-3" /> },
      { key: 'status', label: 'Status', icon: <CheckCircle className="w-3 h-3" /> },
      { key: 'itemsCount', label: 'Items Count', icon: <ShoppingBag className="w-3 h-3" /> }
    ]
  },
  customer: {
    label: 'Customer Info',
    icon: <User className="w-4 h-4" />,
    columns: [
      { key: 'customerName', label: 'Customer Name', icon: <User className="w-3 h-3" /> },
      { key: 'customerPhone', label: 'Phone', icon: <Phone className="w-3 h-3" /> },
      { key: 'driverName', label: 'Driver', icon: <MapPin className="w-3 h-3" /> }
    ]
  },
  financial: {
    label: 'Financial',
    icon: <CreditCard className="w-4 h-4" />,
    columns: [
      { key: 'totalAmount', label: 'Total Amount', icon: <CreditCard className="w-3 h-3" /> },
      { key: 'paymentMethod', label: 'Payment Method', icon: <LayoutGrid className="w-3 h-3" /> }
    ]
  }
};

interface OrderExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel', scope: 'current' | 'all', columns: string[]) => Promise<void>;
  previewData?: OrderHistoryItem[];
}

const OrderExportModal: React.FC<OrderExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  previewData = []
}) => {
  const formatCell = (item: OrderHistoryItem, key: string) => {
    const val = item[key as keyof OrderHistoryItem];
    if (key === 'totalAmount') return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
    if (key === 'createdAt') return new Date(val as string).toLocaleDateString('vi-VN');
    if (key === 'status') {
      const status = val as string;
      return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${status === 'completed' ? 'bg-lime-100 text-lime-700' :
          status === 'cancelled' ? 'bg-red-100 text-red-700' :
            status === 'refunded' ? 'bg-orange-100 text-orange-700' :
              'bg-gray-100 text-gray-700'
          }`}>
          {status}
        </span>
      );
    }
    if (key === 'itemsCount') return `${val} items`;
    if (key === 'paymentMethod') return <span className="uppercase">{val as string}</span>;
    if (key === 'driverName' && !val) return <span className="text-gray-300">-</span>;
    return val as React.ReactNode;
  };

  return (
    <ExportDataModal<OrderHistoryItem>
      isOpen={isOpen}
      onClose={onClose}
      title="EXPORT ORDERS"
      columnGroups={COLUMN_GROUPS}
      previewData={previewData}
      onExport={onExport}
      formatCell={formatCell}
      scopeLabels={{
        current: { title: 'Current View', desc: 'Export based on current filters' },
        all: { title: 'All Orders', desc: 'Export complete order history' }
      }}
      successMessage="Your order history has been exported successfully."
      errorMessage="An error occurred while generating your file."
    />
  );
};

export default OrderExportModal;
