'use client';

import React, { useMemo } from 'react';
import { TableFilterBadges, BadgeTheme } from '@repo/ui';
import {
  CheckCircle, Calendar, Banknote, XCircle,
  ArrowUpCircle, ArrowDownCircle
} from '@repo/ui/icons';

interface WalletFilterBadgesProps {
  filterFields: {
    status: string;
    dateRange: { from: Date | null; to: Date | null };
    amountRange: { min: number; max: number };
  };
  onApplyFilters: (filters: any) => void;
}

export default function WalletFilterBadges({ filterFields, onApplyFilters }: WalletFilterBadgesProps) {
  const filterBadges = useMemo(() => {
    const configs = [
      {
        id: 'status',
        label: 'Status Check',
        icon: (f: typeof filterFields) => f.status === 'failed' ? <XCircle size={16} /> : <CheckCircle size={16} />,
        theme: (f: typeof filterFields) => f.status === 'failed' ? 'red' as BadgeTheme : 'lime' as BadgeTheme,
        getValue: (f: typeof filterFields) => f.status.charAt(0).toUpperCase() + f.status.slice(1),
        onRemove: () => onApplyFilters({ ...filterFields, status: '' })
      },
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
        icon: (f: typeof filterFields) => {
          if (f.amountRange.max <= 0 && f.amountRange.min < 0) return <ArrowDownCircle size={16} />;
          if (f.amountRange.min >= 0 && f.amountRange.max > 0) return <ArrowUpCircle size={16} />;
          return <Banknote size={16} />;
        },
        theme: 'lime' as BadgeTheme,
        getValue: (f: typeof filterFields) => (f.amountRange.min !== -100000000 || f.amountRange.max !== 100000000)
          ? `${f.amountRange.min.toLocaleString()} - ${f.amountRange.max.toLocaleString()}`
          : null,
        onRemove: () => onApplyFilters({ ...filterFields, amountRange: { min: -100000000, max: 100000000 } })
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
          icon: typeof config.icon === 'function' ? config.icon(filterFields) : config.icon,
          theme: typeof config.theme === 'function' ? config.theme(filterFields) : config.theme,
          onRemove: config.onRemove
        };
      })
      .filter((b): b is any => b !== null);
  }, [filterFields, onApplyFilters]);

  return <TableFilterBadges badges={filterBadges} />;
}
