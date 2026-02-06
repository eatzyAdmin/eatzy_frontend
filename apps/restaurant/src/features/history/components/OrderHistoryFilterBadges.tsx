'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import {
  Package, CreditCard, CheckCircle, Calendar, Banknote,
  Clock, Utensils, Bike, Truck, MapPin, XCircle, Wallet, RotateCcw
} from '@repo/ui/icons';

interface OrderHistoryFilterBadgesProps {
  filterFields: {
    status: string;
    paymentMethod: string[];
    paymentStatus: string;
    dateRange: { from: Date | null; to: Date | null };
    amountRange: { min: number; max: number };
  };
  onApplyFilters: (filters: any) => void;
}

export default function OrderHistoryFilterBadges({ filterFields, onApplyFilters }: OrderHistoryFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs = [
      {
        id: 'dateRange',
        label: 'Time Horizon',
        icon: <Calendar size={16} />,
        theme: 'lime' as BadgeTheme,
        getValue: (f: typeof filterFields) => (f.dateRange.from || f.dateRange.to)
          ? `${f.dateRange.from?.toLocaleDateString() ?? ''} - ${f.dateRange.to?.toLocaleDateString() ?? ''}`
          : null,
        onRemove: () => onApplyFilters({ ...filterFields, dateRange: { from: null, to: null } })
      },
      {
        id: 'amountRange',
        label: 'Amount Scope',
        icon: <Banknote size={16} />,
        theme: 'lime' as BadgeTheme,
        getValue: (f: typeof filterFields) => (f.amountRange.min > 0 || f.amountRange.max < 100000000)
          ? `${f.amountRange.min.toLocaleString()} Đ - ${f.amountRange.max.toLocaleString()} Đ`
          : null,
        onRemove: () => onApplyFilters({ ...filterFields, amountRange: { min: 0, max: 100000000 } })
      },
      {
        id: 'paymentMethod',
        label: 'Billing Flow',
        icon: (f: typeof filterFields) => {
          if (f.paymentMethod.length > 0) {
            return f.paymentMethod.map(m => {
              if (m === 'COD') return <Banknote size={16} />;
              if (m === 'VNPAY') return <CreditCard size={16} />;
              if (m === 'WALLET') return <Wallet size={16} />;
              return <CreditCard size={16} />;
            });
          }
          return <CreditCard size={16} />;
        },
        theme: 'lime' as BadgeTheme,
        getValue: (f: typeof filterFields) => {
          if (f.paymentMethod.length === 0) return null;
          const labels: Record<string, string> = {
            'COD': 'COD',
            'VNPAY': 'VNPAY',
            'WALLET': 'Wallet'
          };
          return f.paymentMethod.map(m => labels[m] || m).join(', ');
        },
        onRemove: () => onApplyFilters({ ...filterFields, paymentMethod: [] })
      },
      {
        id: 'paymentStatus',
        label: 'Settlement',
        icon: (f: typeof filterFields) => {
          if (f.paymentStatus === 'PAID') return <CheckCircle size={16} />;
          if (f.paymentStatus === 'UNPAID') return <Clock size={16} />;
          if (f.paymentStatus === 'REFUNDED') return <RotateCcw size={16} />;
          return <CheckCircle size={16} />;
        },
        theme: (f: typeof filterFields) => (f.paymentStatus === 'UNPAID' ? 'amber' : f.paymentStatus === 'REFUNDED' ? 'red' : 'lime') as BadgeTheme,
        getValue: (f: typeof filterFields) => {
          const labels: Record<string, string> = {
            'PAID': 'Fully Paid',
            'UNPAID': 'Outstanding',
            'REFUNDED': 'Reversed'
          };
          return labels[f.paymentStatus] || f.paymentStatus;
        },
        onRemove: () => onApplyFilters({ ...filterFields, paymentStatus: '' })
      },
      {
        id: 'status',
        label: 'Logistics',
        getValue: (f: typeof filterFields) => f.status,
        icon: (f: typeof filterFields) => {
          if (f.status === 'Pending Ops') return <Clock size={16} />;
          if (f.status === 'In Kitchen') return <Utensils size={16} />;
          if (f.status === 'Ready to Ship') return <Package size={16} />;
          if (f.status === 'Driver Out') return <Bike size={16} />;
          if (f.status === 'In Transit') return <Truck size={16} />;
          if (f.status === 'Nearby') return <MapPin size={16} />;
          if (f.status === 'Have Dinner') return <CheckCircle size={16} />;
          if (f.status === 'Voided') return <XCircle size={16} />;
          return <Package size={16} />;
        },
        theme: (f: typeof filterFields) => {
          const yellow = ['Pending Ops', 'In Kitchen', 'Ready to Ship', 'Driver Out', 'In Transit'];
          if (yellow.includes(f.status)) return 'amber' as BadgeTheme;
          if (f.status === 'Voided') return 'red' as BadgeTheme;
          return 'lime' as BadgeTheme;
        },
        onRemove: () => onApplyFilters({ ...filterFields, status: '' })
      },
    ];

    return configs
      .map(config => {
        const value = config.getValue(filterFields);
        if (!value) return null;
        return {
          id: config.id,
          label: config.label,
          value: value,
          icon: typeof config.icon === 'function' ? (config.icon as Function)(filterFields) : config.icon,
          theme: typeof config.theme === 'function' ? config.theme(filterFields) : config.theme,
          onRemove: config.onRemove
        };
      })
      .filter((b): b is any => b !== null);
  }, [filterFields, onApplyFilters]);

  return <TableFilterBadges badges={filterBadges} />;
}
